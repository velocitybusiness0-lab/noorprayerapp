import { alarmAlertTracker } from "./AlarmAlertTracker";
import { alarmKitOwnershipRegistry } from "./AlarmKitOwnershipRegistry";

/**
 * One ringtone only: AlarmKit owns sound from fire until object hunt completes.
 * In-app loop is solely for devices / alarms that never used AlarmKit.
 */
export class AlarmRingAudioPolicy {
  /** True when Miraj should play the bundled loop instead of relying on AlarmKit. */
  shouldPlayInAppLoop(alarmId: string): boolean {
    if (alarmKitOwnershipRegistry.owns(alarmId)) return false;
    if (alarmAlertTracker.isAlerting(alarmId)) return false;
    return true;
  }
}

export const alarmRingAudioPolicy = new AlarmRingAudioPolicy();
