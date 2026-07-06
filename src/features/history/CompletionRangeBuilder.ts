import { dayKey } from "@/core/utils/time";
import { DayCompletion } from "./history.types";

export interface MonthCompletionBlock {
  monthIndex: number;
  year: number;
  label: string;
  leadingEmptyDays: number;
  days: DayCompletion[];
}

/** Builds day-by-day completion windows for heatmap views. */
export class CompletionRangeBuilder {
  /** First day of the month when the user logged their earliest prayer. */
  firstMonthStart(completions: DayCompletion[], today = new Date()): Date {
    const active = completions.filter((day) => day.prayed.length > 0);
    if (active.length === 0) {
      return new Date(today.getFullYear(), today.getMonth(), 1);
    }

    const earliestKey = active.reduce(
      (min, day) => (day.dayKey < min ? day.dayKey : min),
      active[0].dayKey
    );
    const [year, month] = earliestKey.split("-").map(Number);
    return new Date(year, month - 1, 1);
  }

  /** Every day from `start` through `end`, oldest first. */
  buildRange(completions: DayCompletion[], start: Date, end: Date): DayCompletion[] {
    const byKey = new Map(completions.map((day) => [day.dayKey, day]));
    return this.buildRangeFromMap(byKey, start, end);
  }

  /** Recent window, oldest first. */
  lastNDays(completions: DayCompletion[], count: number): DayCompletion[] {
    return completions.slice(0, count).reverse();
  }

  /** Every month in a calendar year, each with all its days. */
  buildYearMonths(completions: DayCompletion[], year: number): MonthCompletionBlock[] {
    const byKey = new Map(completions.map((day) => [day.dayKey, day]));
    const months: MonthCompletionBlock[] = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const start = new Date(year, monthIndex, 1);
      const end = new Date(year, monthIndex + 1, 0);
      months.push({
        monthIndex,
        year,
        label: start.toLocaleDateString([], { month: "long" }),
        leadingEmptyDays: start.getDay(),
        days: this.buildRangeFromMap(byKey, start, end),
      });
    }

    return months;
  }

  private buildRangeFromMap(
    byKey: Map<string, DayCompletion>,
    start: Date,
    end: Date
  ): DayCompletion[] {
    const result: DayCompletion[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    while (cursor <= endDate) {
      const key = dayKey(cursor);
      result.push(byKey.get(key) ?? { dayKey: key, prayed: [], complete: false });
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  }
}

export const completionRangeBuilder = new CompletionRangeBuilder();
