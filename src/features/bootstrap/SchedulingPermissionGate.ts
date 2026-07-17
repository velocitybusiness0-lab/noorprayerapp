import { AppState, AppStateStatus } from "react-native";
import { alarmManager } from "@/features/alarm/AlarmManager";
import { notificationManager } from "@/features/notifications/NotificationManager";

/**
 * Ensures notification + AlarmKit permissions are resolved before scheduling
 * prayer reminders or alarms. Re-checks when the app returns to the foreground
 * so a grant in Settings triggers a fresh sync.
 */
export class SchedulingPermissionGate {
  private listeners = new Set<() => void>();
  private ready = false;
  private appStateSubscription: { remove: () => void } | null = null;

  get isReady(): boolean {
    return this.ready;
  }

  subscribe(onChange: () => void): () => void {
    this.listeners.add(onChange);
    return () => this.listeners.delete(onChange);
  }

  start(): void {
    if (this.appStateSubscription) return;
    void this.refresh();
    this.appStateSubscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") void this.refresh();
      }
    );
  }

  stop(): void {
    this.appStateSubscription?.remove();
    this.appStateSubscription = null;
    this.listeners.clear();
    this.ready = false;
  }

  async refresh(): Promise<boolean> {
    const granted = await this.ensureGranted();
    if (granted !== this.ready) {
      this.ready = granted;
      this.listeners.forEach((listener) => listener());
    }
    return granted;
  }

  private async ensureGranted(): Promise<boolean> {
    const current = await notificationManager.getPermission();
    if (current !== "granted") {
      const requested = await notificationManager.requestPermission();
      if (requested !== "granted") return false;
    }

    if (alarmManager.isSupported) {
      await alarmManager.requestAuthorization();
      const alarmAuth = await alarmManager.getAuthorizationState();
      if (alarmAuth !== "authorized" && __DEV__) {
        console.info(
          `[SchedulingPermissionGate] AlarmKit authorization: ${alarmAuth}. ` +
            "Open Settings → Miraj → Alarms and allow access for prayer alarms."
        );
      }
    }

    return true;
  }
}

export const schedulingPermissionGate = new SchedulingPermissionGate();
