import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

/**
 * How the app behaves when a prayer time begins.
 * - alarm:    ring an AlarmKit alarm; dismiss by scanning.
 * - reminder: send a soft notification only.
 */
export type SalahMode = "alarm" | "reminder";

export const SALAH_MODE_LABELS: Record<SalahMode, string> = {
  alarm: "Smart Alarm",
  reminder: "Reminders",
};

export const SALAH_MODE_DESCRIPTIONS: Record<SalahMode, string> = {
  alarm: "A prominent alarm rings at prayer time. Scan to dismiss.",
  reminder: "A gentle notification nudges you to pray.",
};

export const SALAH_MODE_ICON: Record<SalahMode, string> = {
  alarm: "alarm",
  reminder: "notifications",
};

export const ALL_SALAH_MODES: SalahMode[] = ["alarm", "reminder"];

/** Optional per-prayer overrides of the global mode. */
export type PerPrayerModes = Partial<Record<ObligatoryPrayer, SalahMode>>;

export type ModeCheckFn = (prayer: ObligatoryPrayer, mode: SalahMode) => boolean;
