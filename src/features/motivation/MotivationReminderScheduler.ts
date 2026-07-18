import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import {
  NotificationCategories,
  NotificationManager,
} from "@/features/notifications/NotificationManager";
import { MotivationFeedPresenter } from "./MotivationFeedPresenter";
import { MotivationReminderTiming } from "./MotivationReminderTiming";
import { MotivationWindowPresetCatalog } from "./MotivationWindowPresetCatalog";
import { MotivationPrefs } from "./motivation.types";

/**
 * Schedules motivation reminder notifications from user prefs.
 * Cancels prior IDs and reschedules when prefs change.
 */
export class MotivationReminderScheduler {
  constructor(private readonly notifications: NotificationManager) {}

  async sync(prefs: MotivationPrefs): Promise<void> {
    await this.cancelScheduled();

    const { notifications, enabledCategories } = prefs;
    if (!notifications.enabled) return;
    if (enabledCategories.length === 0) return;

    // Spread quantity across selected When presets (see MotivationReminderTiming).
    const windows = MotivationWindowPresetCatalog.hoursForPresets(
      notifications.windowPresets
    );
    const fireTimes = MotivationReminderTiming.upcomingFireTimesForWindows(
      notifications.quantityPerDay,
      windows
    );

    for (const fireAt of fireTimes) {
      const reminder = MotivationFeedPresenter.pickForNotification(enabledCategories);
      const id = await this.notifications.scheduleAt(fireAt, {
        title: "Reminder",
        body: reminder.text,
        categoryIdentifier: NotificationCategories.motivationReminder,
        data: {
          type: "motivationReminder",
          reminderId: reminder.id,
          category: reminder.category,
        },
      });
      if (id) this.trackId(id);
    }
  }

  async cancelScheduled(): Promise<void> {
    const ids = storage.getObject<string[]>(StorageKeys.motivationReminderIds) ?? [];
    await this.notifications.cancelScheduled(ids);
    storage.setObject(StorageKeys.motivationReminderIds, []);
  }

  private trackId(id: string): void {
    const ids = storage.getObject<string[]>(StorageKeys.motivationReminderIds) ?? [];
    storage.setObject(StorageKeys.motivationReminderIds, [...ids, id]);
  }
}
