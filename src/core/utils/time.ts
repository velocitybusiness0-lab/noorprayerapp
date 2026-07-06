/** Small, dependency-light time helpers shared across features. */

/** Formats a Date as a locale clock time, e.g. "5:46 AM" or "17:46". */
export function formatClock(date: Date, use24h = false): string {
  return date.toLocaleTimeString([], {
    hour: use24h ? "2-digit" : "numeric",
    minute: "2-digit",
    hour12: !use24h,
  });
}

/**
 * Formats a signed millisecond duration as `H:MM:SS`.
 * Negative input yields a leading `-` (used for count-up since a prayer).
 */
export function formatCountdown(ms: number): string {
  const negative = ms < 0;
  const total = Math.floor(Math.abs(ms) / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${negative ? "-" : ""}${hours}:${pad(minutes)}:${pad(seconds)}`;
}

/** Fraction (0..1) of `now` between `start` and `end`, clamped. */
export function progressBetween(start: number, end: number, now: number): number {
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (now - start) / (end - start)));
}

/** True when both dates fall on the same calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** ISO date key (YYYY-MM-DD) in local time, for history/streak grouping. */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}
