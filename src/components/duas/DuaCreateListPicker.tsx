import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaCatalog } from "@/features/duas/DuaCatalog";
import { DuaCreateListPickerRow } from "./DuaCreateListPickerRow";

interface DuaCreateListPickerProps {
  selectedIds: string[];
  onChangeSelectedIds: (ids: string[]) => void;
}

/** Searchable multi-select checklist of catalog duas (short titles). */
export function DuaCreateListPicker({
  selectedIds,
  onChangeSelectedIds,
}: DuaCreateListPickerProps) {
  const theme = useTheme();
  const [query, setQuery] = useState("");

  const entries = useMemo(() => DuaCatalog.search(query), [query]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggleId = (id: string) => {
    if (selectedSet.has(id)) {
      onChangeSelectedIds(selectedIds.filter((item) => item !== id));
      return;
    }
    onChangeSelectedIds([...selectedIds, id]);
  };

  return (
    <View style={styles.root}>
      <ThemedText variant="caption" color="textSecondary">
        Add duas
      </ThemedText>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search"
        placeholderTextColor={theme.colors.textTertiary}
        style={[
          styles.search,
          {
            color: theme.colors.textPrimary,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.background,
            borderRadius: theme.radii.md,
          },
        ]}
      />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        style={styles.list}
        nestedScrollEnabled
        renderItem={({ item }) => (
          <DuaCreateListPickerRow
            title={item.title}
            selected={selectedSet.has(item.id)}
            onToggle={() => toggleId(item.id)}
          />
        )}
        ListEmptyComponent={
          <ThemedText variant="caption" color="textTertiary" style={styles.empty}>
            No matches
          </ThemedText>
        }
      />
      {selectedIds.length > 0 ? (
        <ThemedText variant="caption" color="textSecondary">
          {selectedIds.length} selected
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 8, maxHeight: 220 },
  search: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  list: { flexGrow: 0 },
  empty: { paddingVertical: 12 },
});
