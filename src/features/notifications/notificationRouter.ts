import type { NotificationResponse } from "expo-notifications";
import { router } from "expo-router";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { SmartAlarmDataType } from "@/features/alarm/InAppAlarmScheduler";
import { NotificationActions } from "./NotificationManager";

type PrayerLogHandler = (prayer: ObligatoryPrayer) => void;

let logHandler: PrayerLogHandler | null = null;

/** Registered by the history layer so notification actions can log prayers. */
export function setPrayerLogHandler(handler: PrayerLogHandler | null): void {
  logHandler = handler;
}

/**
 * Routes an interactive notification response. When the user confirms they
 * prayed (either category's positive action), the registered logger records it.
 * Smart-alarm notifications open the ring screen.
 */
export function handleNotificationResponse(response: NotificationResponse): void {
  const data = response.notification.request.content.data;
  const slot = data?.slot as ObligatoryPrayer | undefined;

  if (data?.type === SmartAlarmDataType && slot) {
    const alarmId = (data.alarmId as string | undefined) ?? `notif-${slot}`;
    router.push(`/alarm/ring?slot=${slot}&alarmId=${alarmId}`);
    return;
  }

  if (!slot) return;

  const action = response.actionIdentifier;
  const confirmed =
    action === NotificationActions.markPrayed ||
    action === NotificationActions.prayedYes;

  if (confirmed) logHandler?.(slot);
}
