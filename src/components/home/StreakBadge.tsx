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
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.colors.sageMuted,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.pill,
        },
      ]}
    >
      <Ionicons name="flame" size={16} color={theme.colors.warmGlow} />
      <ThemedText variant="bodyStrong">{count}</ThemedText>
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
