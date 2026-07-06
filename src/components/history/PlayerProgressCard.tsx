import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { RankUpGoalsList } from "@/components/history/RankUpGoalsList";
import { PlayerProgress } from "@/features/gamification/gamification.types";

interface PlayerProgressCardProps {
  progress: PlayerProgress;
}

/** Level, XP bar, and rank goals. */
export function PlayerProgressCard({ progress }: PlayerProgressCardProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.levelBlock}>
        <ThemedText variant="caption" color="textTertiary">
          LEVEL {progress.level}
        </ThemedText>
        <ThemedText variant="heading">{progress.levelTitle}</ThemedText>
      </View>

      <View style={[styles.xpTrack, { backgroundColor: theme.colors.backgroundElevated }]}>
        <View
          style={[
            styles.xpFill,
            {
              width: `${Math.round(progress.progressRatio * 100)}%`,
              backgroundColor: theme.colors.accent,
            },
          ]}
        />
      </View>
      <ThemedText variant="caption" color="textTertiary" style={styles.xpLabel} numberOfLines={1}>
        {`${progress.xp.toLocaleString()} XP`}
      </ThemedText>

      <RankUpGoalsList goals={progress.rankGoals} nextRankTitle={progress.nextRankTitle} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16 },
  levelBlock: { alignItems: "flex-start", gap: 4, marginBottom: 8 },
  xpTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  xpFill: { height: "100%", borderRadius: 999 },
  xpLabel: { marginTop: 6, marginBottom: 14 },
});
