import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import {
  HEATMAP_ALL,
  HEATMAP_LEGEND,
  HEATMAP_MOST,
  HEATMAP_NONE,
} from "@/features/history/PrayerHeatmapColors";

const SWATCHES = [
  { color: HEATMAP_NONE, label: HEATMAP_LEGEND.none },
  { color: HEATMAP_MOST, label: HEATMAP_LEGEND.most },
  { color: HEATMAP_ALL, label: HEATMAP_LEGEND.all },
] as const;

/** Three-color key for prayer-count heatmaps. */
export function HeatmapLegend() {
  return (
    <View style={styles.wrap}>
      {SWATCHES.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.swatch, { backgroundColor: item.color }]} />
          <ThemedText variant="caption" color="textTertiary" style={styles.label}>
            {item.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, gap: 8 },
  item: { flex: 1, alignItems: "center", gap: 6 },
  swatch: { width: "100%", height: 10, borderRadius: 999 },
  label: { fontSize: 10, lineHeight: 13, textAlign: "center" },
});
