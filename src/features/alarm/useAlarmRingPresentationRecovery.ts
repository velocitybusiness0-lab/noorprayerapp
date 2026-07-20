import { useEffect } from "react";
import { AppState } from "react-native";
import { alarmRingPresentationRecovery } from "./AlarmRingPresentationRecovery";

/**
 * When the app becomes active, reopen `/alarm/ring` if an alarm is still
 * ringing but the Continue screen never mounted (background audio-only gap).
 */
export function useAlarmRingPresentationRecovery(): void {
  useEffect(() => {
    alarmRingPresentationRecovery.recover();

    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      alarmRingPresentationRecovery.recover();
    });

    return () => sub.remove();
  }, []);
}
