import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaEntry } from "@/features/duas/dua.types";
import { DuaCatalog } from "@/features/duas/DuaCatalog";

interface DuaListRowProps {
  dua: DuaEntry;
  saved?: boolean;
  favorite?: boolean;
  onPress: () => void;
  onToggleSave?: () => void;
  onToggleFavorite?: () => void;
}

/** Compact dua row for library lists. */
export function DuaListRow({
  dua,
  saved,
  favorite,
  onPress,
  onToggleSave,
  onToggleFavorite,
}: DuaListRowProps) {
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
      <View style={styles.body}>
        <ThemedText variant="caption" color="textTertiary">
          {DuaCatalog.categoryLabel(dua.categoryId)}
        </ThemedText>
        <ThemedText variant="bodyStrong">{dua.title}</ThemedText>
        <ThemedText variant="caption" color="textSecondary" numberOfLines={2}>
          {dua.translation}
        </ThemedText>
      </View>
      <View style={styles.actions}>
        {onToggleFavorite ? (
          <Pressable
            hitSlop={10}
            onPress={() => {
              haptics.selection();
              onToggleFavorite();
            }}
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={20}
              color={favorite ? theme.colors.danger : theme.colors.textTertiary}
            />
          </Pressable>
        ) : null}
        {onToggleSave ? (
          <Pressable
            hitSlop={10}
            onPress={() => {
              haptics.selection();
              onToggleSave();
            }}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={saved ? theme.colors.accent : theme.colors.textTertiary}
            />
          </Pressable>
        ) : null}
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  body: { flex: 1, gap: 3 },
  actions: { flexDirection: "row", alignItems: "center", gap: 12 },
});
