import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { dayKey } from "@/core/utils/time";
import {
  DayPrayerTimes,
  ObligatoryPrayer,
  PrayerEntry,
} from "@/features/prayerTimes/prayerTimes.types";
import { ModeCheckFn } from "@/features/modes/mode.types";
import { AlarmManager } from "./AlarmManager";
import { InAppAlarmScheduler } from "./InAppAlarmScheduler";
import { alarmRegistry } from "./AlarmRegistry";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmKitUuidForKey, logicalAlarmKey } from "./AlarmKitUuid";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { alarmAlertTracker } from "./AlarmAlertTracker";
import { alarmRingPromptScheduler } from "./AlarmRingPromptScheduler";
import { alarmContinuityStore } from "./AlarmContinuityStore";
import { AlarmFireInstant } from "./AlarmFireInstant";

export interface AlarmSyncOptions {
  isAlertEnabled: (prayer: ObligatoryPrayer) => boolean;
  isModeEnabled: ModeCheckFn;
  soundName?: string;
}

interface AlarmCandidate {
  prayer: ObligatoryPrayer;
  entry: PrayerEntry;
  fireAt: Date;
  logicalId: string;
}

/**
 * Schedules smart alarms for "alarm" mode prayers via AlarmKit. In-app timers
 * are only used when AlarmKit is unavailable on the device.
 */
export class AlarmScheduler {
  private syncInFlight: Promise<void> | null = null;

  constructor(
    private readonly alarms: AlarmManager,
    private readonly fallback: InAppAlarmScheduler
  ) {}

  async sync(days: DayPrayerTimes[], options: AlarmSyncOptions): Promise<void> {
    if (this.syncInFlight) await this.syncInFlight;
    this.syncInFlight = this.runSync(days, options).finally(() => {
      this.syncInFlight = null;
    });
    return this.syncInFlight;
  }

  async cancelAll(): Promise<void> {
    if (this.isSyncBlocked()) return;
    this.fallback.cancelAll();
    await this.cancelTracked();
    storage.setObject(StorageKeys.alarmScheduledIds, []);
    alarmRegistry.prune([]);
    alarmFireRegistry.prune([]);
  }

  private async runSync(days: DayPrayerTimes[], options: AlarmSyncOptions): Promise<void> {
    if (this.isSyncBlocked()) return;

    this.fallback.cancelAll();
    alarmRingPromptScheduler.cancelAll();

    const candidates = this.collectCandidates(days, options);
    if (!candidates.length) {
      if (this.isSyncBlocked()) return;
      await this.cancelTracked();
      await this.alarms.reconcileNativeAlarms(new Set());
      storage.setObject(StorageKeys.alarmScheduledIds, []);
      alarmRegistry.prune([]);
      alarmFireRegistry.prune([]);
      return;
    }

    if (this.alarms.isSupported) {
      await this.syncAlarmKit(candidates, options);
      return;
    }

    await this.fallback.sync(days, options);
  }

  private collectCandidates(
    days: DayPrayerTimes[],
    options: AlarmSyncOptions
  ): AlarmCandidate[] {
    const candidates: AlarmCandidate[] = [];
    const now = Date.now();

    for (const day of days) {
      for (const entry of day.entries) {
        if (!entry.isObligatory) continue;
        const prayer = entry.slot as ObligatoryPrayer;
        if (!options.isAlertEnabled(prayer)) continue;
        if (!options.isModeEnabled(prayer, "alarm")) continue;

        const fireAt = AlarmFireInstant.forPrayerTime(entry.time);
        if (fireAt.getTime() <= now) continue;

        candidates.push({
          prayer,
          entry,
          fireAt,
          logicalId: logicalAlarmKey(prayer, dayKey(fireAt)),
        });
      }
    }

    return candidates;
  }

  private isSyncBlocked(): boolean {
    return (
      alarmSessionCoordinator.blocksScheduling() ||
      alarmAlertTracker.hasAnyAlerting()
    );
  }

  private async syncAlarmKit(
    candidates: AlarmCandidate[],
    options: AlarmSyncOptions
  ): Promise<void> {
    if (this.isSyncBlocked()) return;

    const targetIds = new Set(
      candidates.map((candidate) => alarmKitUuidForKey(candidate.logicalId))
    );

    for (const candidate of candidates) {
      const alarmKitId = alarmKitUuidForKey(candidate.logicalId);
      alarmFireRegistry.register(alarmKitId, candidate.fireAt);
    }

    await this.alarms.reconcileNativeAlarms(targetIds);

    if (!this.isSyncBlocked()) {
      await this.cancelTracked();
    }

    let { scheduledIds, failed } = await this.scheduleCandidates(candidates, options);

    if (failed.length) {
      await this.alarms.reconcileNativeAlarms(
        new Set([...targetIds, ...scheduledIds])
      );
      const retry = await this.scheduleCandidates(failed, options);
      scheduledIds = [...scheduledIds, ...retry.scheduledIds];
      failed = retry.failed;
    }

    if (failed.length) {
      await this.fallback.syncCandidates(failed);
      const fallbackIds = failed.map(
        (candidate) => `inapp-${candidate.prayer}-${dayKey(candidate.fireAt)}`
      );
      alarmRegistry.prune([...scheduledIds, ...fallbackIds]);
      alarmFireRegistry.prune([...scheduledIds, ...fallbackIds]);
      if (__DEV__) {
        console.warn(
          `[AlarmScheduler] AlarmKit scheduled ${scheduledIds.length}/${candidates.length}; ` +
            `${failed.length} still using in-app fallback. Check AlarmKit permission in Settings.`
        );
      }
    } else {
      alarmRegistry.prune(scheduledIds);
      alarmFireRegistry.prune(scheduledIds);
      if (__DEV__) {
        console.info(
          `[AlarmScheduler] AlarmKit scheduled ${scheduledIds.length}/${candidates.length} prayer alarm(s).`
        );
      }
    }

    storage.setObject(StorageKeys.alarmScheduledIds, scheduledIds);
  }

  private async scheduleCandidates(
    candidates: AlarmCandidate[],
    options: AlarmSyncOptions
  ): Promise<{ scheduledIds: string[]; failed: AlarmCandidate[] }> {
    const scheduledIds: string[] = [];
    const failed: AlarmCandidate[] = [];

    for (const candidate of candidates) {
      const alarmKitId = alarmKitUuidForKey(candidate.logicalId);
      const scheduled = await this.alarms.scheduleAt(
        candidate.logicalId,
        candidate.fireAt,
        {
          title: `${candidate.entry.label} \u2022 Time to pray`,
          soundName: options.soundName,
          slot: candidate.prayer,
        }
      );

      if (scheduled) {
        alarmRegistry.register(alarmKitId, candidate.prayer);
        alarmContinuityStore.remember(alarmKitId, {
          title: `${candidate.entry.label} \u2022 Time to pray`,
          slot: candidate.prayer,
        });
        alarmRingPromptScheduler.schedule(
          alarmKitId,
          candidate.prayer,
          candidate.fireAt
        );
        scheduledIds.push(alarmKitId);
      } else {
        failed.push(candidate);
      }
    }

    return { scheduledIds, failed };
  }

  private async cancelTracked(): Promise<void> {
    if (this.isSyncBlocked()) return;

    const prior = storage.getObject<string[]>(StorageKeys.alarmScheduledIds) ?? [];
    for (const id of prior) {
      if (alarmSessionCoordinator.isActive(id)) continue;
      if (alarmAlertTracker.isAlerting(id)) continue;
      await this.alarms.cancel(id);
    }
  }
}
