import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { dayKey } from "@/core/utils/time";
import { DayPrayerTimes, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { AlarmManager } from "./AlarmManager";
import { InAppAlarmScheduler } from "./InAppAlarmScheduler";

export interface AlarmSyncOptions {
  isAlertEnabled: (prayer: ObligatoryPrayer) => boolean;
  resolveMode: (prayer: ObligatoryPrayer) => import("@/features/modes/mode.types").SalahMode;
  soundName?: string;
}

/**
 * Schedules smart alarms for "alarm" mode prayers. Uses AlarmKit on supported
 * devices and falls back to in-app timers + local notifications elsewhere.
 */
export class AlarmScheduler {
  constructor(
    private readonly alarms: AlarmManager,
    private readonly fallback: InAppAlarmScheduler
  ) {}

  async sync(days: DayPrayerTimes[], options: AlarmSyncOptions): Promise<void> {
    await this.fallback.sync(days, options);

    if (!this.alarms.isSupported) return;

    await this.cancelTracked();
    const scheduledIds: string[] = [];

    for (const day of days) {
      for (const entry of day.entries) {
        if (!entry.isObligatory) continue;
        const prayer = entry.slot as ObligatoryPrayer;
        if (!options.isAlertEnabled(prayer)) continue;
        if (options.resolveMode(prayer) !== "alarm") continue;
        if (entry.time.getTime() <= Date.now()) continue;

        const id = `prayer-${prayer}-${dayKey(entry.time)}`;
        const ok = await this.alarms.scheduleAt(id, entry.time, {
          title: `${entry.label} \u2022 Time to pray`,
          soundName: options.soundName,
        });
        if (ok) scheduledIds.push(id);
      }
    }

    storage.setObject(StorageKeys.alarmScheduledIds, scheduledIds);
  }

  async cancelAll(): Promise<void> {
    this.fallback.cancelAll();
    await this.cancelTracked();
    storage.setObject(StorageKeys.alarmScheduledIds, []);
  }

  private async cancelTracked(): Promise<void> {
    const prior = storage.getObject<string[]>(StorageKeys.alarmScheduledIds) ?? [];
    for (const id of prior) {
      await this.alarms.cancel(id);
    }
  }
}
