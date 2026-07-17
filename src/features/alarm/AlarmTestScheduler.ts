import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { alarmKitSoundFileName } from "./alarmSounds";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmKitUuidForKey } from "./AlarmKitUuid";
import { alarmManager } from "./AlarmManager";
import { alarmRegistry } from "./AlarmRegistry";
import { openAlarmRing } from "./alarmRouter";
import { alarmRingPromptScheduler } from "./AlarmRingPromptScheduler";
import { devAlarmKeepRegistry } from "./DevAlarmKeepRegistry";

const TEST_LOGICAL_ID = "prayer-test-dev";
const TEST_SLOT: ObligatoryPrayer = "maghrib";
const TEST_DELAY_MS = 60_000;

export type AlarmTestChannel = "alarmkit" | "in-app";

export type AlarmTestScheduleResult =
  | { ok: true; fireAt: Date; channel: AlarmTestChannel }
  | { ok: false; message: string };

/**
 * Schedules a one-shot smart-alarm test for local development.
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
    const kitId = alarmKitUuidForKey(TEST_LOGICAL_ID);
    const soundName = alarmKitSoundFileName(soundId);

    alarmFireRegistry.register(kitId, fireAt);
    alarmRegistry.register(kitId, TEST_SLOT);

    if (!(await alarmManager.isAuthorized())) {
      await alarmManager.requestAuthorization();
    }

    const scheduledKitId = await alarmManager.scheduleAt(TEST_LOGICAL_ID, fireAt, {
      title: "Test Alarm • Time to pray",
      soundName,
      slot: TEST_SLOT,
    });

    if (scheduledKitId) {
      this.activeKitId = scheduledKitId;
      devAlarmKeepRegistry.retain(scheduledKitId);
      alarmRingPromptScheduler.schedule(scheduledKitId, TEST_SLOT, fireAt);
      this.scheduleKeepRelease(scheduledKitId, TEST_DELAY_MS + 5 * 60_000);
      return { ok: true, fireAt, channel: "alarmkit" };
    }

    this.fallbackTimer = setTimeout(() => {
      this.fallbackTimer = null;
      openAlarmRing(TEST_SLOT, kitId);
    }, TEST_DELAY_MS);

    return { ok: true, fireAt, channel: "in-app" };
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
