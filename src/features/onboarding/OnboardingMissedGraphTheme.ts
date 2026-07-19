import { lightColors } from "@/core/theme/colors";
import { ONBOARDING_INK } from "./OnboardingPastelPalette";

/** Colors for the missed-prayer stats reveal (cream page, red accents). */
export class OnboardingMissedGraphTheme {
  /** Theme surface cream — never red chrome. */
  static readonly pageBackground = lightColors.background;
  static readonly totalRed = "#DC2626";
  static readonly barRed = "#DC2626";
  static readonly label = ONBOARDING_INK;
  static readonly mutedLabel = ONBOARDING_INK;
  static readonly barTrack = "rgba(61,56,50,0.10)";
  static readonly chartSurface = lightColors.surface;
  static readonly chartBorder = "rgba(61,56,50,0.08)";
}
