import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "@/core/theme";
import { TypographyToken } from "@/core/theme/typography";
import { ColorPalette } from "@/core/theme/colors";

type ColorToken = keyof Pick<
  ColorPalette,
  "textPrimary" | "textSecondary" | "textTertiary" | "textInverse" | "accent" | "onAccent" | "danger"
>;

interface ThemedTextProps extends TextProps {
  variant?: TypographyToken;
  color?: ColorToken;
}

/** Text that pulls size/weight and colour from the active theme. */
export function ThemedText({
  variant = "body",
  color = "textPrimary",
  style,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const base: TextStyle = {
    ...theme.typography[variant],
    color: theme.colors[color],
  };
  return <Text style={[base, style]} {...rest} />;
}
