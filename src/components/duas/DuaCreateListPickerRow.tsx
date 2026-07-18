import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

interface DuaCreateListPickerRowProps {
  title: string;
  selected: boolean;
  onToggle: () => void;
}

/** Checklist row — short dua title + checkbox. */
export function DuaCreateListPickerRow({
  title,
  selected,
  onToggle,
}: DuaCreateListPickerRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onToggle();
      }}
      style={[styles.row, { borderBottomColor: theme.colors.hairline }]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <Ionicons
        name={selected ? "checkbox" : "square-outline"}
        size={22}
        color={selected ? theme.colors.accent : theme.colors.textTertiary}
      />
      <ThemedText variant="body" numberOfLines={1} style={styles.title}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { flex: 1 },
});
