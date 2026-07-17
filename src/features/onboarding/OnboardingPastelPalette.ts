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
  static forTone(tone: OnboardingPastelTone, isDark: boolean): OnboardingPastelView {
    const colors = isDark ? darkColors : lightColors;
    const resolved = this.resolve(tone, colors);
    const onDark = tone === "hardRed" || tone === "deepBlue" || tone === "hope";
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
          background: "#DC2626",
          surface: "#B91C1C",
          text: "#FFFFFF",
          textMuted: "rgba(255,255,255,0.92)",
          accent: "#FECACA",
        };
      case "deepBlue":
        return {
          background: "#2563EB",
          surface: "#1D4ED8",
          text: "#FFFFFF",
          textMuted: "rgba(255,255,255,0.92)",
          accent: "#BFDBFE",
        };
      case "hope":
        return {
          background: "#2563EB",
          surface: "#1D4ED8",
          text: "#FFFFFF",
          textMuted: "rgba(255,255,255,0.92)",
          accent: "#BFDBFE",
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
