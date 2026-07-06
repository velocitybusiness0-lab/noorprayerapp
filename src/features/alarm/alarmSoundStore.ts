import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { DEFAULT_ALARM_SOUND_ID } from "./alarmSounds";

interface AlarmSoundState {
  selectedId: string;
  select: (id: string) => void;
}

/** Persisted selected alarm sound id. */
export const useAlarmSound = create<AlarmSoundState>((set) => ({
  selectedId:
    storage.getString(StorageKeys.selectedAlarmSound) ?? DEFAULT_ALARM_SOUND_ID,
  select: (id) => {
    storage.setString(StorageKeys.selectedAlarmSound, id);
    set({ selectedId: id });
  },
}));
