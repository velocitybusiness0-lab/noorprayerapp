import { dayKey } from "@/core/utils/time";
import { OBLIGATORY_PRAYERS, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { DayCompletion } from "./history.types";

export interface WeeklyNamazCell {
  slot: ObligatoryPrayer;
  logged: boolean;
}

export interface WeeklyNamazDay {
  dayKey: string;
  weekdayLabel: string;
  dateLabel: string;
  cells: WeeklyNamazCell[];
  completedCount: number;
  missedSlots: ObligatoryPrayer[];
}

/** Builds the last seven days of per-prayer completion for the weekly chart. */
export class WeeklyNamazChartBuilder {
  build(completions: DayCompletion[], today = new Date()): WeeklyNamazDay[] {
    const byKey = new Map(completions.map((day) => [day.dayKey, day]));
    const days: WeeklyNamazDay[] = [];

    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      const key = dayKey(date);
      const completion = byKey.get(key) ?? { dayKey: key, prayed: [], complete: false };
      const prayedSet = new Set(completion.prayed);
      const cells = OBLIGATORY_PRAYERS.map((slot) => ({
        slot,
        logged: prayedSet.has(slot),
      }));
      const missedSlots = OBLIGATORY_PRAYERS.filter((slot) => !prayedSet.has(slot));

      days.push({
        dayKey: key,
        weekdayLabel: date.toLocaleDateString([], { weekday: "short" }),
        dateLabel: date.toLocaleDateString([], { day: "numeric", month: "short" }),
        cells,
        completedCount: completion.prayed.length,
        missedSlots,
      });
    }

    return days;
  }
}

export const weeklyNamazChartBuilder = new WeeklyNamazChartBuilder();
