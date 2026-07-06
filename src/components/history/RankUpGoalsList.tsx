import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { RankGoal } from "@/features/gamification/gamification.types";

interface RankUpGoalsListProps {
  goals: RankGoal[];
  nextRankTitle?: string;
}

/** Checklist of activity targets needed to reach the next rank. */
export function RankUpGoalsList({ goals, nextRankTitle }: RankUpGoalsListProps) {
  const theme = useTheme();

  if (goals.length === 0) {
    return (
      <ThemedText variant="caption" color="textTertiary">
        Max rank reached — keep building your habit.
      </ThemedText>
    );
  }

  return (
    <View style={styles.wrap}>
      <ThemedText variant="caption" color="textTertiary">
        {nextRankTitle ? `Rank up to ${nextRankTitle}` : "Rank up goals"}
      </ThemedText>
      {goals.map((item) => {
        const ratio = item.target > 0 ? item.current / item.target : 1;
        const done = item.current >= item.target;

        return (
          <View key={item.id} style={styles.row}>
            <Ionicons
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={16}
              color={done ? theme.colors.accent : theme.colors.textTertiary}
            />
            <View style={styles.text}>
              <ThemedText variant="caption" color={done ? "accent" : "textSecondary"}>
                {`${item.current.toLocaleString()}/${item.target.toLocaleString()} ${item.label.toLowerCase()}`}
              </ThemedText>
              <View style={[styles.track, { backgroundColor: theme.colors.backgroundElevated }]}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${Math.round(Math.min(1, ratio) * 100)}%`,
                      backgroundColor: done ? theme.colors.accent : theme.colors.sageMuted,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  text: { flex: 1, gap: 4 },
  track: { height: 4, borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999 },
});
