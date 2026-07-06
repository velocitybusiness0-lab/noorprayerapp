/**
 * Peaceful pastel palette — warm creams, soft sage, sky, and sand.
 * Inspired by calm prayer apps (Pillars, Prayer Lock): light, comfy, tranquil.
 */
export interface ColorPalette {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceTranslucent: string;
  border: string;
  hairline: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  accent: string;
  onAccent: string;
  success: string;
  danger: string;
  overlay: string;
  arcTrack: string;
  arcActive: string;
  /** Soft mint wash for highlighted rows and chips. */
  sageMuted: string;
  /** Warm sand for secondary surfaces. */
  sand: string;
  /** Soft sky blue for decorative accents. */
  sky: string;
  /** Gentle lavender for gradients and depth. */
  lavender: string;
  /** Warm gold for sun marker, streak flame, celebrations. */
  warmGlow: string;
  heroGradientStart: string;
  heroGradientEnd: string;
  sunriseGradientStart: string;
  sunriseGradientEnd: string;
  sunsetGradientStart: string;
  sunsetGradientEnd: string;
}

export const lightColors: ColorPalette = {
  background: "#F7F4EF",
  backgroundElevated: "#EDE8DF",
  surface: "#FFFDF9",
  surfaceTranslucent: "rgba(255,253,249,0.78)",
  border: "rgba(107,158,136,0.22)",
  hairline: "rgba(61,56,50,0.08)",
  textPrimary: "#3D3832",
  textSecondary: "#6B6560",
  textTertiary: "#9A948C",
  textInverse: "#FFFDF9",
  accent: "#6B9E88",
  onAccent: "#FFFFFF",
  success: "#7CB89A",
  danger: "#D4847C",
  overlay: "rgba(61,56,50,0.28)",
  arcTrack: "rgba(107,158,136,0.28)",
  arcActive: "#6B9E88",
  sageMuted: "#D8EDE4",
  sand: "#E8DCC8",
  sky: "#A8C8DC",
  lavender: "#C8BCD8",
  warmGlow: "#D4A574",
  heroGradientStart: "#D8EDE4",
  heroGradientEnd: "#E4E0F0",
  sunriseGradientStart: "#FFF4E0",
  sunriseGradientEnd: "#FFD898",
  sunsetGradientStart: "#FFD4B8",
  sunsetGradientEnd: "#E8B8D8",
};

/** Soft dusk navy — cool blue base with harmonized surfaces and accents. */
export const darkColors: ColorPalette = {
  background: "#2A3140",
  backgroundElevated: "#323B4D",
  surface: "#3C465A",
  surfaceTranslucent: "rgba(60,70,90,0.82)",
  border: "rgba(160,190,215,0.15)",
  hairline: "rgba(220,228,240,0.09)",
  textPrimary: "#E6EAEF",
  textSecondary: "#A0A8B8",
  textTertiary: "#707888",
  textInverse: "#2A3140",
  accent: "#82C4A8",
  onAccent: "#1E2836",
  success: "#94D4B8",
  danger: "#D89890",
  overlay: "rgba(18,22,30,0.58)",
  arcTrack: "rgba(130,196,168,0.38)",
  arcActive: "#82C4A8",
  sageMuted: "rgba(130,196,168,0.28)",
  sand: "#404858",
  sky: "#7098B8",
  lavender: "#7888A8",
  warmGlow: "#F0BC68",
  heroGradientStart: "#3A4858",
  heroGradientEnd: "#424A62",
  sunriseGradientStart: "#4A4458",
  sunriseGradientEnd: "#8A6838",
  sunsetGradientStart: "#5A3040",
  sunsetGradientEnd: "#483868",
};
