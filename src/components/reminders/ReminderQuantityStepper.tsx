import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

interface ReminderQuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

/** Compact +/- control for how many reminders to send per day (spread over When). */
export function ReminderQuantityStepper({
  value,
  min = 1,
  max = 12,
  onChange,
}: ReminderQuantityStepperProps) {
  const theme = useTheme();

  const bump = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next === value) return;
    haptics.selection();
    onChange(next);
  };

  return (
    <View style={styles.controls}>
      <Pressable
        onPress={() => bump(-1)}
        style={[
          styles.btn,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.background,
            borderRadius: theme.radii.sm,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Decrease amount per day"
      >
        <Ionicons name="remove" size={18} color={theme.colors.textPrimary} />
      </Pressable>
      <ThemedText variant="bodyStrong" style={styles.value}>
        {value}
      </ThemedText>
      <Pressable
        onPress={() => bump(1)}
        style={[
          styles.btn,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.background,
            borderRadius: theme.radii.sm,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Increase amount per day"
      >
        <Ionicons name="add" size={18} color={theme.colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  btn: {
    width: 36,
    height: 36,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  value: { minWidth: 22, textAlign: "center" },
});
