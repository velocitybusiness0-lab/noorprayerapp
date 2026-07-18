import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";

interface DuaSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  filterActive?: boolean;
}

/** Pill search field with magnifier and filter affordance. */
export function DuaSearchBar({
  value,
  onChangeText,
  onFilterPress,
  filterActive,
}: DuaSearchBarProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.hairline,
          borderRadius: theme.radii.pill,
        },
      ]}
    >
      <Ionicons name="search" size={18} color={theme.colors.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search duas…"
        placeholderTextColor={theme.colors.textTertiary}
        style={[styles.input, { color: theme.colors.textPrimary }]}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {onFilterPress ? (
        <Pressable
          onPress={() => {
            haptics.selection();
            onFilterPress();
          }}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Filter categories"
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={filterActive ? theme.colors.accent : theme.colors.textTertiary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
});
