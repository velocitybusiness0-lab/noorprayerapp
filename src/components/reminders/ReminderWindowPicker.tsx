import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { MotivationWindowPreset } from "@/features/motivation/motivation.types";
import { MotivationWindowPresetCatalog } from "@/features/motivation/MotivationWindowPresetCatalog";
import { ReminderWindowPresetPalette } from "@/features/motivation/ReminderWindowPresetPalette";

interface ReminderWindowPickerProps {
  selected: MotivationWindowPreset[];
  onToggle: (preset: MotivationWindowPreset) => void;
}

/**
 * Multi-select Morning / Afternoon / Night chips for delivery windows.
 * At least one stays selected (enforced by MotivationPrefsManager).
 */
export function ReminderWindowPicker({ selected, onToggle }: ReminderWindowPickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {MotivationWindowPresetCatalog.all.map((option) => {
        const isSelected = selected.includes(option);
        const tint = ReminderWindowPresetPalette.tintFor(theme.colors, option);
        return (
          <Pressable
            key={option}
            onPress={() => {
              haptics.selection();
              onToggle(option);
            }}
            style={[
              styles.chip,
              {
                borderRadius: theme.radii.md,
                backgroundColor: tint.fill,
                borderColor: isSelected ? tint.selectedBorder : tint.border,
                borderWidth: isSelected ? 2 : StyleSheet.hairlineWidth,
                opacity: isSelected ? 1 : 0.72,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={MotivationWindowPresetCatalog.labelFor(option)}
          >
            <ThemedText
              variant={isSelected ? "bodyStrong" : "caption"}
              color="textPrimary"
              style={styles.label}
            >
              {MotivationWindowPresetCatalog.labelFor(option)}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    gap: 10,
  },
  chip: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  label: {
    textAlign: "center",
  },
});
