import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type NotificationPermission = "granted" | "denied" | "undetermined";

/** Notification action identifiers used across categories. */
export const NotificationActions = {
  markPrayed: "MARK_PRAYED",
  prayedYes: "PRAYED_YES",
  prayedNo: "PRAYED_NO",
} as const;

export const NotificationCategories = {
  prayerReminder: "PRAYER_REMINDER",
  didYouPray: "DID_YOU_PRAY",
  motivationReminder: "MOTIVATION_REMINDER",
} as const;

/**
 * Wraps expo-notifications: permissions, the foreground handler, interactive
 * categories, and scheduling primitives. Higher-level scheduling logic lives
 * in `ReminderScheduler`.
 */
export class NotificationManager {
  private configured = false;

  async configure(): Promise<void> {
    if (this.configured) return;
    this.configured = true;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("prayers", {
        name: "Prayer reminders",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    await Notifications.setNotificationCategoryAsync(
      NotificationCategories.prayerReminder,
      [{ identifier: NotificationActions.markPrayed, buttonTitle: "Mark as prayed" }]
    );
    await Notifications.setNotificationCategoryAsync(
      NotificationCategories.didYouPray,
      [
        { identifier: NotificationActions.prayedYes, buttonTitle: "Yes, alhamdulillah" },
        { identifier: NotificationActions.prayedNo, buttonTitle: "Not yet" },
      ]
    );
  }

  async requestPermission(): Promise<NotificationPermission> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status as NotificationPermission;
  }

  async getPermission(): Promise<NotificationPermission> {
    const { status } = await Notifications.getPermissionsAsync();
    return status as NotificationPermission;
  }

  async scheduleAt(
    date: Date,
    content: Notifications.NotificationContentInput
  ): Promise<string | null> {
    if (date.getTime() <= Date.now()) return null;
    return Notifications.scheduleNotificationAsync({
      content,
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
    });
  }

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async cancelScheduled(ids: string[]): Promise<void> {
    await Promise.all(
      ids.map((id) => Notifications.cancelScheduledNotificationAsync(id))
    );
  }

  addResponseListener(
    handler: (response: Notifications.NotificationResponse) => void
  ): Notifications.EventSubscription {
    return Notifications.addNotificationResponseReceivedListener(handler);
  }
}

export const notificationManager = new NotificationManager();
