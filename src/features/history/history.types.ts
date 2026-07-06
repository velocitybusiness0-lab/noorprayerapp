import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

/** How a prayer came to be logged. */
export type PrayerSource = "manual" | "notification" | "scan";

export interface PrayerLogEntry {
  dayKey: string;
  slot: ObligatoryPrayer;
  prayedAt: number;
  source: PrayerSource;
}

export interface DayCompletion {
  dayKey: string;
  prayed: ObligatoryPrayer[];
  /** True when all five obligatory prayers are logged that day. */
  complete: boolean;
}

export interface StreakSummary {
  current: number;
  longest: number;
  /** Number of obligatory prayers logged today (0..5). */
  todayCount: number;
}
