import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { shouldRetainAlarmRegistryEntry } from "./AlarmRegistryRetention";

type AlarmSlotMap = Record<string, ObligatoryPrayer>;

/**
 * Persists AlarmKit UUID → prayer slot so alerting alarms can open the ring
 * screen even though native alarm payloads omit metadata.
 */
export class AlarmRegistry {
  register(alarmKitId: string, slot: ObligatoryPrayer): void {
    const map = this.read();
    map[alarmKitId] = slot;
    storage.setObject(StorageKeys.alarmSlotById, map);
  }

  slotFor(alarmKitId: string): ObligatoryPrayer | null {
    return this.read()[alarmKitId] ?? null;
  }

  prune(validIds: string[]): void {
    const map = this.read();
    const valid = new Set(validIds);
    let changed = false;
    for (const id of Object.keys(map)) {
      if (valid.has(id) || shouldRetainAlarmRegistryEntry(id)) continue;
      delete map[id];
      changed = true;
    }
    if (changed) storage.setObject(StorageKeys.alarmSlotById, map);
  }

  private read(): AlarmSlotMap {
    return storage.getObject<AlarmSlotMap>(StorageKeys.alarmSlotById) ?? {};
  }
}

export const alarmRegistry = new AlarmRegistry();
