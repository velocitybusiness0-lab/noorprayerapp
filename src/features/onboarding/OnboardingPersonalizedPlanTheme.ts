import { lightColors } from "@/core/theme/colors";
import { ONBOARDING_INK } from "./OnboardingPastelPalette";

/** Cream / sage palette for the personalized-plan pre-paywall page. */
export class OnboardingPersonalizedPlanTheme {
  static readonly ink = ONBOARDING_INK;
  /** Miraj cream page fill (`lightColors.background`). */
  static readonly pageBackground = lightColors.background;
  static readonly muted = "rgba(61,56,50,0.68)";
  static readonly softMuted = "rgba(61,56,50,0.52)";
  static readonly cardSurface = lightColors.surface;
  /** Soft bottom vignette under the float CTA (transparent → cream). */
  static readonly bottomFadeColors = [
    "rgba(247,244,239,0)",
    "rgba(247,244,239,0.42)",
    "rgba(247,244,239,0.9)",
  ] as const;
  static readonly bottomFadeLocations = [0, 0.38, 1] as const;
  static readonly cardBorder = lightColors.hairline;
  static readonly sageFill = lightColors.sageMuted;
  static readonly accent = lightColors.accent;
  static readonly success = lightColors.success;
  static readonly checkFill = lightColors.accent;
  static readonly onCheckFill = lightColors.onAccent;
  static readonly star = lightColors.warmGlow;
  static readonly chipBorder = "rgba(107,158,136,0.22)";
  static readonly capsuleFill = "rgba(107,158,136,0.14)";
  static readonly pillFill = "#FFFFFF";
  static readonly pillBorder = "rgba(107,158,136,0.28)";
  static readonly quoteSurface = "rgba(232,220,200,0.42)";
  static readonly softCard = "rgba(255,253,249,0.92)";
  static readonly softCardBorder = "rgba(107,158,136,0.16)";
  static readonly divider = "rgba(107,158,136,0.28)";
  static readonly dividerFade = "rgba(107,158,136,0.08)";
  static readonly iconWash = "rgba(255,253,249,0.9)";
  static readonly emblemRing = "rgba(107,158,136,0.24)";
  static readonly emblemFill = "rgba(216,237,228,0.7)";
  static readonly skyWash = "rgba(168,200,220,0.28)";
  static readonly sandWash = "rgba(232,220,200,0.55)";
  static readonly lavenderWash = "rgba(200,188,216,0.3)";
  /** High-contrast special-discount card (deep sage + cream CTA — never pure black). */
  static readonly discountCardFill = "#2A4538";
  static readonly discountTitle = lightColors.onAccent;
  static readonly discountBody = "rgba(255,253,249,0.88)";
  static readonly discountCtaFill = lightColors.surface;
  static readonly discountCtaText = ONBOARDING_INK;
  static readonly discountAccent = "rgba(107,158,136,0.35)";
}
