import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "@/core/theme";
import { colorForPrayerCount } from "@/features/history/PrayerHeatmapColors";

interface CompletionDayCellProps {
  prayedCount: number;
  size?: number;
  style?: ViewStyle;
}

/** Single day square in a completion heatmap (0–5 prayers, red → green). */
export function CompletionDayCell({ prayedCount, size = 20, style }: CompletionDayCellProps) {
  const theme = useTheme();
  const radius = Math.min(theme.radii.sm, Math.max(2, size * 0.28));
  const count = Math.max(0, Math.min(5, prayedCount));

  return (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colorForPrayerCount(count),
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  cell: {},
});
