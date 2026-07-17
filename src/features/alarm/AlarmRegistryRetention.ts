import { alarmFireRegistry } from "./AlarmFireRegistry";
import { shouldRetainForActiveAlarm } from "./AlarmRetentionChecks";

/** Whether an alarm slot mapping must survive scheduler prune/sync. */
export function shouldRetainAlarmRegistryEntry(alarmKitId: string): boolean {
  return (
    shouldRetainForActiveAlarm(alarmKitId) || alarmFireRegistry.isDue(alarmKitId)
  );
}
