import { Platform } from "react-native";
import type { PersonalizedPlanIconName } from "./OnboardingPersonalizedPlanCatalog";

export interface OnboardingPermissionItemModel {
  kind: "notifications" | "alarms";
  title: string;
  body: string;
  enableLabel: string;
  icon: PersonalizedPlanIconName;
}

export interface OnboardingCombinedPermissionsModel {
  title: string;
  body: string;
  items: readonly OnboardingPermissionItemModel[];
  continueLabel: string;
  skipLabel: string;
}

/** Copy for the combined Miraj-styled post-paywall permissions screen. */
export class OnboardingPermissionCopy {
  static combined(): OnboardingCombinedPermissionsModel {
    return {
      title: "Stay on time with salah",
      body: "Enable gentle reminders so Miraj can nudge you at prayer times — even when the app is closed.",
      items: [this.notificationsItem(), this.alarmsItem()],
      continueLabel: "Continue",
      skipLabel: "Not now",
    };
  }

  private static notificationsItem(): OnboardingPermissionItemModel {
    return {
      kind: "notifications",
      title: "Notifications",
      body: "Gentle alerts at salah times and soft follow-ups so you stay consistent.",
      enableLabel: "Enable notifications",
      icon: "notifications-outline",
    };
  }

  private static alarmsItem(): OnboardingPermissionItemModel {
    const isIosAlarmKit = Platform.OS === "ios";
    return {
      kind: "alarms",
      title: isIosAlarmKit ? "Prayer alarms" : "Prayer alarms",
      body: isIosAlarmKit
        ? "AlarmKit schedules prominent alarms for Fajr and other prayers."
        : "System reminders nudge you at prayer times. Fine-tune later in Settings.",
      enableLabel: isIosAlarmKit ? "Allow alarms" : "Enable alarms",
      icon: "alarm-outline",
    };
  }
}
