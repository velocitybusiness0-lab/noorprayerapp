import { ColorPalette, darkColors, lightColors } from "./colors";
import { spacing, radii } from "./spacing";
import { typography } from "./typography";

export type ThemeMode = "system" | "dark" | "light";

export interface Theme {
  isDark: boolean;
  colors: ColorPalette;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  /** Matching blur tint for translucent chrome. */
  blurTint: "dark" | "light";
}

export const darkTheme: Theme = {
  isDark: true,
  colors: darkColors,
  spacing,
  radii,
  typography,
  blurTint: "dark",
};

export const lightTheme: Theme = {
  isDark: false,
  colors: lightColors,
  spacing,
  radii,
  typography,
  blurTint: "light",
};

export function themeForScheme(isDark: boolean): Theme {
  return isDark ? darkTheme : lightTheme;
}
