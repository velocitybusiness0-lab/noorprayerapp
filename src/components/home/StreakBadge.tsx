import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";

interface StreakBadgeProps {
  count: number;
}

/** Compact flame + streak-count pill shown top-right of the home header. */
export function StreakBadge({ count }: StreakBadgeProps) {
  const theme = useTheme();
  const streakBg = theme.isDark ? "rgba(240, 188, 104, 0.24)" : theme.colors.sageMuted;
  const streakBorder = theme.isDark ? "rgba(240, 188, 104, 0.42)" : theme.colors.border;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: streakBg,
          borderColor: streakBorder,
          borderRadius: theme.radii.pill,
        },
      ]}
    >
      <Ionicons name="flame" size={16} color={theme.colors.warmGlow} />
      <ThemedText variant="bodyStrong" color="textPrimary">
        {count}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
