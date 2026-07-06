import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

export type PrayerAlertMap = Record<ObligatoryPrayer, boolean>;

const DEFAULT_ALERTS: PrayerAlertMap = {
  fajr: true,
  dhuhr: true,
  asr: true,
  maghrib: true,
  isha: true,
};

interface AlertPrefsState {
  alerts: PrayerAlertMap;
  toggle: (prayer: ObligatoryPrayer) => void;
  isEnabled: (prayer: ObligatoryPrayer) => boolean;
}

function load(): PrayerAlertMap {
  return (
    storage.getObject<PrayerAlertMap>(StorageKeys.notificationsEnabled) ??
    DEFAULT_ALERTS
  );
}

/** Per-prayer alert (bell) toggles. Consumed by the reminder scheduler. */
export const useAlertPrefs = create<AlertPrefsState>((set, get) => ({
  alerts: load(),
  toggle: (prayer) => {
    const next = { ...get().alerts, [prayer]: !get().alerts[prayer] };
    storage.setObject(StorageKeys.notificationsEnabled, next);
    set({ alerts: next });
  },
  isEnabled: (prayer) => get().alerts[prayer],
}));
