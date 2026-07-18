import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

interface DuaSectionHeaderProps {
  title: string;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

/** Section title with optional bookmark badge, count, and trailing link. */
export function DuaSectionHeader({
  title,
  count,
  actionLabel,
  onAction,
  icon,
}: DuaSectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {icon ? (
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.sageMuted }]}>
            <Ionicons name={icon} size={14} color={theme.colors.accent} />
          </View>
        ) : null}
        <ThemedText variant="heading">{title}</ThemedText>
        {typeof count === "number" ? (
          <View style={[styles.badge, { backgroundColor: theme.colors.backgroundElevated }]}>
            <ThemedText variant="caption" color="textSecondary">
              {count}
            </ThemedText>
          </View>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={() => {
            haptics.selection();
            onAction();
          }}
          hitSlop={8}
        >
          <ThemedText variant="caption" color="accent">
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1 },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
});
