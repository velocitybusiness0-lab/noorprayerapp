import { RowState } from "@/components/prayer/PrayerRow";
import { PrayerSlot } from "./prayerTimes.types";

/** True once the adhan time for this slot has arrived (or passed). */
export function canLogPrayer(time: Date, now: Date = new Date()): boolean {
  return time.getTime() <= now.getTime();
}

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
