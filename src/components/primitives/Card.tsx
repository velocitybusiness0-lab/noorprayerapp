import React from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/core/theme";

interface CardProps extends ViewProps {
  translucent?: boolean;
  padded?: boolean;
  style?: ViewStyle;
}

/** Surface container. Optionally rendered as translucent blurred glass. */
export function Card({
  translucent = false,
  padded = true,
  style,
  children,
  ...rest
}: CardProps) {
  const theme = useTheme();
  const radius = theme.radii.lg;
  const padding = padded ? theme.spacing.lg : 0;

  if (translucent) {
    return (
      <BlurView
        intensity={40}
        tint={theme.blurTint}
        style={[
          styles.base,
          { borderRadius: radius, padding, borderColor: theme.colors.hairline },
          style,
        ]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.base,
        {
          borderRadius: radius,
          padding,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.hairline,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
});
