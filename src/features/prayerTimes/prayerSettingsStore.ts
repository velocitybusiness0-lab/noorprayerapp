import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import {
  DEFAULT_CALCULATION_SETTINGS,
  PrayerCalculationSettings,
  ResolvedLocation,
} from "./prayerTimes.types";
import { regionCalculationResolver } from "./RegionCalculationResolver";
import { countryDisplayName } from "./region/countryRegions";

interface PrayerSettingsState {
  settings: PrayerCalculationSettings;
  autoByCountry: boolean;
  detectedCountryCode: string | null;
  detectedCountryName: string | null;
  update: (patch: Partial<PrayerCalculationSettings>) => void;
  setAutoByCountry: (enabled: boolean) => void;
  applyForLocation: (location: ResolvedLocation) => void;
}

function loadSettings(): PrayerCalculationSettings {
  return (
    storage.getObject<PrayerCalculationSettings>(StorageKeys.calculationMethod) ??
    DEFAULT_CALCULATION_SETTINGS
  );
}

function loadAutoByCountry(): boolean {
  return storage.getBoolean(StorageKeys.calculationAutoByCountry) ?? true;
}

/** Reactive, persisted prayer calculation settings with country-aware defaults. */
export const usePrayerSettings = create<PrayerSettingsState>((set, get) => ({
  settings: loadSettings(),
  autoByCountry: loadAutoByCountry(),
  detectedCountryCode: storage.getString(StorageKeys.detectedCountryCode) ?? null,
  detectedCountryName: countryDisplayName(
    storage.getString(StorageKeys.detectedCountryCode) ?? undefined
  ),

  update: (patch) => {
    const next = { ...get().settings, ...patch };
    storage.setObject(StorageKeys.calculationMethod, next);
    storage.setBoolean(StorageKeys.calculationAutoByCountry, false);
    set({ settings: next, autoByCountry: false });
  },

  setAutoByCountry: (enabled) => {
    storage.setBoolean(StorageKeys.calculationAutoByCountry, enabled);
    set({ autoByCountry: enabled });
    if (enabled) {
      const code = get().detectedCountryCode;
      if (code) {
        const cached = storage.getObject<ResolvedLocation>(StorageKeys.lastKnownLocation);
        if (cached) get().applyForLocation(cached);
      }
    }
  },

  applyForLocation: (location) => {
    const result = regionCalculationResolver.resolveFromLocation(location);
    const prev = get();

    const countryChanged = result.countryCode !== prev.detectedCountryCode;
    const settingsChanged =
      prev.autoByCountry &&
      (result.settings.method !== prev.settings.method ||
        result.settings.madhab !== prev.settings.madhab ||
        result.settings.highLatitudeRule !== prev.settings.highLatitudeRule);

    if (!countryChanged && !settingsChanged) return;

    if (countryChanged) {
      storage.setString(StorageKeys.detectedCountryCode, result.countryCode ?? "");
    }
    if (settingsChanged) {
      storage.setObject(StorageKeys.calculationMethod, result.settings);
    }

    set({
      ...(countryChanged
        ? {
            detectedCountryCode: result.countryCode,
            detectedCountryName: result.countryName,
          }
        : {}),
      ...(settingsChanged ? { settings: result.settings } : {}),
    });
  },
}));
