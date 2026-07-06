import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { RewardProgress } from "@/features/gamification/gamification.types";

interface RewardCardProps {
  reward: RewardProgress;
}

/** Level, progress to next level, and unlockable badges. */
export function RewardCard({ reward }: RewardCardProps) {
  const theme = useTheme();
  const unlockedCount = reward.badges.filter((b) => b.unlocked).length;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <ThemedText variant="caption" color="textTertiary">
            LEVEL {reward.level}
          </ThemedText>
          <ThemedText variant="heading">{reward.levelTitle}</ThemedText>
        </View>
        <ThemedText variant="caption" color="textTertiary">
          {reward.toNextLevel > 0
            ? `${reward.toNextLevel} to next`
            : "Max level"}
        </ThemedText>
      </View>

      <View style={styles.badges}>
        {reward.badges.map((b) => (
          <View key={b.id} style={styles.badge}>
            <Ionicons
              name={b.icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color={b.unlocked ? theme.colors.accent : theme.colors.textTertiary}
              style={{ opacity: b.unlocked ? 1 : 0.4 }}
            />
            <ThemedText
              variant="caption"
              color={b.unlocked ? "textSecondary" : "textTertiary"}
            >
              {b.label}
            </ThemedText>
          </View>
        ))}
      </View>

      <ThemedText variant="caption" color="textTertiary" style={styles.footer}>
        {unlockedCount}/{reward.badges.length} badges earned
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  badge: { alignItems: "center", gap: 4, width: 68 },
  footer: { marginTop: 16, textAlign: "center" },
});
