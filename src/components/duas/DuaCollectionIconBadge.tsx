import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaCustomListIconCatalog } from "@/features/duas/DuaCustomListIconCatalog";
import { DuaDefaultCollections } from "@/features/duas/DuaDefaultCollections";
import { DuaUserListLetter } from "@/features/duas/DuaUserListLetter";
import { DuaCollection } from "@/features/duas/dua.types";

interface DuaCollectionIconBadgeProps {
  collection: DuaCollection;
  size?: number;
}

/**
 * Starter lists: emoji.
 * User lists: tinted circle (catalog palette) + glyph + letter — not sageMuted,
 * not category pastel tiles.
 */
export function DuaCollectionIconBadge({
  collection,
  size = 44,
}: DuaCollectionIconBadgeProps) {
  if (DuaDefaultCollections.isStarter(collection.id)) {
    return (
      <ThemedText
        variant="title"
        style={[styles.emoji, { fontSize: size * 0.64, lineHeight: size * 0.78 }]}
      >
        {collection.emoji}
      </ThemedText>
    );
  }

  const style = collection.icon
    ? DuaCustomListIconCatalog.resolve(collection.icon)
    : DuaCustomListIconCatalog.resolveForId(collection.id);
  const glyphSize = Math.round(size * 0.36);
  const letter = DuaUserListLetter.initial(collection.name);
  const letterSize = Math.round(size * 0.28);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: style.circleColor,
          },
        ]}
      >
        <Ionicons name={style.icon} size={glyphSize} color={style.glyphColor} />
      </View>
      <View
        style={[
          styles.letterBadge,
          {
            backgroundColor: style.glyphColor,
            minWidth: Math.round(size * 0.4),
            height: Math.round(size * 0.4),
            borderRadius: Math.round(size * 0.2),
          },
        ]}
      >
        <ThemedText
          variant="caption"
          style={[styles.letter, { fontSize: letterSize, lineHeight: letterSize + 1 }]}
        >
          {letter}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    overflow: "visible",
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  letterBadge: {
    position: "absolute",
    right: -3,
    bottom: -3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  letter: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
  emoji: { textAlign: "center" },
});
