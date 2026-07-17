import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { isExpoGo } from "@/core/runtime/isExpoGo";
import { alarmManager } from "./AlarmManager";
import { alarmRegistry } from "./AlarmRegistry";
import { alarmAlertTracker } from "./AlarmAlertTracker";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { clearAlarmRingNavigationGuard, openAlarmRing } from "./alarmRouter";

type AlarmKitAlarm = { id: string; state: string };

type AlarmKitListenerManager = {
  addAlarmUpdatesListener: (cb: (alarms: AlarmKitAlarm[]) => void) => { remove: () => void };
  getAlarms?: () => Promise<AlarmKitAlarm[]>;
  alarms?: AlarmKitAlarm[];
};

function mayOpenRing(alarmId: string): boolean {
  return (
    alarmFireRegistry.isDue(alarmId) ||
    alarmAlertTracker.isAlerting(alarmId) ||
    alarmSessionCoordinator.isActive(alarmId)
  );
}

function syncAlertingState(alarms: AlarmKitAlarm[]): void {
  const alertingIds = alarms
    .filter((alarm) => alarm.state === "alerting")
    .map((alarm) => alarm.id);
  alarmAlertTracker.sync(alertingIds);
}

function openRingForNewlyAlertingAlarms(
  alarms: AlarmKitAlarm[],
  seen: Set<string>
): void {
  for (const alarm of alarms) {
    if (alarm.state !== "alerting") {
      seen.delete(alarm.id);
      continue;
    }
    if (seen.has(alarm.id)) continue;

    const slot = alarmRegistry.slotFor(alarm.id);
    if (!slot) continue;
    if (!mayOpenRing(alarm.id) && !alarmAlertTracker.isAlerting(alarm.id)) continue;

    seen.add(alarm.id);
    openAlarmRing(slot, alarm.id);
  }
}

function resumeAlertingRingIfNeeded(alarms: AlarmKitAlarm[]): void {
  for (const alarm of alarms) {
    if (alarm.state !== "alerting") continue;
    const slot = alarmRegistry.slotFor(alarm.id);
    if (!slot) continue;
    clearAlarmRingNavigationGuard();
    openAlarmRing(slot, alarm.id);
    return;
  }

  alarmFireRegistry.forEachDue((alarmId) => {
    const slot = alarmRegistry.slotFor(alarmId);
    if (!slot) return;
    clearAlarmRingNavigationGuard();
    openAlarmRing(slot, alarmId);
  });
}

function handleAlarmUpdates(
  alarms: AlarmKitAlarm[],
  alerting: Set<string>
): void {
  syncAlertingState(alarms);
  openRingForNewlyAlertingAlarms(alarms, alerting);
}

async function refreshNativeAlarms(
  manager: AlarmKitListenerManager,
  alerting: Set<string>,
  onUpdate: (alarms: AlarmKitAlarm[]) => void
): Promise<void> {
  if (!manager.getAlarms) return;
  try {
    const alarms = await manager.getAlarms();
    onUpdate(alarms);
    handleAlarmUpdates(alarms, alerting);
  } catch {
    // Native module may be unavailable during startup.
  }
}

/**
 * Opens the ring screen when AlarmKit alerts at prayer time, including after
 * returning to the foreground if the alarm is still ringing.
 */
export function useAlarmKitListener(): void {
  useEffect(() => {
    if (isExpoGo() || Platform.OS !== "ios" || !alarmManager.isSupported) return;

    let subscription: { remove: () => void } | null = null;
    let appStateSub: { remove: () => void } | null = null;
    const alerting = new Set<string>();
    let manager: AlarmKitListenerManager | null = null;

    const applyUpdates = (alarms: AlarmKitAlarm[]) => {
      handleAlarmUpdates(alarms, alerting);
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require("react-native-ios-alarmkit");
      manager = mod.AlarmKitManager?.shared ?? null;
      if (!manager?.addAlarmUpdatesListener) return;

      subscription = manager.addAlarmUpdatesListener(applyUpdates);

      if (manager.alarms?.length) {
        applyUpdates(manager.alarms);
      }

      void refreshNativeAlarms(manager, alerting, () => undefined);

      appStateSub = AppState.addEventListener("change", (state) => {
        if (state !== "active" || !manager) {
          if (state === "background" || state === "inactive") alerting.clear();
          return;
        }

        void refreshNativeAlarms(manager, alerting, (alarms) => {
          resumeAlertingRingIfNeeded(alarms);
        });
      });
    } catch {
      return;
    }

    return () => {
      subscription?.remove();
      appStateSub?.remove();
    };
  }, []);
}
