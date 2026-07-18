import { useEffect } from "react";
import { AppState } from "react-native";
import { markAlarmDismissing } from "./alarmRouter";
import { alarmRingLoop } from "./AlarmRingLoopController";
import { alarmKitOwnershipRegistry } from "./AlarmKitOwnershipRegistry";
import { isAlarmKitUuid } from "./AlarmKitUuid";

const KEEP_ALIVE_MS = 3_000;

/**
 * Keeps dismiss session active on ring/scan. Does not start a second ringtone
 * when AlarmKit owns the alarm — AlarmKit rings until hunt completes.
 */
export function useAlarmRingAudio(alarmId: string | undefined): void {
  useEffect(() => {
    if (!alarmId) return;

    if (isAlarmKitUuid(alarmId)) {
      alarmKitOwnershipRegistry.mark(alarmId);
    }
    markAlarmDismissing(alarmId);

    const kick = () => {
      // ensurePlaying no-ops (and disposes any in-app player) when AlarmKit owns.
      void alarmRingLoop.ensurePlaying(alarmId);
    };

    kick();
    const keepAlive = setInterval(kick, KEEP_ALIVE_MS);
    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") kick();
    });

    return () => {
      clearInterval(keepAlive);
      appStateSub.remove();
      // Do not stop AlarmKit here — leaving ring → scan must keep the same sound.
    };
  }, [alarmId]);
}
