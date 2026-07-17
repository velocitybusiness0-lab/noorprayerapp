import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";

interface ReminderPrefsState {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

function loadEnabled(): boolean {
  const saved = storage.getBoolean(StorageKeys.prayerRemindersEnabled);
  return saved ?? true;
}

/** Master toggle for soft prayer reminder notifications. */
export const useReminderPrefs = create<ReminderPrefsState>((set) => ({
  enabled: loadEnabled(),
  setEnabled: (enabled) => {
    storage.setBoolean(StorageKeys.prayerRemindersEnabled, enabled);
    set({ enabled });
  },
}));

export function arePrayerRemindersEnabled(): boolean {
  return useReminderPrefs.getState().enabled;
}
