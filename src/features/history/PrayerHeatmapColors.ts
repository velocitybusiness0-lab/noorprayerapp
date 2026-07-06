export const HEATMAP_NONE = "#D4847C";
export const HEATMAP_MOST = "#E8C84A";
export const HEATMAP_ALL = "#6B9E88";

export const HEATMAP_LEGEND = {
  none: "None prayed",
  most: "Most prayed",
  all: "All prayed",
} as const;

/** Maps 0–5 daily namaz count to red, yellow, or green. */
export function colorForPrayerCount(count: number): string {
  const clamped = Math.max(0, Math.min(5, count));
  if (clamped === 0) return HEATMAP_NONE;
  if (clamped === 5) return HEATMAP_ALL;
  return HEATMAP_MOST;
}

export function colorForPrayerLogged(logged: boolean): string {
  return logged ? HEATMAP_ALL : HEATMAP_NONE;
}
