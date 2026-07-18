import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { MotivationCategories } from "@/features/motivation/MotivationCategories";
import { MotivationCategoryId } from "@/features/motivation/motivation.types";

interface ReminderCategoryChipsProps {
  enabled: MotivationCategoryId[];
  onToggle: (id: MotivationCategoryId) => void;
}

/** Multi-select chips for reminder / motivation types. */
export function ReminderCategoryChips({ enabled, onToggle }: ReminderCategoryChipsProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      {MotivationCategories.all().map((category) => {
        const selected = enabled.includes(category.id);
        return (
          <Pressable
            key={category.id}
            onPress={() => {
              haptics.selection();
              onToggle(category.id);
            }}
            style={[
              styles.chip,
              {
                borderRadius: theme.radii.md,
                borderColor: selected ? theme.colors.accent : theme.colors.border,
                backgroundColor: selected ? theme.colors.sageMuted : theme.colors.background,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <ThemedText
              variant="caption"
              color={selected ? "textPrimary" : "textSecondary"}
            >
              {category.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
