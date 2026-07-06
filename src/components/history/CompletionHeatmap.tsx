import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DayCompletion } from "@/features/history/history.types";

interface CompletionHeatmapProps {
  completions: DayCompletion[];
  days?: number;
}

/** Pastel sage grid showing how many prayers were logged each recent day. */
export function CompletionHeatmap({ completions, days = 35 }: CompletionHeatmapProps) {
  const theme = useTheme();
  // Oldest -> newest for natural left-to-right reading.
  const window = completions.slice(0, days).reverse();

  return (
    <Card style={styles.card}>
      <ThemedText variant="caption" color="textTertiary" style={styles.title}>
        LAST {days} DAYS
      </ThemedText>
      <View style={styles.grid}>
        {window.map((day) => {
          const intensity = day.prayed.length / 5;
          return (
            <View
              key={day.dayKey}
              style={[
                styles.cell,
                {
                  backgroundColor:
                    intensity === 0
                      ? theme.colors.backgroundElevated
                      : theme.colors.accent,
                  opacity: intensity === 0 ? 1 : 0.35 + intensity * 0.65,
                  borderRadius: theme.radii.sm,
                },
              ]}
            />
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16 },
  title: { marginBottom: 12, letterSpacing: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  cell: { width: 26, height: 26 },
});
