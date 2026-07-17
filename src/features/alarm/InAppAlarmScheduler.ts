import { dayKey } from "@/core/utils/time";
import { DayPrayerTimes, ObligatoryPrayer, PrayerEntry } from "@/features/prayerTimes/prayerTimes.types";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmRegistry } from "./AlarmRegistry";
import { openAlarmRing } from "./alarmRouter";
import { AlarmSyncOptions } from "./AlarmScheduler";

/**
 * Fallback smart alarm when AlarmKit is unavailable. Uses in-app timers only
 * (no notifications) so the ring screen opens at prayer time.
 */
export class InAppAlarmScheduler {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

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
    candidates: { prayer: ObligatoryPrayer; entry: PrayerEntry }[]
  ): Promise<void> {
    for (const candidate of candidates) {
      this.scheduleEntry(candidate.prayer, candidate.entry);
    }
  }

  cancelAll(): void {
    this.clearTimers();
  }

  private scheduleEntry(prayer: ObligatoryPrayer, entry: PrayerEntry): void {
    const msUntil = entry.time.getTime() - Date.now();
    if (msUntil <= 0) return;

    const alarmId = `inapp-${prayer}-${dayKey(entry.time)}`;
    alarmFireRegistry.register(alarmId, entry.time);
    alarmRegistry.register(alarmId, prayer);
    this.scheduleTimer(alarmId, prayer, entry.time, msUntil);
  }

  private scheduleTimer(
    alarmId: string,
    prayer: ObligatoryPrayer,
    fireTime: Date,
    msUntil: number
  ): void {
    const timer = setTimeout(() => {
      this.timers.delete(alarmId);
      openAlarmRing(prayer, alarmId);
    }, msUntil);
    this.timers.set(alarmId, timer);
  }

  private clearTimers(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
  }
}

export const inAppAlarmScheduler = new InAppAlarmScheduler();

/** Legacy type kept for notification router compatibility with older payloads. */
export const SmartAlarmDataType = "smart_alarm";
