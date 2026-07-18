import React from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaEntry } from "@/features/duas/dua.types";

interface DuaCreateListDuaPickerProps {
  duas: DuaEntry[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

/** Minimal searchable multi-select checklist of duas for list creation. */
export function DuaCreateListDuaPicker({
  duas,
  selectedIds,
  onToggle,
}: DuaCreateListDuaPickerProps) {
  const theme = useTheme();

  return (
    <FlatList
      data={duas}
      keyExtractor={(item) => item.id}
      style={styles.list}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <ThemedText variant="caption" color="textTertiary" style={styles.empty}>
          No matches.
        </ThemedText>
      }
      renderItem={({ item }) => {
        const selected = selectedIds.includes(item.id);
        return (
          <Pressable
            onPress={() => {
              haptics.selection();
              onToggle(item.id);
            }}
            style={styles.row}
          >
            <Ionicons
              name={selected ? "checkbox" : "square-outline"}
              size={22}
              color={selected ? theme.colors.accent : theme.colors.textTertiary}
            />
            <View style={styles.copy}>
              <ThemedText variant="body" numberOfLines={1}>
                {item.title}
              </ThemedText>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { maxHeight: 220, marginTop: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  copy: { flex: 1 },
  empty: { paddingVertical: 12 },
});
