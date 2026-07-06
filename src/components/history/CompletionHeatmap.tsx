import React, { useMemo } from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { spacing } from "@/core/theme/spacing";
import { haptics } from "@/core/haptics/HapticsManager";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { CompletionDayCell } from "@/components/history/CompletionDayCell";
import { HeatmapLegend } from "@/components/history/HeatmapLegend";
import { fullWidthCalendarGridMetrics } from "@/components/history/CalendarGridMetrics";
import { DayCompletion } from "@/features/history/history.types";
import { completionRangeBuilder } from "@/features/history/CompletionRangeBuilder";

interface CompletionHeatmapProps {
  completions: DayCompletion[];
  previewDays?: number;
}

const DEFAULT_PREVIEW_DAYS = 30;
const GRID_GAP = 4;
/** 6 × 5 = 30 days with no partial last row. */
const COLUMNS = 6;

/** Preview of recent days; tap the header to open the full year view. */
export function CompletionHeatmap({
  completions,
  previewDays = DEFAULT_PREVIEW_DAYS,
}: CompletionHeatmapProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const cardInnerWidth = width - spacing.lg * 4;
  const { cellSize, gridWidth } = fullWidthCalendarGridMetrics(
    cardInnerWidth,
    COLUMNS,
    GRID_GAP
  );

  const days = useMemo(
    () => completionRangeBuilder.lastNDays(completions, previewDays),
    [completions, previewDays]
  );

  const rows = useMemo(() => {
    const chunked: DayCompletion[][] = [];
    for (let i = 0; i < days.length; i += COLUMNS) {
      chunked.push(days.slice(i, i + COLUMNS));
    }
    return chunked;
  }, [days]);

  return (
    <Card style={styles.card}>
      <Pressable
        onPress={() => {
          haptics.selection();
          router.push("/history/year");
        }}
        style={styles.header}
      >
        <ThemedText variant="caption" color="textTertiary" style={styles.title}>
          {`LAST ${previewDays} DAYS`}
        </ThemedText>
        <Ionicons name="chevron-forward" size={14} color={theme.colors.textTertiary} />
      </Pressable>

      <View style={[styles.grid, { width: gridWidth, gap: GRID_GAP }]}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={[styles.row, { gap: GRID_GAP }]}>
            {row.map((day) => (
              <CompletionDayCell key={day.dayKey} prayedCount={day.prayed.length} size={cellSize} />
            ))}
          </View>
        ))}
      </View>
      <HeatmapLegend />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { letterSpacing: 1, flex: 1 },
  grid: { gap: GRID_GAP },
  row: { flexDirection: "row" },
});
