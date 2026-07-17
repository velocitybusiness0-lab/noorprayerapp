import { useEffect } from "react";
import { AppState } from "react-native";
import { markAlarmDismissing } from "./alarmRouter";
import { alarmRingLoop } from "./AlarmRingLoopController";

const KEEP_ALIVE_MS = 3_000;

/** Keeps fallback alarm audio looping on ring and scan until confirmDismiss. */
export function useAlarmRingAudio(alarmId: string | undefined): void {
  useEffect(() => {
    if (!alarmId) return;

    markAlarmDismissing(alarmId);

    const kick = () => {
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
    };
  }, [alarmId]);
}
