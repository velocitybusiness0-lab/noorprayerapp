import { useCallback, useEffect } from "react";
import { usePrayerTimes } from "@/features/prayerTimes/usePrayerTimes";
import { useModes } from "@/features/modes/modeStore";
import { ModeCoordinator } from "@/features/modes/ModeCoordinator";
import { useAlertPrefs } from "@/features/notifications/alertPrefsStore";
import { useNotificationSetup } from "@/features/notifications/useNotifications";
import { notificationManager } from "@/features/notifications/NotificationManager";
import { ReminderScheduler } from "@/features/notifications/ReminderScheduler";
import { alarmManager } from "@/features/alarm/AlarmManager";
import { AlarmScheduler } from "@/features/alarm/AlarmScheduler";
import { inAppAlarmScheduler } from "@/features/alarm/InAppAlarmScheduler";
import { useAlarmSound } from "@/features/alarm/alarmSoundStore";
import { soundById } from "@/features/alarm/alarmSounds";
import { blockingManager } from "@/features/blocking/BlockingManager";
import { setUnblockHandler } from "@/features/scan/scanActions";
import { useMasjid } from "@/features/masjidMode/masjidStore";
import { usePreDisarm } from "@/features/masjidMode/preDisarmStore";
import { useHistory } from "@/features/history/historyStore";
import { widgetBridge } from "@/features/widgets/WidgetBridge";
import { liveActivityManager } from "@/features/widgets/LiveActivityManager";
import { widgetSnapshotBuilder } from "@/features/widgets/WidgetSnapshotBuilder";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

const coordinator = new ModeCoordinator(
  new ReminderScheduler(notificationManager),
  new AlarmScheduler(alarmManager, inAppAlarmScheduler),
  blockingManager
);

/**
 * Single orchestration point: initialises services, keeps masjid presence
 * fresh, and re-syncs the ModeCoordinator whenever anything affecting
 * scheduling changes. When at a masjid, modes soften to a quiet reminder.
 */
export function useAppBootstrap(): void {
  useNotificationSetup();
  const { today, location, manager } = usePrayerTimes();
  const global = useModes((s) => s.global);
  const perPrayer = useModes((s) => s.perPrayer);
  const resolveFor = useModes((s) => s.resolveFor);
  const { alerts, isEnabled } = useAlertPrefs();
  const selectedSoundId = useAlarmSound((s) => s.selectedId);
  const masjidEnabled = useMasjid((s) => s.enabled);
  const atMosque = useMasjid((s) => s.atMosque);
  const updatePresence = useMasjid((s) => s.updatePresence);
  const preDisarmFlags = usePreDisarm((s) => s.flags);

  useEffect(() => {
    void useHistory.getState().init();
    setUnblockHandler(() => blockingManager.unblockNow());
    if (alarmManager.isSupported) void alarmManager.requestAuthorization();
    if (blockingManager.isAvailable) void blockingManager.requestAuthorization();
    return () => setUnblockHandler(null);
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

  const resolveEffectiveMode = useCallback(
    (prayer: ObligatoryPrayer) => {
      if (masjidEnabled && atMosque) return "reminder";
      if (usePreDisarm.getState().isPreDisarmed(prayer)) return "reminder";
      return resolveFor(prayer);
    },
    [masjidEnabled, atMosque, resolveFor]
  );

  useEffect(() => {
    if (!today || !location) return;
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = manager.computeForDate(location, tomorrowDate);

    void coordinator.sync([today, tomorrow], {
      isAlertEnabled: isEnabled,
      resolveMode: resolveEffectiveMode,
      isLogged: (prayer) => useHistory.getState().isLogged(prayer),
      soundName: soundById(selectedSoundId).fileName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, location, manager, global, perPrayer, alerts, selectedSoundId, masjidEnabled, atMosque, preDisarmFlags]);
}
