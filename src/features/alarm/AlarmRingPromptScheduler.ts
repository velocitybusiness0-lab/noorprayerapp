import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { ExactDeadlineScheduler } from "./ExactDeadlineScheduler";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { openAlarmRing } from "./alarmRouter";

/**
 * Opens the in-app ring screen at the exact fire instant when AlarmKit handles
 * the native alert. Re-aligns the deadline so long waits do not drift late.
 */
class AlarmRingPromptScheduler {
  private readonly deadlines = new ExactDeadlineScheduler();

  schedule(alarmId: string, prayer: ObligatoryPrayer, fireAt: Date): void {
    this.cancel(alarmId);

    const deadlineMs = fireAt.getTime();
    if (deadlineMs <= Date.now()) {
      this.openIfDue(alarmId, prayer);
      return;
    }

    this.deadlines.schedule(alarmId, deadlineMs, () => {
      this.openIfDue(alarmId, prayer);
    });
  }

  cancel(alarmId: string): void {
    this.deadlines.cancel(alarmId);
  }

  cancelAll(): void {
    this.deadlines.cancelAll();
  }

  private openIfDue(alarmId: string, prayer: ObligatoryPrayer): void {
    if (!alarmFireRegistry.isDue(alarmId)) return;
    openAlarmRing(prayer, alarmId);
  }
}

export const alarmRingPromptScheduler = new AlarmRingPromptScheduler();
