import { PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";

/** Maps each prayer slot to an SF Symbol name used by the iOS widget/Live Activity. */
export const SLOT_SF_SYMBOL: Record<PrayerSlot, string> = {
  fajr: "sunrise",
  sunrise: "sun.horizon",
  dhuhr: "sun.max",
  asr: "sun.min",
  maghrib: "sunset",
  isha: "moon.stars",
};

export function sfSymbolForSlot(slot: PrayerSlot | null | undefined): string {
  return slot ? SLOT_SF_SYMBOL[slot] : "moon.stars";
}
