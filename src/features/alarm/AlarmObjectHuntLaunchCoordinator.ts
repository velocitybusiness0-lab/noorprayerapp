import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { alarmObjectHuntDeepLinkParser } from "./AlarmObjectHuntDeepLinkParser";
import { alarmObjectHuntLaunchResolver } from "./AlarmObjectHuntLaunchResolver";
import { alarmObjectHuntPendingLaunchReader } from "./AlarmObjectHuntPendingLaunchReader";
import { clearAlarmRingNavigationGuard, openAlarmRing } from "./alarmRouter";

/**
 * Opens the continue / ring gate once when Miraj is launched from an AlarmKit
 * lock-screen Open / Stop / secondary action (deep link and/or app-group
 * pending handoff). Object hunt starts only after the user taps Continue.
 */
export class AlarmObjectHuntLaunchCoordinator {
  private lastHandledKey: string | null = null;

  handleUrl(url: string): boolean {
    const link = alarmObjectHuntDeepLinkParser.parse(url);
    if (!link) return false;
    return this.open(link.alarmId, link.slot as ObligatoryPrayer | undefined);
  }

  consumePendingLaunch(): boolean {
    const alarmId = alarmObjectHuntPendingLaunchReader.consumeAlarmId();
    if (!alarmId) return false;
    return this.open(alarmId);
  }

  open(alarmId: string, slotHint?: ObligatoryPrayer): boolean {
    const slot =
      slotHint ?? alarmObjectHuntLaunchResolver.resolveSlot(alarmId) ?? "fajr";
    const key = `${slot}:${alarmId}`;
    if (this.lastHandledKey === key) return true;
    this.lastHandledKey = key;
    clearAlarmRingNavigationGuard();
    // Force: Stop may clear AlarmKit alerting before JS reads state.
    openAlarmRing(slot, alarmId, { force: true });
    return true;
  }

  resetDedupe(): void {
    this.lastHandledKey = null;
  }
}

export const alarmObjectHuntLaunchCoordinator =
  new AlarmObjectHuntLaunchCoordinator();
