import { AppState } from "react-native";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { scanSessionGuard } from "@/features/scan/ScanSessionGuard";
import { alarmAlertTracker } from "./AlarmAlertTracker";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmObjectHuntLaunchResolver } from "./AlarmObjectHuntLaunchResolver";
import { alarmRingLoop } from "./AlarmRingLoopController";
import { alarmRingPresentationGate } from "./AlarmRingPresentationGate";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { clearAlarmRingNavigationGuard, openAlarmRing } from "./alarmRouter";

type AlertingAlarm = { id: string; state: string };

/**
 * Ensures any actively ringing alarm always surfaces `/alarm/ring` once the
 * app can show UI. Closes the "audio only, no screen" gap after background
 * navigation failures or missed AlarmKit updates.
 */
export class AlarmRingPresentationRecovery {
  recover(alarms?: AlertingAlarm[]): void {
    if (AppState.currentState !== "active") return;

    const target = this.resolveTarget(alarms);
    if (!target) return;
    if (scanSessionGuard.isOpen(target.alarmId)) return;
    if (alarmRingPresentationGate.isPresented(target.alarmId)) return;

    clearAlarmRingNavigationGuard();
    openAlarmRing(target.slot, target.alarmId, { force: true });
  }

  private resolveTarget(
    alarms?: AlertingAlarm[]
  ): { slot: ObligatoryPrayer; alarmId: string } | null {
    if (alarms) {
      for (const alarm of alarms) {
        if (alarm.state !== "alerting") continue;
        return { slot: this.slotFor(alarm.id), alarmId: alarm.id };
      }
    }

    for (const alarmId of alarmAlertTracker.alertingIds()) {
      return { slot: this.slotFor(alarmId), alarmId };
    }

    const pendingId = alarmRingPresentationGate.pendingAlarmId;
    if (pendingId) {
      return { slot: this.slotFor(pendingId), alarmId: pendingId };
    }

    const sessionId = alarmSessionCoordinator.currentAlarmId;
    if (sessionId && alarmSessionCoordinator.blocksScheduling()) {
      return { slot: this.slotFor(sessionId), alarmId: sessionId };
    }

    const loopId = alarmRingLoop.activeAlarmId;
    if (loopId) {
      return { slot: this.slotFor(loopId), alarmId: loopId };
    }

    let due: { slot: ObligatoryPrayer; alarmId: string } | null = null;
    alarmFireRegistry.forEachDue((alarmId) => {
      if (due) return;
      due = { slot: this.slotFor(alarmId), alarmId };
    });
    return due;
  }

  private slotFor(alarmId: string): ObligatoryPrayer {
    return alarmObjectHuntLaunchResolver.resolveSlot(alarmId) ?? "fajr";
  }
}

export const alarmRingPresentationRecovery = new AlarmRingPresentationRecovery();
