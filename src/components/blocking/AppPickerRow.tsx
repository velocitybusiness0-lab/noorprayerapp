import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";

interface AppPickerRowProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

/** Selectable app row for the blocking picker. */
export function AppPickerRow({ label, selected, onToggle }: AppPickerRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: selected ? theme.colors.sageMuted : theme.colors.surface,
          borderColor: selected ? theme.colors.accent : theme.colors.hairline,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: theme.colors.backgroundElevated }]}>
        <Ionicons name="apps-outline" size={16} color={theme.colors.accent} />
      </View>
      <ThemedText variant="body" style={styles.label}>
        {label}
      </ThemedText>
      <View
        style={[
          styles.check,
          {
            backgroundColor: selected ? theme.colors.accent : "transparent",
            borderColor: selected ? theme.colors.accent : theme.colors.textTertiary,
          },
        ]}
      >
        {selected ? (
          <Ionicons name="checkmark" size={14} color={theme.colors.onAccent} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { flex: 1 },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
