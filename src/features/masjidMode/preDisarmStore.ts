import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { dayKey } from "@/core/utils/time";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

type SlotFlags = Record<string, boolean>;

interface PreDisarmState {
  flags: SlotFlags;
  preDisarm: (slot: ObligatoryPrayer, when?: Date) => void;
  isPreDisarmed: (slot: ObligatoryPrayer, when?: Date) => boolean;
}

function keyFor(slot: ObligatoryPrayer, when: Date): string {
  return `${dayKey(when)}:${slot}`;
}

function load(): SlotFlags {
  return storage.getObject<SlotFlags>(StorageKeys.preDisarmedSlots) ?? {};
}

/**
 * Tracks prayers the user has manually pre-disarmed (e.g. by scanning the
 * masjid/wudhu area beforehand). The coordinator softens these to a reminder
 * so no alarm/block fires when they are already heading to pray.
 */
export const usePreDisarm = create<PreDisarmState>((set, get) => ({
  flags: load(),
  preDisarm: (slot, when = new Date()) => {
    const next = { ...get().flags, [keyFor(slot, when)]: true };
    storage.setObject(StorageKeys.preDisarmedSlots, next);
    set({ flags: next });
  },
  isPreDisarmed: (slot, when = new Date()) => !!get().flags[keyFor(slot, when)],
}));
