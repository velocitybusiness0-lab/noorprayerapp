import { alarmAlertTracker } from "./AlarmAlertTracker";
import { alarmManager } from "./AlarmManager";
import { alarmRingLoop } from "./AlarmRingLoopController";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { alarmKitOwnershipRegistry } from "./AlarmKitOwnershipRegistry";
import { alarmContinuityStore } from "./AlarmContinuityStore";
import { alarmRingPresentationGate } from "./AlarmRingPresentationGate";

/** Ends an active prayer alarm only after object hunt succeeds. */
class ActiveAlarmController {
  async confirmDismiss(alarmId: string | undefined): Promise<void> {
    if (alarmId) {
      alarmFireRegistry.clear(alarmId);
      alarmAlertTracker.clear(alarmId);
      alarmKitOwnershipRegistry.release(alarmId);
      alarmContinuityStore.clear(alarmId);
    }
    // Mark idle before stop so continuity controller does not re-arm.
    alarmSessionCoordinator.onDismissed();
    alarmRingPresentationGate.clear();
    await alarmRingLoop.stop();
    if (!alarmId) return;
    await alarmManager.stop(alarmId);
  }
}

export const activeAlarmController = new ActiveAlarmController();
