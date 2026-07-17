import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { alarmAlertTracker } from "./AlarmAlertTracker";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmRingLoop } from "./AlarmRingLoopController";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { scanSessionGuard } from "@/features/scan/ScanSessionGuard";

export type AlarmRingHandler = (slot: ObligatoryPrayer, alarmId: string) => void;

let ringHandler: AlarmRingHandler | null = null;
let lastRingKey: string | null = null;
let pendingRing: { slot: ObligatoryPrayer; alarmId: string } | null = null;

function ringRouteKey(slot: ObligatoryPrayer, alarmId: string): string {
  return `${slot}:${alarmId}`;
}

function mayOpenRing(alarmId: string): boolean {
  return (
    alarmFireRegistry.isDue(alarmId) ||
    alarmAlertTracker.isAlerting(alarmId) ||
    alarmSessionCoordinator.isActive(alarmId)
  );
}

/** Registered by the root navigator so alarms can open the ring screen. */
export function setAlarmRingHandler(handler: AlarmRingHandler | null): void {
  ringHandler = handler;
  if (!handler) return;

  const pending = pendingRing;
  if (!pending) return;
  pendingRing = null;
  handler(pending.slot, pending.alarmId);
}

/** Clears dedupe guard after leaving the ring flow (e.g. scan or home). */
export function clearAlarmRingNavigationGuard(): void {
  lastRingKey = null;
}

/**
 * Opens the in-app ring screen when an alarm is due or AlarmKit is alerting.
 */
export function openAlarmRing(slot: ObligatoryPrayer, alarmId: string): void {
  if (scanSessionGuard.isOpen(alarmId)) return;

  const alerting = alarmAlertTracker.isAlerting(alarmId);
  if (!mayOpenRing(alarmId) && !alerting) return;

  const isNewFire = alarmSessionCoordinator.currentPhase === "idle";
  alarmSessionCoordinator.onAlarmFired(alarmId);
  void alarmRingLoop.ensurePlaying(alarmId);

  const key = ringRouteKey(slot, alarmId);
  if (lastRingKey === key && !isNewFire) return;
  if (isNewFire) lastRingKey = null;
  lastRingKey = key;
  if (ringHandler) {
    ringHandler(slot, alarmId);
    return;
  }
  pendingRing = { slot, alarmId };
}

/** Call when ring or scan screen mounts so scheduling stays blocked. */
export function markAlarmDismissing(alarmId: string | undefined): void {
  if (!alarmId) return;
  alarmSessionCoordinator.onRingOrScanOpen(alarmId);
}
