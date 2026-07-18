import React from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaBrowseCategoryStyle } from "@/features/duas/catalog/DuaBrowseCategories";
import { DuaCategoryId } from "@/features/duas/dua.types";

const COLUMNS = 3;
const GAP = 8;
/** Horizontal inset matching Screen content padding (theme.spacing.lg). */
const SCREEN_INSET = 16;
const TILE_HEIGHT = 64;
const ICON_SIZE = 16;
const LABEL_SIZE = 11;

interface DuaCategoryBrowseGridProps {
  categories: DuaBrowseCategoryStyle[];
  onSelect: (id: DuaCategoryId) => void;
}

/** Compact 3-column pastel category grid. */
export function DuaCategoryBrowseGrid({
  categories,
  onSelect,
}: DuaCategoryBrowseGridProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const cardWidth = (width - SCREEN_INSET * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <View style={styles.grid}>
      {categories.map((category) => (
        <Pressable
          key={category.id}
          onPress={() => {
            haptics.selection();
            onSelect(category.id);
          }}
          style={[
            styles.card,
            {
              width: cardWidth,
              height: TILE_HEIGHT,
              backgroundColor: category.pastelBg,
              borderRadius: theme.radii.md,
            },
          ]}
        >
          <Ionicons
            name={category.icon as keyof typeof Ionicons.glyphMap}
            size={ICON_SIZE}
            color={category.iconColor}
          />
          <ThemedText
            variant="caption"
            style={[styles.label, { color: category.iconColor }]}
            numberOfLines={1}
          >
            {category.shortLabel}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  label: { fontWeight: "600", fontSize: LABEL_SIZE },
});
