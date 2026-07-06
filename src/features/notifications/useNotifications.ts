import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { notificationManager } from "./NotificationManager";
import { handleNotificationResponse } from "./notificationRouter";
import { setAlarmRingHandler } from "@/features/alarm/alarmRouter";
import {
  SmartAlarmDataType,
  SmartAlarmNotificationCategory,
} from "@/features/alarm/InAppAlarmScheduler";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

/**
 * Lightweight, prayer-times-agnostic notification setup: configures the
 * handler/categories, requests permission once, and wires the response router.
 * Reminder scheduling is driven separately by the app bootstrap.
 */
export function useNotificationSetup(): void {
  useEffect(() => {
    setAlarmRingHandler((slot, alarmId) => {
      router.push(`/alarm/ring?slot=${slot}&alarmId=${alarmId}`);
    });

    void (async () => {
      await notificationManager.configure();
      await Notifications.setNotificationCategoryAsync(SmartAlarmNotificationCategory, [
        { identifier: "OPEN_ALARM", buttonTitle: "Open alarm" },
      ]);
      await notificationManager.requestPermission();
    })();

    const responseSub = notificationManager.addResponseListener(handleNotificationResponse);

    const receivedSub = Notifications.addNotificationReceivedListener((event) => {
      const data = event.request.content.data;
      if (data?.type !== SmartAlarmDataType) return;
      const slot = data.slot as ObligatoryPrayer | undefined;
      const alarmId = data.alarmId as string | undefined;
      if (slot && alarmId) {
        router.push(`/alarm/ring?slot=${slot}&alarmId=${alarmId}`);
      }
    });

    return () => {
      responseSub.remove();
      receivedSub.remove();
      setAlarmRingHandler(null);
    };
  }, []);
}
