import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { ALL_SALAH_MODES, PerPrayerModes, SalahMode } from "./mode.types";

interface ModeState {
  enabledModes: SalahMode[];
  perPrayer: PerPrayerModes;
  toggleMode: (mode: SalahMode) => void;
  setEnabledModes: (modes: SalahMode[]) => void;
  isEnabled: (mode: SalahMode) => boolean;
  setForPrayer: (prayer: ObligatoryPrayer, mode: SalahMode | null) => void;
}

function loadEnabledModes(): SalahMode[] {
  const stored = storage.getObject<SalahMode[]>(StorageKeys.enabledModes);
  if (stored?.length) return normalizeModes(stored);

  const legacy = storage.getString(StorageKeys.globalMode) as SalahMode | undefined;
  return legacy && ALL_SALAH_MODES.includes(legacy) ? [legacy] : ["reminder"];
}

function loadPerPrayer(): PerPrayerModes {
  return storage.getObject<PerPrayerModes>(StorageKeys.perPrayerModes) ?? {};
}

function normalizeModes(modes: SalahMode[]): SalahMode[] {
  const unique = ALL_SALAH_MODES.filter((mode) => modes.includes(mode));
  return unique.length ? unique : ["reminder"];
}

function persistModes(modes: SalahMode[]): void {
  const normalized = normalizeModes(modes);
  storage.setObject(StorageKeys.enabledModes, normalized);
  storage.setString(StorageKeys.globalMode, normalized[0]);
}

/** Persisted mode selection. Consumed by the ModeCoordinator (Phase 6). */
export const useModes = create<ModeState>((set, get) => ({
  enabledModes: loadEnabledModes(),
  perPrayer: loadPerPrayer(),
  toggleMode: (mode) => {
    const current = get().enabledModes;
    const next = current.includes(mode)
      ? current.filter((item) => item !== mode)
      : [...current, mode];
    const normalized = normalizeModes(next);
    persistModes(normalized);
    set({ enabledModes: normalized });
  },
  setEnabledModes: (modes) => {
    const normalized = normalizeModes(modes);
    persistModes(normalized);
    set({ enabledModes: normalized });
  },
  isEnabled: (mode) => get().enabledModes.includes(mode),
  setForPrayer: (prayer, mode) => {
    const next = { ...get().perPrayer };
    if (mode === null) delete next[prayer];
    else next[prayer] = mode;
    storage.setObject(StorageKeys.perPrayerModes, next);
    set({ perPrayer: next });
  },
}));
