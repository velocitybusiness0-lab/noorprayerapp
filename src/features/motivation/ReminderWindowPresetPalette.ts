import { ColorPalette } from "@/core/theme/colors";
import { MotivationWindowPreset } from "./motivation.types";

export type ReminderWindowPresetTint = {
  fill: string;
  border: string;
  selectedBorder: string;
};

/**
 * Soft pastel tints for Morning / Afternoon / Night chips.
 * Uses theme palette so light and dark modes stay calm and consistent.
 */
export class ReminderWindowPresetPalette {
  static tintFor(
    colors: ColorPalette,
    preset: MotivationWindowPreset
  ): ReminderWindowPresetTint {
    switch (preset) {
      case "morning":
        return {
          fill: colors.sunriseGradientStart,
          border: colors.warmGlow,
          selectedBorder: colors.warmGlow,
        };
      case "afternoon":
        return {
          fill: colors.sageMuted,
          border: colors.sky,
          selectedBorder: colors.accent,
        };
      case "night":
        return {
          fill: colors.lavender,
          border: colors.lavender,
          selectedBorder: colors.textSecondary,
        };
    }
  }
}
