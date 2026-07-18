import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaSectionHeader } from "@/components/duas/DuaSectionHeader";
import { DuaSavedCard } from "@/components/duas/DuaSavedCard";
import { DuaCategoryBrowseGrid } from "@/components/duas/DuaCategoryBrowseGrid";
import { DuaSuggestedFeaturedCard } from "@/components/duas/DuaSuggestedFeaturedCard";
import { DuaListRowTile } from "@/components/duas/DuaListRowTile";
import { haptics } from "@/core/haptics/HapticsManager";
import { DuaBrowseCategoryStyle } from "@/features/duas/catalog/DuaBrowseCategories";
import { DuaCategoryId, DuaCollection, DuaEntry } from "@/features/duas/dua.types";

export const SAVED_PREVIEW_COUNT = 3;

interface DuaLibraryContentProps {
  lists: DuaCollection[];
  saved: DuaEntry[];
  savedTotal: number;
  favoriteIds: string[];
  savedExpanded: boolean;
  browseCategories: DuaBrowseCategoryStyle[];
  suggestedPreview: DuaEntry[];
  featured: DuaEntry | null;
  suggestedExpanded: boolean;
  suggestedTotal: number;
  savedIds: string[];
  onExpandSaved: () => void;
  onExpandSuggested: () => void;
  onOpenDua: (id: string) => void;
  onOpenList: (id: string) => void;
  onLongPressList?: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUnsave: (id: string) => void;
  onBrowseCategory: (id: DuaCategoryId) => void;
  onToggleSave: (id: string) => void;
}

/** Single-scroll My Duas body: lists, saved, categories, suggested. */
export function DuaLibraryContent({
  lists,
  saved,
  savedTotal,
  favoriteIds,
  savedExpanded,
  browseCategories,
  suggestedPreview,
  featured,
  suggestedExpanded,
  suggestedTotal,
  savedIds,
  onExpandSaved,
  onExpandSuggested,
  onOpenDua,
  onOpenList,
  onLongPressList,
  onToggleFavorite,
  onUnsave,
  onBrowseCategory,
  onToggleSave,
}: DuaLibraryContentProps) {
  const canExpandSaved = !savedExpanded && savedTotal > SAVED_PREVIEW_COUNT;
  const canExpandSuggested = !suggestedExpanded && suggestedTotal > suggestedPreview.length;
  const listItems = featured
    ? suggestedPreview.filter((dua) => dua.id !== featured.id)
    : suggestedPreview;
  const hasSavedAreaContent = lists.length > 0 || saved.length > 0;

  return (
    <View>
      {canExpandSaved ? (
        <View style={styles.topAction}>
          <AllLink label={`All (${savedTotal})`} onPress={onExpandSaved} />
        </View>
      ) : null}

      {lists.map((collection) => (
        <DuaListRowTile
          key={collection.id}
          collection={collection}
          onPress={() => onOpenList(collection.id)}
          onLongPress={
            onLongPressList ? () => onLongPressList(collection.id) : undefined
          }
        />
      ))}

      {saved.map((dua) => (
        <DuaSavedCard
          key={dua.id}
          dua={dua}
          favorite={favoriteIds.includes(dua.id)}
          onPress={() => onOpenDua(dua.id)}
          onToggleFavorite={() => onToggleFavorite(dua.id)}
          onUnsave={() => onUnsave(dua.id)}
        />
      ))}

      {!hasSavedAreaContent ? (
        <ThemedText variant="body" color="textSecondary" style={styles.empty}>
          Nothing saved yet.
        </ThemedText>
      ) : null}

      <View style={styles.sectionGap}>
        <DuaSectionHeader title="Categories" />
        <DuaCategoryBrowseGrid
          categories={browseCategories}
          onSelect={onBrowseCategory}
        />
      </View>

      {suggestedPreview.length > 0 ? (
        <View style={styles.sectionGap}>
          {canExpandSuggested ? (
            <View style={styles.topAction}>
              <AllLink label="All" onPress={onExpandSuggested} />
            </View>
          ) : null}

          {featured ? (
            <View style={styles.featuredPad}>
              <DuaSuggestedFeaturedCard
                dua={featured}
                saved={savedIds.includes(featured.id)}
                onPress={() => onOpenDua(featured.id)}
                onToggleSave={() => onToggleSave(featured.id)}
              />
            </View>
          ) : null}

          {listItems.map((dua) => (
            <DuaSavedCard
              key={dua.id}
              dua={dua}
              favorite={favoriteIds.includes(dua.id)}
              onPress={() => onOpenDua(dua.id)}
              onToggleFavorite={() => onToggleFavorite(dua.id)}
              onUnsave={
                savedIds.includes(dua.id) ? () => onToggleSave(dua.id) : undefined
              }
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function AllLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      hitSlop={8}
    >
      <ThemedText variant="caption" color="accent">
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionGap: { marginTop: 28 },
  empty: { marginBottom: 8, marginTop: 4 },
  topAction: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  featuredPad: { marginBottom: 16 },
});
