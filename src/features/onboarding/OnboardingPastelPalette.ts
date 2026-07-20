import { ColorPalette, darkColors, lightColors } from "@/core/theme/colors";

/** Always black for onboarding chrome and body copy. */
export const ONBOARDING_INK = "#3D3832";

export type OnboardingPastelTone =
  | "default"
  | "white"
  | "lightBlue"
  | "urgency"
  | "hardRed"
  | "deepBlue"
  | "hope"
  | "green";

export interface OnboardingPastelColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
}

export interface OnboardingPastelView {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
}

/** Onboarding screen backgrounds — full-page tones use black-readable fills. */
export class OnboardingPastelPalette {
  /** Pastel onboarding tones use dark ink; reserved for any future dark fills. */
  static isDarkTone(_tone: OnboardingPastelTone): boolean {
    return false;
  }

  static forTone(tone: OnboardingPastelTone, isDark: boolean): OnboardingPastelView {
    const colors = isDark ? darkColors : lightColors;
    const resolved = this.resolve(tone, colors);
    const onDark = this.isDarkTone(tone);
    return {
      bg: resolved.background,
      surface: resolved.surface,
      text: onDark ? "#FFFFFF" : ONBOARDING_INK,
      textMuted: onDark ? "rgba(255,255,255,0.92)" : ONBOARDING_INK,
      accent: resolved.accent,
    };
  }

  static resolve(tone: OnboardingPastelTone, colors: ColorPalette): OnboardingPastelColors {
    switch (tone) {
      case "white":
        return {
          background: "#FFFFFF",
          surface: "#FFFFFF",
          text: ONBOARDING_INK,
          textMuted: ONBOARDING_INK,
          accent: colors.accent,
        };
      case "lightBlue":
        return {
          background: "#E0F2FE",
          surface: "#E0F2FE",
          text: ONBOARDING_INK,
          textMuted: ONBOARDING_INK,
          accent: colors.sky,
        };
      case "urgency":
        return {
          background: "#FEE2E2",
          surface: "#FEE2E2",
          text: ONBOARDING_INK,
          textMuted: ONBOARDING_INK,
          accent: "#DC2626",
        };
      case "hardRed":
        return {
          background: "#F3B8B2",
          surface: "#EDAAA3",
          text: ONBOARDING_INK,
          textMuted: ONBOARDING_INK,
          accent: "#C45C54",
        };
      case "deepBlue":
        return {
          background: "#A9C7E6",
          surface: "#95B8DB",
          text: ONBOARDING_INK,
          textMuted: ONBOARDING_INK,
          accent: "#3B6FA8",
        };
      case "hope":
        return {
          background: "#A9C7E6",
          surface: "#95B8DB",
          text: ONBOARDING_INK,
          textMuted: ONBOARDING_INK,
          accent: "#3B6FA8",
        };
      case "green":
        return {
          background: "#BBF7D0",
          surface: "#BBF7D0",
          text: ONBOARDING_INK,
          textMuted: ONBOARDING_INK,
          accent: "#16A34A",
        };
      default:
        return {
          background: colors.background,
          surface: colors.surface,
          text: ONBOARDING_INK,
          textMuted: ONBOARDING_INK,
          accent: colors.accent,
        };
    }
  }
}
