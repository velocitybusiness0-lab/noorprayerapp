import { Platform } from "react-native";
import { alarmManager } from "@/features/alarm/AlarmManager";
import { notificationManager } from "@/features/notifications/NotificationManager";

export type OnboardingPermissionKind = "notifications" | "alarms";

/** Requests a single onboarding permission and returns whether it was granted. */
export class OnboardingPermissionCoordinator {
  async requestNotifications(): Promise<boolean> {
    await notificationManager.configure();
    const status = await notificationManager.requestPermission();
    return status === "granted";
  }

  async requestAlarms(): Promise<boolean> {
    if (Platform.OS !== "ios" || !alarmManager.isSupported) {
      return true;
    }
    return alarmManager.requestAuthorization();
  }

  async request(kind: OnboardingPermissionKind): Promise<boolean> {
    if (kind === "notifications") return this.requestNotifications();
    return this.requestAlarms();
  }
}

export const onboardingPermissionCoordinator = new OnboardingPermissionCoordinator();
