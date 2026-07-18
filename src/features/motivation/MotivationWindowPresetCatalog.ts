import { MotivationWindowPreset } from "./motivation.types";

/** Inclusive start / exclusive end hour for a delivery window. */
export type MotivationWindowHours = {
  startHour: number;
  endHour: number;
};

/**
 * Maps reminder window presets to hour ranges for the scheduler.
 *
 * Defaults (documented for product + scheduling):
 * - Morning: 6–12
 * - Afternoon: 12–17
 * - Night: 17–22
 * End hours are exclusive (same convention as MotivationReminderTiming).
 */
export class MotivationWindowPresetCatalog {
  static readonly all: MotivationWindowPreset[] = ["morning", "afternoon", "night"];

  private static readonly ranges: Record<MotivationWindowPreset, MotivationWindowHours> = {
    morning: { startHour: 6, endHour: 12 },
    afternoon: { startHour: 12, endHour: 17 },
    night: { startHour: 17, endHour: 22 },
  };

  private static readonly labels: Record<MotivationWindowPreset, string> = {
    morning: "Morning",
    afternoon: "Afternoon",
    night: "Night",
  };

  /** Midpoints used when migrating legacy custom From/To hours. */
  private static readonly midpoints: Record<MotivationWindowPreset, number> = {
    morning: 9,
    afternoon: 14.5,
    night: 19.5,
  };

  static hoursFor(preset: MotivationWindowPreset): MotivationWindowHours {
    return MotivationWindowPresetCatalog.ranges[preset];
  }

  static labelFor(preset: MotivationWindowPreset): string {
    return MotivationWindowPresetCatalog.labels[preset];
  }

  static isPreset(value: unknown): value is MotivationWindowPreset {
    return (
      value === "morning" || value === "afternoon" || value === "night"
    );
  }

  /**
   * Dedupes and orders presets in catalog order. Empty input → [].
   * Callers that need a non-empty default should fall back separately.
   */
  static normalizeList(values: readonly unknown[]): MotivationWindowPreset[] {
    const seen = new Set<MotivationWindowPreset>();
    const ordered: MotivationWindowPreset[] = [];
    for (const preset of MotivationWindowPresetCatalog.all) {
      if (!values.includes(preset) || seen.has(preset)) continue;
      seen.add(preset);
      ordered.push(preset);
    }
    return ordered;
  }

  /** Hour ranges for each selected preset (catalog order). */
  static hoursForPresets(presets: readonly MotivationWindowPreset[]): MotivationWindowHours[] {
    return MotivationWindowPresetCatalog.normalizeList(presets).map((preset) =>
      MotivationWindowPresetCatalog.hoursFor(preset)
    );
  }

  /**
   * Maps legacy start/end hours to the nearest preset.
   * Corrupt or non-finite values fall back to morning.
   */
  static nearestFromHours(startHour: number, endHour: number): MotivationWindowPreset {
    if (!Number.isFinite(startHour) || !Number.isFinite(endHour)) {
      return "morning";
    }
    const midpoint = (startHour + endHour) / 2;
    if (!Number.isFinite(midpoint)) return "morning";

    let best: MotivationWindowPreset = "morning";
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const preset of MotivationWindowPresetCatalog.all) {
      const distance = Math.abs(midpoint - MotivationWindowPresetCatalog.midpoints[preset]);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = preset;
      }
    }
    return best;
  }
}
