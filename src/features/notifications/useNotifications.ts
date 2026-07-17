import { useEffect } from "react";
import { router } from "expo-router";
import { notificationManager } from "./NotificationManager";
import { handleNotificationResponse } from "./notificationRouter";
import { setAlarmRingHandler } from "@/features/alarm/alarmRouter";
import { scanSessionGuard } from "@/features/scan/ScanSessionGuard";
import { useAlarmKitListener } from "@/features/alarm/useAlarmKitListener";

/**
 * Notification setup for prayer reminders only. Smart alarms use AlarmKit /
 * in-app audio and never schedule alarm notifications.
 */
export function useNotificationSetup(): void {
  useEffect(() => {
    setAlarmRingHandler((slot, alarmId) => {
      if (scanSessionGuard.isOpen(alarmId)) return;
      router.replace(
        `/alarm/ring?slot=${slot}&alarmId=${encodeURIComponent(alarmId)}`
      );
    });

    return () => {
      setAlarmRingHandler(null);
    };
  }, []);

  useAlarmKitListener();

  useEffect(() => {
    void (async () => {
      await notificationManager.configure();
      await notificationManager.requestPermission();
    })();

    const responseSub = notificationManager.addResponseListener(handleNotificationResponse);
    return () => responseSub.remove();
  }, []);
}
