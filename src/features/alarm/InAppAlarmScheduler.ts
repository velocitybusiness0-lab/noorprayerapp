import { dayKey } from "@/core/utils/time";
import { DayPrayerTimes, ObligatoryPrayer, PrayerEntry } from "@/features/prayerTimes/prayerTimes.types";
import { AlarmFireInstant } from "./AlarmFireInstant";
import { ExactDeadlineScheduler } from "./ExactDeadlineScheduler";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmRegistry } from "./AlarmRegistry";
import { openAlarmRing } from "./alarmRouter";
import { AlarmSyncOptions } from "./AlarmScheduler";

/**
 * Fallback smart alarm when AlarmKit is unavailable. Uses wall-clock aligned
 * timers so the ring screen opens at HH:MM:00.
 */
export class InAppAlarmScheduler {
  private readonly deadlines = new ExactDeadlineScheduler();

  async sync(days: DayPrayerTimes[], options: AlarmSyncOptions): Promise<void> {
    this.clearTimers();

    for (const day of days) {
      for (const entry of day.entries) {
        if (!entry.isObligatory) continue;
        const prayer = entry.slot as ObligatoryPrayer;
        if (!options.isAlertEnabled(prayer)) continue;
        if (!options.isModeEnabled(prayer, "alarm")) continue;
        this.scheduleEntry(prayer, entry);
      }
    }
  }

  async syncCandidates(
    candidates: { prayer: ObligatoryPrayer; entry: PrayerEntry; fireAt?: Date }[]
  ): Promise<void> {
    for (const candidate of candidates) {
      this.scheduleEntry(candidate.prayer, candidate.entry, candidate.fireAt);
    }
  }

  cancelAll(): void {
    this.clearTimers();
  }

  private scheduleEntry(
    prayer: ObligatoryPrayer,
    entry: PrayerEntry,
    explicitFireAt?: Date
  ): void {
    const fireAt = explicitFireAt ?? AlarmFireInstant.forPrayerTime(entry.time);
    if (fireAt.getTime() <= Date.now()) return;

    const alarmId = `inapp-${prayer}-${dayKey(fireAt)}`;
    alarmFireRegistry.register(alarmId, fireAt);
    alarmRegistry.register(alarmId, prayer);
    this.deadlines.schedule(alarmId, fireAt.getTime(), () => {
      openAlarmRing(prayer, alarmId);
    });
  }

  private clearTimers(): void {
    this.deadlines.cancelAll();
  }
}

export const inAppAlarmScheduler = new InAppAlarmScheduler();

/** Legacy type kept for notification router compatibility with older payloads. */
export const SmartAlarmDataType = "smart_alarm";
