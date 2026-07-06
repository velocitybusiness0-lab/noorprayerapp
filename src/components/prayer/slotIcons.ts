import { Ionicons } from "@expo/vector-icons";
import { PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";

/** Shared icon per prayer slot, reused by rows, arcs and widgets. */
export const SLOT_ICON: Record<PrayerSlot, keyof typeof Ionicons.glyphMap> = {
  fajr: "partly-sunny-outline",
  sunrise: "sunny-outline",
  dhuhr: "sunny",
  asr: "partly-sunny",
  maghrib: "cloudy-night-outline",
  isha: "moon",
};
