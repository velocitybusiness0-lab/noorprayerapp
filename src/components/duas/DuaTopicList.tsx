import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaCatalog } from "@/features/duas/DuaCatalog";
import { DuaCategory } from "@/features/duas/dua.types";

interface DuaTopicRowProps {
  category: DuaCategory;
  count: number;
  onPress: () => void;
}

/** One topic row on the simple My Duas home. */
export function DuaTopicRow({ category, count, onPress }: DuaTopicRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.hairline,
          borderRadius: theme.radii.md,
        },
      ]}
    >
      <View style={styles.copy}>
        <ThemedText variant="bodyStrong">{category.label}</ThemedText>
        <ThemedText variant="caption" color="textTertiary">
          {count} dua{count === 1 ? "" : "s"}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

/** Full topic list for browsing. */
export function DuaTopicList({
  onSelect,
}: {
  onSelect: (categoryId: DuaCategory["id"]) => void;
}) {
  return (
    <View>
      {DuaCatalog.categories().map((category) => (
        <DuaTopicRow
          key={category.id}
          category={category}
          count={DuaCatalog.byCategory(category.id).length}
          onPress={() => onSelect(category.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  copy: { flex: 1, gap: 2 },
});
