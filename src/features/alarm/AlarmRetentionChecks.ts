import { alarmAlertTracker } from "./AlarmAlertTracker";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { devAlarmKeepRegistry } from "./DevAlarmKeepRegistry";

/** Shared retention rules that do not depend on fire-time state. */
export function shouldRetainForActiveAlarm(alarmKitId: string): boolean {
  return (
    devAlarmKeepRegistry.has(alarmKitId) ||
    alarmAlertTracker.isAlerting(alarmKitId) ||
    alarmSessionCoordinator.isActive(alarmKitId)
  );
}
