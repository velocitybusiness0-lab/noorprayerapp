import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { StreakSummary } from "@/features/history/history.types";

interface StreakSummaryCardProps {
  streak: StreakSummary;
  totalNamaz: number;
}

/** Hero stats: current streak, longest streak, and lifetime namaz count. */
export function StreakSummaryCard({ streak, totalNamaz }: StreakSummaryCardProps) {
  const theme = useTheme();
  const heroBg = theme.isDark ? "rgba(240, 188, 104, 0.12)" : "transparent";

  return (
    <Card style={styles.card}>
      <View style={[styles.main, { backgroundColor: heroBg, borderRadius: theme.radii.md }]}>
        <Ionicons name="flame" size={34} color={theme.colors.warmGlow} />
        <ThemedText variant="display" color="textPrimary">
          {streak.current}
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary" style={styles.streakLabel}>
          DAY STREAK
        </ThemedText>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.colors.hairline }]} />
      <View style={styles.stats}>
        <Stat label="Namaz" value={totalNamaz.toLocaleString()} />
        <Stat label="Longest" value={`${streak.longest}`} />
      </View>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText variant="heading" color="textPrimary">
        {value}
      </ThemedText>
      <ThemedText variant="caption" color="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16, alignItems: "center" },
  main: { alignItems: "center", gap: 2, paddingVertical: 12, paddingHorizontal: 24 },
  streakLabel: { letterSpacing: 1.1, marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, alignSelf: "stretch", marginVertical: 16 },
  stats: { flexDirection: "row", justifyContent: "space-around", alignSelf: "stretch" },
  stat: { alignItems: "center", gap: 2 },
});
