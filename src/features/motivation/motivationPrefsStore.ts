import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { MotivationPrefsManager } from "./MotivationPrefsManager";
import {
  DEFAULT_MOTIVATION_PREFS,
  MotivationCategoryId,
  MotivationNotificationPrefs,
  MotivationPrefs,
  MotivationWindowPreset,
} from "./motivation.types";

interface MotivationPrefsState extends MotivationPrefs {
  setEnabledCategories: (categories: MotivationCategoryId[]) => void;
  toggleCategory: (categoryId: MotivationCategoryId) => void;
  toggleWindowPreset: (preset: MotivationWindowPreset) => void;
  setNotifications: (patch: Partial<MotivationNotificationPrefs>) => void;
  replace: (prefs: MotivationPrefs) => void;
}

function loadPrefs(): MotivationPrefs {
  const stored = storage.getObject<Partial<MotivationPrefs>>(StorageKeys.motivationPrefs);
  return MotivationPrefsManager.sanitize(stored);
}

function persist(prefs: MotivationPrefs): void {
  storage.setObject(StorageKeys.motivationPrefs, prefs);
}

/** Persisted preferences for reminder types and motivation notifications. */
export const useMotivationPrefs = create<MotivationPrefsState>((set, get) => {
  const initial = loadPrefs();
  return {
    ...initial,
    setEnabledCategories: (enabledCategories) => {
      const next = MotivationPrefsManager.sanitize({
        ...get(),
        enabledCategories,
      });
      persist(next);
      set({ enabledCategories: next.enabledCategories, notifications: next.notifications });
    },
    toggleCategory: (categoryId) => {
      const next = MotivationPrefsManager.toggleCategory(
        {
          enabledCategories: get().enabledCategories,
          notifications: get().notifications,
        },
        categoryId
      );
      persist(next);
      set({ enabledCategories: next.enabledCategories });
    },
    toggleWindowPreset: (preset) => {
      const next = MotivationPrefsManager.toggleWindowPreset(
        {
          enabledCategories: get().enabledCategories,
          notifications: get().notifications,
        },
        preset
      );
      persist(next);
      set({ notifications: next.notifications });
    },
    setNotifications: (patch) => {
      const next = MotivationPrefsManager.withNotifications(
        {
          enabledCategories: get().enabledCategories,
          notifications: get().notifications,
        },
        patch
      );
      persist(next);
      set({ notifications: next.notifications });
    },
    replace: (prefs) => {
      const next = MotivationPrefsManager.sanitize(prefs);
      persist(next);
      set({
        enabledCategories: next.enabledCategories,
        notifications: next.notifications,
      });
    },
  };
});

export function getMotivationPrefsSnapshot(): MotivationPrefs {
  const state = useMotivationPrefs.getState();
  return {
    enabledCategories: state.enabledCategories,
    notifications: state.notifications,
  };
}

export function getDefaultMotivationPrefs(): MotivationPrefs {
  return { ...DEFAULT_MOTIVATION_PREFS };
}
