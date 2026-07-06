import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { CompletionDayCell } from "@/components/history/CompletionDayCell";
import { fittedCalendarGridMetrics } from "@/components/history/CalendarGridMetrics";
import { MonthCompletionBlock } from "@/features/history/CompletionRangeBuilder";
import { DayCompletion } from "@/features/history/history.types";

interface MonthCompletionSectionProps {
  month: MonthCompletionBlock;
  containerWidth: number;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const COLUMNS = 7;
const GRID_GAP = 4;

/** One month: bold month title + day-box calendar sized to its column. */
export function MonthCompletionSection({ month, containerWidth }: MonthCompletionSectionProps) {
  const { cellSize, gridWidth } = fittedCalendarGridMetrics(containerWidth, COLUMNS, GRID_GAP);

  const rows = useMemo(() => {
    const padded: (DayCompletion | null)[] = [
      ...Array.from({ length: month.leadingEmptyDays }, () => null),
      ...month.days,
    ];
    const chunked: (DayCompletion | null)[][] = [];
    for (let i = 0; i < padded.length; i += COLUMNS) {
      chunked.push(padded.slice(i, i + COLUMNS));
    }
    return chunked;
  }, [month.days, month.leadingEmptyDays]);

  return (
    <View style={styles.section}>
      <ThemedText variant="title" style={styles.monthTitle}>
        {month.label}
      </ThemedText>

      <View style={[styles.weekdays, { width: gridWidth, gap: GRID_GAP }]}>
        {WEEKDAY_LABELS.map((label, index) => (
          <View
            key={`${month.label}-${label}-${index}`}
            style={[styles.weekday, { width: cellSize }]}
          >
            <ThemedText variant="caption" color="textTertiary" style={styles.weekdayText}>
              {label}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.rows}>
        {rows.map((row, rowIndex) => (
          <View
            key={`row-${month.monthIndex}-${rowIndex}`}
            style={[styles.row, { width: gridWidth, gap: GRID_GAP }]}
          >
            {row.map((day, cellIndex) => (
              <View
                key={day?.dayKey ?? `empty-${rowIndex}-${cellIndex}`}
                style={{ width: cellSize, height: cellSize }}
              >
                {day && <CompletionDayCell prayedCount={day.prayed.length} size={cellSize} />}
              </View>
            ))}
            {row.length < COLUMNS &&
              Array.from({ length: COLUMNS - row.length }).map((_, index) => (
                <View
                  key={`pad-${rowIndex}-${index}`}
                  style={{ width: cellSize, height: cellSize }}
                />
              ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 8 },
  monthTitle: { marginBottom: 8, letterSpacing: -0.3, fontSize: 22, lineHeight: 28 },
  weekdays: { flexDirection: "row", marginBottom: 4 },
  weekday: { alignItems: "center" },
  weekdayText: { fontSize: 10, lineHeight: 12 },
  rows: { gap: GRID_GAP },
  row: { flexDirection: "row" },
});
