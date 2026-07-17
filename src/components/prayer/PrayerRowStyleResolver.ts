import { ColorPalette } from "@/core/theme/colors";
import { PrayerSlot } from "@/features/prayerTimes/prayerTimes.types";

export type RowBackdrop = "plain" | "current" | "sunrise" | "maghrib";

export interface RowForeground {
  icon: string;
  text: string;
  bellActive: string;
  bellMuted: string;
  emphasized: boolean;
}

/** Maps prayer slot + state to row backdrop and foreground colors. */
export class PrayerRowStyleResolver {
  backdrop(slot: PrayerSlot, isCurrent: boolean): RowBackdrop {
    if (isCurrent && slot !== "sunrise") return "current";
    if (slot === "sunrise") return "sunrise";
    if (slot === "maghrib") return "maghrib";
    return "plain";
  }

  hasDivider(backdrop: RowBackdrop): boolean {
    return backdrop === "plain";
  }

  foreground(backdrop: RowBackdrop, palette: ColorPalette): RowForeground {
    switch (backdrop) {
      case "current":
        return {
          icon: palette.accent,
          text: palette.accent,
          bellActive: palette.accent,
          bellMuted: palette.accent,
          emphasized: true,
        };
      case "sunrise":
        return {
          icon: palette.sunriseForeground,
          text: palette.sunriseForeground,
          bellActive: palette.sunriseForeground,
          bellMuted: palette.sunriseForeground,
          emphasized: false,
        };
      case "maghrib":
        return {
          icon: palette.textPrimary,
          text: palette.textPrimary,
          bellActive: palette.accent,
          bellMuted: palette.textTertiary,
          emphasized: false,
        };
      default:
        return {
          icon: palette.textPrimary,
          text: palette.textPrimary,
          bellActive: palette.accent,
          bellMuted: palette.textTertiary,
          emphasized: false,
        };
    }
  }
}

export const prayerRowStyleResolver = new PrayerRowStyleResolver();
