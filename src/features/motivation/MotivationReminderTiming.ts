import { MotivationWindowHours } from "./MotivationWindowPresetCatalog";

/**
 * Computes fire dates for motivation notifications inside daily windows.
 * Spreads quantity evenly so reminders do not cluster or spam.
 *
 * Multi-select scheduling: split `quantityPerDay` as evenly as possible across
 * selected windows (e.g. 5 across Morning+Night → 3 + 2), then spread each
 * share inside that window's hours. Gaps between non-adjacent presets are not
 * filled — only the union of selected ranges fires.
 */
export class MotivationReminderTiming {
  /**
   * Returns fire times for `day` between startHour (inclusive) and endHour
   * (exclusive), skipping any times already in the past.
   */
  static fireTimesForDay(
    day: Date,
    quantity: number,
    windowStartHour: number,
    windowEndHour: number,
    now: Date = new Date()
  ): Date[] {
    if (quantity <= 0) return [];
    if (windowEndHour <= windowStartHour) return [];

    const windowStartMs = MotivationReminderTiming.atHour(day, windowStartHour).getTime();
    const windowEndMs = MotivationReminderTiming.atHour(day, windowEndHour).getTime();
    const spanMs = windowEndMs - windowStartMs;
    if (spanMs <= 0) return [];

    const times: Date[] = [];
    for (let i = 0; i < quantity; i += 1) {
      const fraction = (i + 0.5) / quantity;
      const fire = new Date(windowStartMs + spanMs * fraction);
      if (fire.getTime() > now.getTime() + 30_000) {
        times.push(fire);
      }
    }
    return times;
  }

  /** Today + tomorrow fire times for a single hour window. */
  static upcomingFireTimes(
    quantityPerDay: number,
    windowStartHour: number,
    windowEndHour: number,
    now: Date = new Date()
  ): Date[] {
    return MotivationReminderTiming.upcomingFireTimesForWindows(quantityPerDay, [
      { startHour: windowStartHour, endHour: windowEndHour },
    ], now);
  }

  /**
   * Today + tomorrow fire times across the union of selected windows.
   * Quantity is distributed per window, then spread within each range.
   */
  static upcomingFireTimesForWindows(
    quantityPerDay: number,
    windows: readonly MotivationWindowHours[],
    now: Date = new Date()
  ): Date[] {
    if (quantityPerDay <= 0 || windows.length === 0) return [];

    const shares = MotivationReminderTiming.splitQuantity(quantityPerDay, windows.length);
    const today = MotivationReminderTiming.startOfDay(now);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const times: Date[] = [];
    for (let i = 0; i < windows.length; i += 1) {
      const { startHour, endHour } = windows[i];
      const share = shares[i];
      times.push(
        ...MotivationReminderTiming.fireTimesForDay(today, share, startHour, endHour, now),
        ...MotivationReminderTiming.fireTimesForDay(tomorrow, share, startHour, endHour, now)
      );
    }
    return times.sort((a, b) => a.getTime() - b.getTime());
  }

  /** Splits total as evenly as possible (remainder goes to the first windows). */
  static splitQuantity(total: number, parts: number): number[] {
    if (parts <= 0) return [];
    if (total <= 0) return Array.from({ length: parts }, () => 0);
    const base = Math.floor(total / parts);
    const remainder = total % parts;
    return Array.from({ length: parts }, (_, i) => base + (i < remainder ? 1 : 0));
  }

  private static startOfDay(date: Date): Date {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
  }

  private static atHour(day: Date, hour: number): Date {
    const next = new Date(day);
    if (hour >= 24) {
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      return next;
    }
    next.setHours(hour, 0, 0, 0);
    return next;
  }
}
