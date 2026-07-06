import React from "react";
import { StyleSheet, Switch, View } from "react-native";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

/** Labelled switch row for boolean settings. */
export function ToggleRow({ label, description, value, onValueChange }: ToggleRowProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <ThemedText variant="body">{label}</ThemedText>
        {description && (
          <ThemedText variant="caption" color="textTertiary">
            {description}
          </ThemedText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={(next) => {
          haptics.selection();
          onValueChange(next);
        }}
        trackColor={{ true: theme.colors.accent, false: theme.colors.border }}
        thumbColor={theme.colors.background}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    gap: 12,
  },
  text: { flex: 1, gap: 2 },
});
