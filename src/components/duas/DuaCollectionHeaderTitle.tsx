import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaCollectionIconBadge } from "@/components/duas/DuaCollectionIconBadge";
import { DuaCollection } from "@/features/duas/dua.types";

interface DuaCollectionHeaderTitleProps {
  collection: DuaCollection;
}

/** Nav title: custom badge for user lists, emoji+name for starters. */
export function DuaCollectionHeaderTitle({ collection }: DuaCollectionHeaderTitleProps) {
  return (
    <View style={styles.row}>
      <DuaCollectionIconBadge collection={collection} size={28} />
      <ThemedText variant="bodyStrong" numberOfLines={1} style={styles.name}>
        {collection.name}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: 220,
  },
  name: { flexShrink: 1 },
});
