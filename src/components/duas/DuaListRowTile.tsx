import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaCollectionIconBadge } from "@/components/duas/DuaCollectionIconBadge";
import { DuaCollection } from "@/features/duas/dua.types";

interface DuaListRowTileProps {
  collection: DuaCollection;
  onPress: () => void;
  onLongPress?: () => void;
}

/** Compact list row with a distinct custom-list icon badge. */
export function DuaListRowTile({
  collection,
  onPress,
  onLongPress,
}: DuaListRowTileProps) {
  const theme = useTheme();
  const count = collection.duaIds.length;

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      onLongPress={onLongPress}
      delayLongPress={450}
      style={[
        styles.row,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          shadowColor: theme.colors.textPrimary,
          overflow: "visible",
        },
      ]}
    >
      <DuaCollectionIconBadge collection={collection} size={44} />
      <View style={styles.copy}>
        <ThemedText variant="bodyStrong" numberOfLines={1}>
          {collection.name}
        </ThemedText>
        <ThemedText variant="caption" color="textTertiary">
          {count === 0 ? "Empty" : `${count} dua${count === 1 ? "" : "s"}`}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  copy: { flex: 1, gap: 2 },
});
