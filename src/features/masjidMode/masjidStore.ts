import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { GeoCoordinates } from "@/features/prayerTimes/prayerTimes.types";
import { masjidModeManager } from "./MasjidModeManager";
import { DEFAULT_MOSQUE_RADIUS_M, SavedMosque } from "./masjid.types";

interface MasjidState {
  enabled: boolean;
  mosques: SavedMosque[];
  atMosque: boolean;
  nearbyName: string | null;
  setEnabled: (enabled: boolean) => void;
  addMosque: (name: string, coords: GeoCoordinates) => void;
  removeMosque: (id: string) => void;
  updatePresence: (coords: GeoCoordinates) => void;
}

function loadEnabled(): boolean {
  return storage.getBoolean(StorageKeys.masjidModeEnabled) ?? false;
}
function loadMosques(): SavedMosque[] {
  return storage.getObject<SavedMosque[]>(StorageKeys.savedMosques) ?? [];
}

/**
 * Masjid mode state: whether it's on, the user's saved mosques, and whether
 * they are currently at one. When at a masjid, the coordinator softens alarms
 * and blocks to a quiet reminder + "did you pray?" follow-up.
 */
export const useMasjid = create<MasjidState>((set, get) => ({
  enabled: loadEnabled(),
  mosques: loadMosques(),
  atMosque: false,
  nearbyName: null,

  setEnabled: (enabled) => {
    storage.setBoolean(StorageKeys.masjidModeEnabled, enabled);
    set({ enabled });
  },

  addMosque: (name, coords) => {
    const mosque: SavedMosque = {
      id: `mosque-${Date.now()}`,
      name: name.trim() || "My masjid",
      latitude: coords.latitude,
      longitude: coords.longitude,
      radius: DEFAULT_MOSQUE_RADIUS_M,
    };
    const mosques = [...get().mosques, mosque];
    storage.setObject(StorageKeys.savedMosques, mosques);
    set({ mosques });
  },

  removeMosque: (id) => {
    const mosques = get().mosques.filter((m) => m.id !== id);
    storage.setObject(StorageKeys.savedMosques, mosques);
    set({ mosques });
  },

  updatePresence: (coords) => {
    const proximity = masjidModeManager.nearestInRange(coords, get().mosques);
    set({
      atMosque: proximity !== null,
      nearbyName: proximity?.mosque.name ?? null,
    });
  },
}));
