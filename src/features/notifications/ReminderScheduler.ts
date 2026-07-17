import { DayPrayerTimes, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { ModeCheckFn } from "@/features/modes/mode.types";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import {
  NotificationCategories,
  NotificationManager,
} from "./NotificationManager";
import { reminderMessage } from "./reminderMessages";

export interface ReminderSyncOptions {
  isAlertEnabled: (prayer: ObligatoryPrayer) => boolean;
  isModeEnabled: ModeCheckFn;
}

/**
 * Schedules soft reminder notifications at prayer time when reminder mode is on.
 * Smart-alarm follow-ups live in `PrayerFollowUpScheduler`.
 */
export class ReminderScheduler {
  constructor(private readonly notifications: NotificationManager) {}

  async sync(days: DayPrayerTimes[], options: ReminderSyncOptions): Promise<void> {
    await this.cancelScheduled();

    for (const day of days) {
      await this.syncDayEntries(day, options);
    }
  }

  /** Clears scheduled soft-reminder notifications only. */
  async cancelScheduled(): Promise<void> {
    const ids = storage.getObject<string[]>(StorageKeys.prayerReminderIds) ?? [];
    await this.notifications.cancelScheduled(ids);
    storage.setObject(StorageKeys.prayerReminderIds, []);
  }

  private async syncDayEntries(
    day: DayPrayerTimes,
    options: ReminderSyncOptions
  ): Promise<void> {
    for (const entry of day.entries) {
      if (!entry.isObligatory) continue;
      const prayer = entry.slot as ObligatoryPrayer;
      if (!options.isAlertEnabled(prayer)) continue;

      if (options.isModeEnabled(prayer, "reminder")) {
        const id = await this.notifications.scheduleAt(entry.time, {
          title: entry.label,
          body: reminderMessage(prayer),
          categoryIdentifier: NotificationCategories.prayerReminder,
          data: { slot: prayer },
        });
        if (id) this.trackId(id);
      }
    }
  }

  private trackId(id: string): void {
    const ids = storage.getObject<string[]>(StorageKeys.prayerReminderIds) ?? [];
    storage.setObject(StorageKeys.prayerReminderIds, [...ids, id]);
  }
}
