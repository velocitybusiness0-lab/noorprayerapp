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
};

/** Soft dusk — still calm, never harsh black. */
export const darkColors: ColorPalette = {
  background: "#2A3140",
  backgroundElevated: "#343D4F",
  surface: "#3A4456",
  surfaceTranslucent: "rgba(58,68,86,0.72)",
  border: "rgba(168,200,220,0.18)",
  hairline: "rgba(240,237,232,0.1)",
  textPrimary: "#F0EDE8",
  textSecondary: "#B8B4AC",
  textTertiary: "#8A8680",
  textInverse: "#2A3140",
  accent: "#8BBFA8",
  onAccent: "#2A3140",
  success: "#9AD4B4",
  danger: "#E0A098",
  overlay: "rgba(20,24,32,0.55)",
  arcTrack: "rgba(139,191,168,0.22)",
  arcActive: "#8BBFA8",
  sageMuted: "rgba(107,158,136,0.28)",
  sand: "#4A4538",
  sky: "#6A8AA8",
  lavender: "#7A7090",
  warmGlow: "#C99860",
  heroGradientStart: "#3A4A52",
  heroGradientEnd: "#3D3A50",
};
