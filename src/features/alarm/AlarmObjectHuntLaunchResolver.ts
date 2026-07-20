import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { alarmContinuityStore } from "./AlarmContinuityStore";
import { alarmRegistry } from "./AlarmRegistry";

/**
 * Resolves which prayer slot an AlarmKit id belongs to when opening object hunt
 * from a lock-screen intent that only carries the alarm UUID.
 */
export class AlarmObjectHuntLaunchResolver {
  resolveSlot(alarmId: string): ObligatoryPrayer | null {
    return alarmRegistry.slotFor(alarmId) ?? alarmContinuityStore.metaFor(alarmId)?.slot ?? null;
  }
}

export const alarmObjectHuntLaunchResolver = new AlarmObjectHuntLaunchResolver();
