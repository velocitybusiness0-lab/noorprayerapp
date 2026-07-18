import { useCallback, useEffect } from "react";
import { usePrayerTimes } from "@/features/prayerTimes/usePrayerTimes";
import { useModes } from "@/features/modes/modeStore";
import { ModeCoordinator } from "@/features/modes/ModeCoordinator";
import { useAlertPrefs } from "@/features/notifications/alertPrefsStore";
import { useNotificationSetup } from "@/features/notifications/useNotifications";
import { notificationManager } from "@/features/notifications/NotificationManager";
import { PrayerFollowUpScheduler } from "@/features/notifications/PrayerFollowUpScheduler";
import { ReminderScheduler } from "@/features/notifications/ReminderScheduler";
import { alarmManager } from "@/features/alarm/AlarmManager";
import { AlarmScheduler } from "@/features/alarm/AlarmScheduler";
import { inAppAlarmScheduler } from "@/features/alarm/InAppAlarmScheduler";
import { useAlarmSound } from "@/features/alarm/alarmSoundStore";
import { alarmKitSoundFileName } from "@/features/alarm/alarmSounds";
import { useMasjid } from "@/features/masjidMode/masjidStore";
import { usePreDisarm } from "@/features/masjidMode/preDisarmStore";
import { useHistory } from "@/features/history/historyStore";
import { useDailyGoals } from "@/features/dailyGoals/dailyGoalsStore";
import { widgetBridge } from "@/features/widgets/WidgetBridge";
import { liveActivityManager } from "@/features/widgets/LiveActivityManager";
import { widgetSnapshotBuilder } from "@/features/widgets/WidgetSnapshotBuilder";
import { bootstrapScanDetector } from "@/features/scan/detection/ScanDetectorBootstrap";
import { useReminderPrefs } from "@/features/notifications/reminderPrefsStore";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { SalahMode } from "@/features/modes/mode.types";
import { MotivationReminderScheduler } from "@/features/motivation/MotivationReminderScheduler";
import {
  getMotivationPrefsSnapshot,
  useMotivationPrefs,
} from "@/features/motivation/motivationPrefsStore";

const coordinator = new ModeCoordinator(
  new ReminderScheduler(notificationManager),
  new PrayerFollowUpScheduler(notificationManager),
  new AlarmScheduler(alarmManager, inAppAlarmScheduler)
);

const motivationScheduler = new MotivationReminderScheduler(notificationManager);

/**
 * Single orchestration point: initialises services, keeps masjid presence
 * fresh, and re-syncs the ModeCoordinator whenever anything affecting
 * scheduling changes. When at a masjid, modes soften to a quiet reminder.
 */
export function useAppBootstrap(): void {
  useNotificationSetup();
  const { today, location, manager } = usePrayerTimes();
  const enabledModes = useModes((s) => s.enabledModes);
  const { alerts, isEnabled } = useAlertPrefs();
  const selectedSoundId = useAlarmSound((s) => s.selectedId);
  const remindersEnabled = useReminderPrefs((s) => s.enabled);
  const motivationCategories = useMotivationPrefs((s) => s.enabledCategories);
  const motivationNotifications = useMotivationPrefs((s) => s.notifications);
  const masjidEnabled = useMasjid((s) => s.enabled);
  const atMosque = useMasjid((s) => s.atMosque);
  const updatePresence = useMasjid((s) => s.updatePresence);
  const preDisarmFlags = usePreDisarm((s) => s.flags);

  useEffect(() => {
    void useHistory.getState().init();
    useDailyGoals.getState().init();
    bootstrapScanDetector();
    if (alarmManager.isSupported) void alarmManager.requestAuthorization();
  }, []);

  useEffect(() => {
    if (location) updatePresence(location);
  }, [location, updatePresence]);

  useEffect(() => {
    if (!today) return;
    const snapshot = widgetSnapshotBuilder.build(today);
    widgetBridge.publish(snapshot);
    void liveActivityManager.sync(snapshot);
  }, [today]);

  const isModeEnabled = useCallback(
    (prayer: ObligatoryPrayer, mode: SalahMode) => {
      if (masjidEnabled && atMosque) return mode === "reminder";
      if (usePreDisarm.getState().isPreDisarmed(prayer)) return mode === "reminder";
      return enabledModes.includes(mode);
    },
    [enabledModes, masjidEnabled, atMosque]
  );

  useEffect(() => {
    if (!today || !location) return;
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = manager.computeForDate(location, tomorrowDate);

    void coordinator.sync([today, tomorrow], {
      isAlertEnabled: isEnabled,
      isModeEnabled,
      isLogged: (prayer) => useHistory.getState().isLogged(prayer),
      soundName: alarmKitSoundFileName(selectedSoundId),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, location, manager, enabledModes, alerts, selectedSoundId, remindersEnabled, masjidEnabled, atMosque, preDisarmFlags]);

  useEffect(() => {
    void motivationScheduler.sync(getMotivationPrefsSnapshot());
  }, [
    motivationCategories,
    motivationNotifications.enabled,
    motivationNotifications.quantityPerDay,
    motivationNotifications.windowPresets.join(","),
  ]);
}
