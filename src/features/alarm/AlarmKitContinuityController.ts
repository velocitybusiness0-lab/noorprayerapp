import { PRAYER_LABELS } from "@/features/prayerTimes/prayerTimes.types";
import { alarmKitSoundFileName } from "./alarmSounds";
import { useAlarmSound } from "./alarmSoundStore";
import { alarmContinuityStore } from "./AlarmContinuityStore";
import {
  ALARM_KIT_REARM_COOLDOWN_MS,
} from "./AlarmKitContinuityTiming";
import { alarmKitOwnershipRegistry } from "./AlarmKitOwnershipRegistry";
import { alarmManager } from "./AlarmManager";
import { alarmRegistry } from "./AlarmRegistry";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { clearAlarmRingNavigationGuard, openAlarmRing } from "./alarmRouter";

type AlarmKitAlarm = { id: string; state: string };

/**
 * If the user taps AlarmKit stop/X before object hunt succeeds, re-schedule the
 * same alarm so ringtone continues until verify.
 */
export class AlarmKitContinuityController {
  private rearmInFlight = new Set<string>();
  private lastRearmAt = new Map<string, number>();

  handleNativeUpdates(alarms: AlarmKitAlarm[]): void {
    const alarmId = alarmSessionCoordinator.currentAlarmId;
    if (!alarmId) return;
    if (!alarmSessionCoordinator.blocksScheduling()) return;
    if (!alarmKitOwnershipRegistry.owns(alarmId)) return;

    const native = alarms.find((alarm) => alarm.id === alarmId);
    if (native?.state === "alerting") return;

    void this.rearm(alarmId);
  }

  async rearm(alarmKitId: string): Promise<void> {
    if (this.rearmInFlight.has(alarmKitId)) return;
    if (!alarmSessionCoordinator.isActive(alarmKitId)) return;

    const now = Date.now();
    const last = this.lastRearmAt.get(alarmKitId) ?? 0;
    if (now - last < ALARM_KIT_REARM_COOLDOWN_MS) return;

    const slot = alarmRegistry.slotFor(alarmKitId);
    const stored = alarmContinuityStore.metaFor(alarmKitId);
    if (!slot && !stored?.slot) return;

    const prayerSlot = stored?.slot ?? slot!;
    const title =
      stored?.title ?? `${PRAYER_LABELS[prayerSlot]} \u2022 Time to pray`;

    this.rearmInFlight.add(alarmKitId);
    this.lastRearmAt.set(alarmKitId, now);

    try {
      const soundName = alarmKitSoundFileName(useAlarmSound.getState().selectedId);
      const scheduled = await alarmManager.rescheduleSoon(alarmKitId, {
        title,
        soundName,
        slot: prayerSlot,
      });

      if (!scheduled) {
        if (__DEV__) {
          console.warn(`[AlarmKitContinuity] rearm failed for ${alarmKitId}`);
        }
        return;
      }

      alarmContinuityStore.remember(alarmKitId, { title, slot: prayerSlot });
      alarmKitOwnershipRegistry.mark(alarmKitId);
      clearAlarmRingNavigationGuard();
      openAlarmRing(prayerSlot, alarmKitId);

      if (__DEV__) {
        console.info(`[AlarmKitContinuity] re-armed AlarmKit for ${alarmKitId}`);
      }
    } finally {
      this.rearmInFlight.delete(alarmKitId);
    }
  }
}

export const alarmKitContinuityController = new AlarmKitContinuityController();
