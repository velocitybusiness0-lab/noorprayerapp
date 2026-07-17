import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/core/theme";
import { RowBackdrop } from "./PrayerRowStyleResolver";

interface PrayerRowBackgroundProps {
  backdrop: RowBackdrop;
  children: React.ReactNode;
  style?: ViewStyle;
}

/** Row backdrop: green for current namaz; sunrise and maghrib gradients; else plain. */
export function PrayerRowBackground({
  backdrop,
  children,
  style,
}: PrayerRowBackgroundProps) {
  const theme = useTheme();
  const shell = [styles.shell, { borderRadius: theme.radii.md }, style];

  if (backdrop === "current") {
    return (
      <View style={[...shell, { backgroundColor: theme.colors.sageMuted }]}>
        {children}
      </View>
    );
  }

  if (backdrop === "sunrise") {
    return (
      <LinearGradient
        colors={[theme.colors.sunriseGradientStart, theme.colors.sunriseGradientEnd]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={shell}
      >
        {children}
      </LinearGradient>
    );
  }

  if (backdrop === "maghrib") {
    return (
      <LinearGradient
        colors={[theme.colors.sunsetGradientStart, theme.colors.sunsetGradientEnd]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={shell}
      >
        {children}
      </LinearGradient>
    );
  }

  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  shell: { marginVertical: 2, overflow: "hidden" },
});
