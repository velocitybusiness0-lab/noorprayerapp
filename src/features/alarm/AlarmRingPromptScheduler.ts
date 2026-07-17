import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { openAlarmRing } from "./alarmRouter";

/**
 * Opens the in-app ring screen at fire time when AlarmKit handles the native
 * alert. AlarmKit does not always surface an "alerting" update while Miraj is
 * foregrounded, so this companion timer is required for the dismiss UI.
 */
class AlarmRingPromptScheduler {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  schedule(alarmId: string, prayer: ObligatoryPrayer, fireAt: Date): void {
    this.cancel(alarmId);

    const msUntil = fireAt.getTime() - Date.now();
    if (msUntil <= 0) {
      this.openIfDue(alarmId, prayer);
      return;
    }

    const timer = setTimeout(() => {
      this.timers.delete(alarmId);
      this.openIfDue(alarmId, prayer);
    }, msUntil);
    this.timers.set(alarmId, timer);
  }

  cancel(alarmId: string): void {
    const timer = this.timers.get(alarmId);
    if (!timer) return;
    clearTimeout(timer);
    this.timers.delete(alarmId);
  }

  cancelAll(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
  }

  private openIfDue(alarmId: string, prayer: ObligatoryPrayer): void {
    if (!alarmFireRegistry.isDue(alarmId)) return;
    openAlarmRing(prayer, alarmId);
  }
}

export const alarmRingPromptScheduler = new AlarmRingPromptScheduler();
