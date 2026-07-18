import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { alarmKitSoundFileName } from "./alarmSounds";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmKitUuidForKey } from "./AlarmKitUuid";
import { alarmManager } from "./AlarmManager";
import { alarmRegistry } from "./AlarmRegistry";
import { alarmContinuityStore } from "./AlarmContinuityStore";
import { openAlarmRing } from "./alarmRouter";
import { alarmRingPromptScheduler } from "./AlarmRingPromptScheduler";
import { devAlarmKeepRegistry } from "./DevAlarmKeepRegistry";

const TEST_LOGICAL_ID = "prayer-test-dev";
const TEST_SLOT: ObligatoryPrayer = "maghrib";
const TEST_DELAY_MS = 60_000;

export type AlarmTestChannel = "alarmkit+in-app" | "in-app";

export type AlarmTestScheduleResult =
  | { ok: true; fireAt: Date; channel: AlarmTestChannel; detail: string }
  | { ok: false; message: string };

/**
 * Schedules a one-shot smart-alarm test.
 * Always arms an in-app timer so the ring UI + sound still fire when Miraj
 * stays open; AlarmKit is used in addition when authorized.
 */
export class AlarmTestScheduler {
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null;
  private activeKitId: string | null = null;

  async scheduleInOneMinute(soundId: string): Promise<AlarmTestScheduleResult> {
    if (!__DEV__) {
      return { ok: false, message: "Test alarms are only available in development builds." };
    }

    await this.clearPending();

    const fireAt = new Date(Date.now() + TEST_DELAY_MS);
    fireAt.setMilliseconds(0);
    const kitId = alarmKitUuidForKey(TEST_LOGICAL_ID);
    const soundName = alarmKitSoundFileName(soundId);

    alarmFireRegistry.register(kitId, fireAt);
    alarmRegistry.register(kitId, TEST_SLOT);
    // Protect this id from prayer-sync reconcile/prune for the whole minute.
    devAlarmKeepRegistry.retain(kitId);
    this.scheduleKeepRelease(kitId, TEST_DELAY_MS + 5 * 60_000);

    let usedAlarmKit = false;
    let authNote = "";

    if (alarmManager.isSupported) {
      if (!(await alarmManager.isAuthorized())) {
        const granted = await alarmManager.requestAuthorization();
        if (!granted) {
          authNote = " AlarmKit permission was not granted — using in-app timer only (keep Miraj open).";
        }
      }

      if (await alarmManager.isAuthorized()) {
        const scheduledKitId = await alarmManager.scheduleAt(TEST_LOGICAL_ID, fireAt, {
          title: "Test Alarm • Time to pray",
          soundName,
          slot: TEST_SLOT,
        });

        if (scheduledKitId) {
          usedAlarmKit = true;
          this.activeKitId = scheduledKitId;
          alarmRegistry.register(scheduledKitId, TEST_SLOT);
          alarmContinuityStore.remember(scheduledKitId, {
            title: "Test Alarm • Time to pray",
            slot: TEST_SLOT,
          });
          alarmRingPromptScheduler.schedule(scheduledKitId, TEST_SLOT, fireAt);
        } else {
          authNote =
            " AlarmKit schedule failed — using in-app timer only (keep Miraj open).";
        }
      }
    } else {
      authNote = " AlarmKit unavailable on this device — using in-app timer (keep Miraj open).";
    }

    // Always arm JS companion so ring screen + looped sound fire while app is alive.
    this.fallbackTimer = setTimeout(() => {
      this.fallbackTimer = null;
      if (__DEV__) console.info("[AlarmTest] in-app companion firing");
      openAlarmRing(TEST_SLOT, kitId);
    }, TEST_DELAY_MS);

    return {
      ok: true,
      fireAt,
      channel: usedAlarmKit ? "alarmkit+in-app" : "in-app",
      detail: usedAlarmKit
        ? "AlarmKit + in-app backup armed. Keep Miraj open (or lock the phone for native AlarmKit)."
        : `In-app timer armed. Keep Miraj open for the next minute.${authNote}`,
    };
  }

  async clearPending(): Promise<void> {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }

    const kitId = alarmKitUuidForKey(TEST_LOGICAL_ID);
    alarmRingPromptScheduler.cancel(kitId);

    if (this.activeKitId) {
      devAlarmKeepRegistry.release(this.activeKitId);
      await alarmManager.cancel(this.activeKitId);
      this.activeKitId = null;
    }

    devAlarmKeepRegistry.release(kitId);
    await alarmManager.cancel(kitId);
    alarmFireRegistry.clear(kitId);
  }

  private scheduleKeepRelease(kitId: string, delayMs: number): void {
    setTimeout(() => devAlarmKeepRegistry.release(kitId), delayMs);
  }
}

export const alarmTestScheduler = new AlarmTestScheduler();
