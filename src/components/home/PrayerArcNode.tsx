import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";

export type PrayerArcNodeState = "past" | "current" | "upcoming";

interface PrayerArcNodeProps {
  icon: keyof typeof Ionicons.glyphMap;
  x: number;
  y: number;
  state: PrayerArcNodeState;
  size?: number;
}

const DEFAULT_SIZE = 36;

/** Circular badge sitting on the prayer progress arc. */
export function PrayerArcNode({
  icon,
  x,
  y,
  state,
  size = DEFAULT_SIZE,
}: PrayerArcNodeProps) {
  const theme = useTheme();
  const half = size / 2;

  const backgroundColor =
    state === "past"
      ? theme.colors.accent
      : state === "current"
        ? theme.colors.surface
        : "transparent";

  const borderColor =
    state === "upcoming" ? theme.colors.arcTrack : theme.colors.accent;

  const borderWidth = state === "current" ? 2.5 : state === "past" ? 0 : 1.5;

  const iconColor =
    state === "past"
      ? theme.colors.onAccent
      : state === "current"
        ? theme.colors.accent
        : theme.colors.textSecondary;

  return (
    <View
      style={[
        styles.node,
        {
          left: x - half,
          top: y - half,
          width: size,
          height: size,
          borderRadius: half,
          backgroundColor,
          borderColor,
          borderWidth,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  node: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
