import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

interface SelectableRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  last?: boolean;
}

/** A tappable option row with a trailing check when selected. */
export function SelectableRow({ label, selected, onPress, last }: SelectableRowProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={[
        styles.row,
        !last && { borderBottomColor: theme.colors.hairline, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <ThemedText variant="body" color={selected ? "textPrimary" : "textSecondary"}>
        {label}
      </ThemedText>
      {selected && (
        <Ionicons name="checkmark" size={18} color={theme.colors.textPrimary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
});
