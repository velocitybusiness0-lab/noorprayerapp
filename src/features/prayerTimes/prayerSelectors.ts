import { RowState } from "@/components/prayer/PrayerRow";
import { PrayerSlot } from "./prayerTimes.types";

/** Derives whether a prayer slot is past, current, or upcoming. */
export function rowStateFor(
  slot: PrayerSlot,
  time: Date,
  currentSlot: PrayerSlot | null,
  now: Date = new Date()
): RowState {
  if (slot === currentSlot) return "current";
  return time.getTime() < now.getTime() ? "past" : "upcoming";
}
