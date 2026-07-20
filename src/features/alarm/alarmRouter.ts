import { ObligatoryPrayer, PRAYER_LABELS } from "@/features/prayerTimes/prayerTimes.types";
import { scanSessionGuard } from "@/features/scan/ScanSessionGuard";
import { alarmAlertTracker } from "./AlarmAlertTracker";
import { alarmContinuityStore } from "./AlarmContinuityStore";
import { alarmFireRegistry } from "./AlarmFireRegistry";
import { alarmRingLoop } from "./AlarmRingLoopController";
import { alarmRingPresentationGate } from "./AlarmRingPresentationGate";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";

export type AlarmRingHandler = (slot: ObligatoryPrayer, alarmId: string) => void;

let ringHandler: AlarmRingHandler | null = null;
let pendingRing: { slot: ObligatoryPrayer; alarmId: string } | null = null;

function mayOpenRing(alarmId: string): boolean {
  return (
    alarmFireRegistry.isDue(alarmId) ||
    alarmAlertTracker.isAlerting(alarmId) ||
    alarmSessionCoordinator.isActive(alarmId)
  );
}

/** Registered by the root navigator so alarms can open the continue / ring gate. */
export function setAlarmRingHandler(handler: AlarmRingHandler | null): void {
  ringHandler = handler;
  if (!handler) return;

  const pending = pendingRing;
  if (!pending) return;
  pendingRing = null;
  handler(pending.slot, pending.alarmId);
}

/**
 * Legacy hook retained for lock-screen / resume call sites. Presentation
 * retries are owned by `AlarmRingPresentationGate` (unmounted = retry).
 */
export function clearAlarmRingNavigationGuard(): void {
  // no-op: gate retries until markPresented; do not wipe a visible Continue UI.
}

export interface OpenAlarmRingOptions {
  /** Trust lock-screen Open / Stop handoff even if AlarmKit already stopped. */
  force?: boolean;
}

/**
 * Opens the continue / ring gate when an alarm is due, AlarmKit is alerting,
 * or the user opens Miraj from the lock-screen alarm actions. Object hunt
 * starts only after Continue on that screen.
 *
 * Navigation retries until the ring screen mounts (presentation gate).
 * Audio never runs as a silent-only path without a pending presentation.
 */
export function openAlarmRing(
  slot: ObligatoryPrayer,
  alarmId: string,
  options?: OpenAlarmRingOptions
): void {
  if (scanSessionGuard.isOpen(alarmId)) return;

  const alerting = alarmAlertTracker.isAlerting(alarmId);
  if (!options?.force && !mayOpenRing(alarmId) && !alerting) return;

  alarmContinuityStore.remember(alarmId, {
    title: `${PRAYER_LABELS[slot]} \u2022 Time to pray`,
    slot,
  });

  alarmSessionCoordinator.onAlarmFired(alarmId);
  alarmRingPresentationGate.markRequested(alarmId);

  // Retry until Continue mounts. Never treat a backgrounded replace as done.
  if (!alarmRingPresentationGate.isPresented(alarmId)) {
    if (ringHandler) {
      ringHandler(slot, alarmId);
    } else {
      pendingRing = { slot, alarmId };
    }
  }

  // Audio after navigation request so we never ring without a presentation path.
  void alarmRingLoop.ensurePlaying(alarmId);
}

/** Call when ring or scan screen mounts so scheduling stays blocked and UI is confirmed. */
export function markAlarmDismissing(alarmId: string | undefined): void {
  if (!alarmId) return;
  alarmSessionCoordinator.onRingOrScanOpen(alarmId);
  alarmRingPresentationGate.markPresented(alarmId);
}
