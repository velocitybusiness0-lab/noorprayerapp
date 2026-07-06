import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { PerPrayerModes, SalahMode } from "./mode.types";

interface ModeState {
  global: SalahMode;
  perPrayer: PerPrayerModes;
  setGlobal: (mode: SalahMode) => void;
  setForPrayer: (prayer: ObligatoryPrayer, mode: SalahMode | null) => void;
  resolveFor: (prayer: ObligatoryPrayer) => SalahMode;
}

function loadGlobal(): SalahMode {
  return (storage.getString(StorageKeys.globalMode) as SalahMode) ?? "reminder";
}
function loadPerPrayer(): PerPrayerModes {
  return storage.getObject<PerPrayerModes>(StorageKeys.perPrayerModes) ?? {};
}

/** Persisted mode selection. Consumed by the ModeCoordinator (Phase 6). */
export const useModes = create<ModeState>((set, get) => ({
  global: loadGlobal(),
  perPrayer: loadPerPrayer(),
  setGlobal: (mode) => {
    storage.setString(StorageKeys.globalMode, mode);
    set({ global: mode });
  },
  setForPrayer: (prayer, mode) => {
    const next = { ...get().perPrayer };
    if (mode === null) delete next[prayer];
    else next[prayer] = mode;
    storage.setObject(StorageKeys.perPrayerModes, next);
    set({ perPrayer: next });
  },
  resolveFor: (prayer) => get().perPrayer[prayer] ?? get().global,
}));
