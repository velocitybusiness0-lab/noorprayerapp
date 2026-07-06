import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DayCompletion } from "@/features/history/history.types";
import { PRAYER_LABELS } from "@/features/prayerTimes/prayerTimes.types";
import { colorForPrayerLogged } from "@/features/history/PrayerHeatmapColors";
import { weeklyNamazChartBuilder } from "@/features/history/WeeklyNamazChartBuilder";

interface WeeklyNamazChartProps {
  completions: DayCompletion[];
}

const CELL_SIZE = 22;
const LABEL_WIDTH = 84;

/** Seven-day grid: each prayer row × day column with daily totals. */
export function WeeklyNamazChart({ completions }: WeeklyNamazChartProps) {
  const theme = useTheme();
  const days = useMemo(() => weeklyNamazChartBuilder.build(completions), [completions]);
  const prayerRows = days[0]?.cells.map((cell) => cell.slot) ?? [];

  return (
    <Card style={styles.card}>
      <ThemedText variant="caption" color="textTertiary" style={styles.title}>
        THIS WEEK
      </ThemedText>

      <View style={styles.headerRow}>
        <View style={styles.labelSpacer} />
        {days.map((day) => (
          <View key={day.dayKey} style={styles.dayCol}>
            <ThemedText variant="caption" color="textTertiary" style={styles.dayLabel}>
              {day.weekdayLabel}
            </ThemedText>
          </View>
        ))}
      </View>

      {prayerRows.map((slot) => (
        <View key={slot} style={styles.dataRow}>
          <View style={styles.prayerLabel}>
            <ThemedText variant="caption" color="textSecondary">
              {PRAYER_LABELS[slot]}
            </ThemedText>
          </View>
          {days.map((day) => {
            const cell = day.cells.find((item) => item.slot === slot);
            const logged = cell?.logged ?? false;
            return (
              <View key={`${day.dayKey}-${slot}`} style={styles.dayCol}>
                <View
                  style={[
                    styles.cell,
                    {
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: colorForPrayerLogged(logged),
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      ))}

      <View style={[styles.dataRow, styles.totalRow, { borderTopColor: theme.colors.hairline }]}>
        <View style={styles.prayerLabel}>
          <ThemedText variant="caption" color="textTertiary">
            Total
          </ThemedText>
        </View>
        {days.map((day) => (
          <View key={`total-${day.dayKey}`} style={styles.dayCol}>
            <ThemedText variant="caption" color="textSecondary" style={styles.totalLabel}>
              {`${day.completedCount}/5`}
            </ThemedText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16 },
  title: { letterSpacing: 1, marginBottom: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  dataRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  labelSpacer: { width: LABEL_WIDTH, flexShrink: 0 },
  prayerLabel: { width: LABEL_WIDTH, flexShrink: 0, justifyContent: "center", paddingRight: 4 },
  dayCol: { flex: 1, alignItems: "center", justifyContent: "center", minWidth: 28 },
  dayLabel: { fontSize: 11 },
  cell: { borderRadius: 6 },
  totalRow: { marginTop: 4, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, marginBottom: 0 },
  totalLabel: { fontSize: 11, fontWeight: "600" },
});
