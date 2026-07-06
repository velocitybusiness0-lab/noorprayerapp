import { Platform, TextStyle } from "react-native";

/**
 * Type scale. Uses the platform system font for a native, professional feel.
 * Presets are intentionally few and reusable.
 */
const systemFont = Platform.select({ ios: "System", default: "sans-serif" });

export type TypographyToken =
  | "display"
  | "title"
  | "heading"
  | "body"
  | "bodyStrong"
  | "caption"
  | "mono";

export const typography: Record<TypographyToken, TextStyle> = {
  display: { fontFamily: systemFont, fontSize: 48, fontWeight: "700", letterSpacing: -1 },
  title: { fontFamily: systemFont, fontSize: 30, fontWeight: "700", letterSpacing: -0.5 },
  heading: { fontFamily: systemFont, fontSize: 20, fontWeight: "600", letterSpacing: -0.2 },
  body: { fontFamily: systemFont, fontSize: 16, fontWeight: "400" },
  bodyStrong: { fontFamily: systemFont, fontSize: 16, fontWeight: "600" },
  caption: { fontFamily: systemFont, fontSize: 13, fontWeight: "500", letterSpacing: 0.2 },
  mono: {
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    fontSize: 16,
    fontWeight: "500",
  },
};
