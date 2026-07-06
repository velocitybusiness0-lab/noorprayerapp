import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { StreakSummary } from "@/features/history/history.types";

interface StreakSummaryCardProps {
  streak: StreakSummary;
}

/** Hero stats: current streak, longest streak, and today's 0..5 progress. */
export function StreakSummaryCard({ streak }: StreakSummaryCardProps) {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <View style={styles.main}>
        <Ionicons name="flame" size={30} color={theme.colors.warmGlow} />
        <ThemedText variant="display">{streak.current}</ThemedText>
        <ThemedText variant="caption" color="textTertiary">
          DAY STREAK
        </ThemedText>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.colors.hairline }]} />
      <View style={styles.stats}>
        <Stat label="Today" value={`${streak.todayCount}/5`} />
        <Stat label="Longest" value={`${streak.longest}`} />
      </View>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText variant="heading">{value}</ThemedText>
      <ThemedText variant="caption" color="textTertiary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16, alignItems: "center" },
  main: { alignItems: "center", gap: 2, paddingVertical: 8 },
  divider: { height: StyleSheet.hairlineWidth, alignSelf: "stretch", marginVertical: 16 },
  stats: { flexDirection: "row", justifyContent: "space-around", alignSelf: "stretch" },
  stat: { alignItems: "center", gap: 2 },
});
