import * as Notifications from "expo-notifications";
import { dayKey } from "@/core/utils/time";
import { DayPrayerTimes, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { openAlarmRing } from "./alarmRouter";
import { AlarmSyncOptions } from "./AlarmScheduler";

export const SmartAlarmNotificationCategory = "SMART_ALARM";

/** Payload attached to fallback smart-alarm notifications. */
export const SmartAlarmDataType = "smart_alarm";

/**
 * Fallback smart alarm when AlarmKit is unavailable (Expo Go, simulator, or
 * iOS < 26). Uses scheduled local notifications plus in-app timers so the
 * ring screen still opens at prayer time while the app is running.
 */
export class InAppAlarmScheduler {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private scheduledNotificationIds: string[] = [];

  async sync(days: DayPrayerTimes[], options: AlarmSyncOptions): Promise<void> {
    this.clearTimers();

    for (const day of days) {
      for (const entry of day.entries) {
        if (!entry.isObligatory) continue;
        const prayer = entry.slot as ObligatoryPrayer;
        if (!options.isAlertEnabled(prayer)) continue;
        if (options.resolveMode(prayer) !== "alarm") continue;

        const msUntil = entry.time.getTime() - Date.now();
        if (msUntil <= 0) continue;

        const alarmId = `inapp-${prayer}-${dayKey(entry.time)}`;
        this.scheduleTimer(alarmId, prayer, msUntil);
        await this.scheduleNotification(alarmId, prayer, entry.label, entry.time);
      }
    }
  }

  cancelAll(): void {
    this.clearTimers();
    void this.cancelNotifications();
  }

  private scheduleTimer(alarmId: string, prayer: ObligatoryPrayer, msUntil: number): void {
    const timer = setTimeout(() => {
      this.timers.delete(alarmId);
      openAlarmRing(prayer, alarmId);
    }, msUntil);
    this.timers.set(alarmId, timer);
  }

  private async scheduleNotification(
    alarmId: string,
    prayer: ObligatoryPrayer,
    label: string,
    date: Date
  ): Promise<void> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${label} • Time to pray`,
        body: "Open Noor to scan and dismiss your smart alarm.",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        categoryIdentifier: SmartAlarmNotificationCategory,
        data: { type: SmartAlarmDataType, slot: prayer, alarmId },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
    });
    this.scheduledNotificationIds.push(id);
  }

  private clearTimers(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
  }

  private async cancelNotifications(): Promise<void> {
    for (const id of this.scheduledNotificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
    this.scheduledNotificationIds = [];
  }
}

export const inAppAlarmScheduler = new InAppAlarmScheduler();
