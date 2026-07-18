import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

interface ContinuityMeta {
  title: string;
  slot: ObligatoryPrayer;
}

/**
 * Remembers enough metadata to re-fire AlarmKit after the user taps stop/X
 * before object hunt completes.
 */
class AlarmContinuityStore {
  private byId = new Map<string, ContinuityMeta>();

  remember(alarmKitId: string, meta: ContinuityMeta): void {
    this.byId.set(alarmKitId, meta);
  }

  metaFor(alarmKitId: string): ContinuityMeta | null {
    return this.byId.get(alarmKitId) ?? null;
  }

  clear(alarmKitId: string): void {
    this.byId.delete(alarmKitId);
  }

  clearAll(): void {
    this.byId.clear();
  }
}

export const alarmContinuityStore = new AlarmContinuityStore();
