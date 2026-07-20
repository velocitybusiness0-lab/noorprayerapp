import { lightColors } from "@/core/theme/colors";
import { ONBOARDING_INK } from "./OnboardingPastelPalette";

/** Cream / sage palette for the personalized-plan pre-paywall page. */
export class OnboardingPersonalizedPlanTheme {
  static readonly ink = ONBOARDING_INK;
  static readonly muted = "rgba(61,56,50,0.68)";
  static readonly softMuted = "rgba(61,56,50,0.52)";
  static readonly cardSurface = lightColors.surface;
  static readonly cardBorder = lightColors.hairline;
  static readonly sageFill = lightColors.sageMuted;
  static readonly accent = lightColors.accent;
  static readonly success = lightColors.success;
  static readonly checkFill = lightColors.accent;
  static readonly star = lightColors.warmGlow;
  static readonly chipBorder = "rgba(107,158,136,0.22)";
  static readonly capsuleFill = "rgba(107,158,136,0.14)";
  static readonly pillFill = "#FFFFFF";
  static readonly pillBorder = "rgba(107,158,136,0.28)";
  static readonly heroGlowStart = "rgba(216,237,228,0.95)";
  static readonly heroGlowEnd = "rgba(247,244,239,0)";
  static readonly quoteSurface = "rgba(232,220,200,0.45)";
  static readonly softCard = "rgba(255,253,249,0.92)";
  static readonly softCardBorder = "rgba(107,158,136,0.2)";
  static readonly divider = "rgba(107,158,136,0.42)";
  static readonly iconWash = "rgba(255,253,249,0.85)";
  static readonly emblemRing = "rgba(107,158,136,0.28)";
  static readonly emblemFill = "rgba(216,237,228,0.7)";
  static readonly skyWash = "rgba(168,200,220,0.28)";
  static readonly sandWash = "rgba(232,220,200,0.55)";
  static readonly lavenderWash = "rgba(200,188,216,0.3)";
  /** High-contrast special-discount card (dark navy + white CTA). */
  static readonly discountCardFill = "#0B1220";
  static readonly discountTitle = "#FFFFFF";
  static readonly discountBody = "rgba(255,255,255,0.92)";
  static readonly discountCtaFill = "#FFFFFF";
  static readonly discountCtaText = "#0B1220";
}
