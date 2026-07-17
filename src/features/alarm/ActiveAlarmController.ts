import { alarmAlertTracker } from "./AlarmAlertTracker";
import { alarmManager } from "./AlarmManager";
import { alarmRingLoop } from "./AlarmRingLoopController";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";

/** Ends an active prayer alarm only after explicit user confirmation. */
class ActiveAlarmController {
  async confirmDismiss(alarmId: string | undefined): Promise<void> {
    if (alarmId) {
      alarmFireRegistry.clear(alarmId);
      alarmAlertTracker.clear(alarmId);
    }
    alarmSessionCoordinator.onDismissed();
    await alarmRingLoop.stop();
    if (!alarmId) return;
    await alarmManager.stop(alarmId);
  }
}

export const activeAlarmController = new ActiveAlarmController();
