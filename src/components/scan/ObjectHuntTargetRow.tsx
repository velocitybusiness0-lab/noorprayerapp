import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ScanTarget } from "@/features/scan/scanTargets";

interface ObjectHuntTargetRowProps {
  target: ScanTarget;
  selected: boolean;
  onSelect: () => void;
  last?: boolean;
}

/** Single-select row for picking an object hunt target. */
export function ObjectHuntTargetRow({
  target,
  selected,
  onSelect,
  last = false,
}: ObjectHuntTargetRowProps) {
  const theme = useTheme();
  const icon = target.icon as keyof typeof Ionicons.glyphMap;

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onSelect();
      }}
      style={[
        styles.row,
        !last && {
          borderBottomColor: theme.colors.hairline,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <Ionicons
        name={selected ? "radio-button-on" : "radio-button-off"}
        size={22}
        color={selected ? theme.colors.accent : theme.colors.textTertiary}
      />
      <View style={styles.labelRow}>
        <Ionicons name={icon} size={18} color={theme.colors.accent} />
        <ThemedText variant="bodyStrong">{target.label}</ThemedText>
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
  labelRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
});
