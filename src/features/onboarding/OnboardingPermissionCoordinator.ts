import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { notificationManager } from "@/features/notifications/NotificationManager";

/** Requests permissions needed after onboarding setup. */
export class OnboardingPermissionCoordinator {
  async requestAll(): Promise<void> {
    await Promise.all([
      notificationManager.configure().then(() => notificationManager.requestPermission()),
      Location.requestForegroundPermissionsAsync(),
      Camera.requestCameraPermissionsAsync(),
    ]);
  }
}

export const onboardingPermissionCoordinator = new OnboardingPermissionCoordinator();
