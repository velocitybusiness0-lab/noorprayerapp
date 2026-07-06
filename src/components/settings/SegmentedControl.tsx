import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Pastel segmented control for small, mutually-exclusive choices. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.track,
        { backgroundColor: theme.colors.backgroundElevated, borderRadius: theme.radii.md },
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              haptics.selection();
              onChange(option.value);
            }}
            style={[
              styles.segment,
              { borderRadius: theme.radii.sm },
              selected && { backgroundColor: theme.colors.accent },
            ]}
          >
            <ThemedText
              variant="caption"
              color={selected ? "onAccent" : "textSecondary"}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
  },
});
