import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import {
  SALAH_MODE_ICON,
  SALAH_MODE_LABELS,
  SalahMode,
} from "@/features/modes/mode.types";

interface SalahModeCheckboxRowProps {
  mode: SalahMode;
  checked: boolean;
  onToggle: () => void;
  last?: boolean;
}

/** Checkbox row for a single prayer-time behaviour mode. */
export function SalahModeCheckboxRow({
  mode,
  checked,
  onToggle,
  last = false,
}: SalahModeCheckboxRowProps) {
  const theme = useTheme();
  const icon = SALAH_MODE_ICON[mode] as keyof typeof Ionicons.glyphMap;

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onToggle();
      }}
      style={[
        styles.row,
        !last && { borderBottomColor: theme.colors.hairline, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <Ionicons
        name={checked ? "checkbox" : "square-outline"}
        size={24}
        color={checked ? theme.colors.accent : theme.colors.textTertiary}
      />
      <View style={styles.titleRow}>
        <Ionicons name={icon} size={18} color={theme.colors.accent} />
        <ThemedText variant="bodyStrong">{SALAH_MODE_LABELS[mode]}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  titleRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
});
