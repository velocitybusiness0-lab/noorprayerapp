import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

export type AlarmRingHandler = (slot: ObligatoryPrayer, alarmId: string) => void;

let ringHandler: AlarmRingHandler | null = null;

/** Registered by the root navigator so alarms can open the ring screen. */
export function setAlarmRingHandler(handler: AlarmRingHandler | null): void {
  ringHandler = handler;
}

export function openAlarmRing(slot: ObligatoryPrayer, alarmId: string): void {
  ringHandler?.(slot, alarmId);
}
