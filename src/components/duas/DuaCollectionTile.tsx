import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaCollectionIconBadge } from "@/components/duas/DuaCollectionIconBadge";
import { DuaCollection } from "@/features/duas/dua.types";

interface DuaCollectionTileProps {
  collection: DuaCollection;
  onPress: () => void;
}

/** Collection tile for the library Collections tab. */
export function DuaCollectionTile({ collection, onPress }: DuaCollectionTileProps) {
  const theme = useTheme();
  const count = collection.duaIds.length;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tile,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.hairline,
          borderRadius: theme.radii.md,
        },
      ]}
    >
      <DuaCollectionIconBadge collection={collection} size={40} />
      <View style={styles.copy}>
        <ThemedText variant="bodyStrong">{collection.name}</ThemedText>
        <ThemedText variant="caption" color="textTertiary">
          {count === 0 ? "Empty" : `${count} dua${count === 1 ? "" : "s"}`}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  copy: { flex: 1, gap: 2 },
});
