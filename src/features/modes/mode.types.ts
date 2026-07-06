import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

/**
 * How the app behaves when a prayer time begins.
 * - alarm:    ring an AlarmKit alarm; dismiss by scanning.
 * - block:    shield selected apps; unblock by scanning.
 * - reminder: send a soft notification only.
 */
export type SalahMode = "alarm" | "block" | "reminder";

export const SALAH_MODE_LABELS: Record<SalahMode, string> = {
  alarm: "Smart Alarm",
  block: "Block Apps",
  reminder: "Reminders",
};

export const SALAH_MODE_DESCRIPTIONS: Record<SalahMode, string> = {
  alarm: "A prominent alarm rings at prayer time. Scan to dismiss.",
  block: "Selected apps are blocked until you scan to unlock.",
  reminder: "A gentle notification nudges you to pray.",
};

export const SALAH_MODE_ICON: Record<SalahMode, string> = {
  alarm: "alarm",
  block: "lock-closed",
  reminder: "notifications",
};

/** Optional per-prayer overrides of the global mode. */
export type PerPrayerModes = Partial<Record<ObligatoryPrayer, SalahMode>>;
