import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { MonthCompletionSection } from "@/components/history/MonthCompletionSection";
import { HeatmapLegend } from "@/components/history/HeatmapLegend";
import { useTheme } from "@/core/theme";
import { spacing } from "@/core/theme/spacing";
import { haptics } from "@/core/haptics/HapticsManager";
import { completionRangeBuilder } from "@/features/history/CompletionRangeBuilder";
import { prayerHistoryManager } from "@/features/history/PrayerHistoryManager";
import { DayCompletion } from "@/features/history/history.types";

const COLUMN_GAP = 12;

export default function YearCompletionScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const year = new Date().getFullYear();
  const [yearCompletions, setYearCompletions] = useState<DayCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  const contentWidth = width - spacing.lg * 2;
  const columnWidth = (contentWidth - COLUMN_GAP) / 2;

  useEffect(() => {
    let active = true;
    void prayerHistoryManager.completionsForYear(year).then((data) => {
      if (active) {
        setYearCompletions(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [year]);

  const months = useMemo(
    () => completionRangeBuilder.buildYearMonths(yearCompletions, year),
    [yearCompletions, year]
  );

  return (
    <>
      <Stack.Screen options={{ animation: "slide_from_right" }} />
      <Screen scroll>
      <Pressable
        onPress={() => {
          haptics.selection();
          router.back();
        }}
        style={styles.back}
      >
        <Ionicons name="chevron-back" size={22} color={theme.colors.textPrimary} />
        <ThemedText variant="body">Back</ThemedText>
      </Pressable>

      <ThemedText variant="title">{year}</ThemedText>
      <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
        Every day of each month
      </ThemedText>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      ) : (
        <View style={[styles.monthGrid, { gap: COLUMN_GAP }]}>
          {months.map((month) => (
            <View key={`${month.year}-${month.monthIndex}`} style={{ width: columnWidth }}>
              <MonthCompletionSection month={month} containerWidth={columnWidth} />
            </View>
          ))}
        </View>
      )}
      {!loading && <HeatmapLegend />}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  subtitle: { marginTop: 4, marginBottom: 16 },
  loader: { paddingVertical: 40, alignItems: "center" },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
