import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/primitives/Screen";
import { DuaLibraryHeader } from "@/components/duas/DuaLibraryHeader";
import { DuaSearchBar } from "@/components/duas/DuaSearchBar";
import { DuaCreateListModal } from "@/components/duas/DuaCreateListModal";
import { DuaRenameListModal } from "@/components/duas/DuaRenameListModal";
import { DuaCategoryFilter } from "@/components/duas/DuaCategoryFilter";
import {
  DuaLibraryContent,
  SAVED_PREVIEW_COUNT,
} from "@/components/duas/DuaLibraryContent";
import { DuaLibraryPresenter } from "@/features/duas/DuaLibraryPresenter";
import { DuaLibraryManager } from "@/features/duas/DuaLibraryManager";
import { duaListActionsCoordinator } from "@/features/duas/DuaListActionsCoordinator";
import { useDuaLibrary } from "@/features/duas/duaLibraryStore";
import { DuaRoutes } from "@/features/duas/DuaRoutes";
import { DuaCategoryId, DuaCollection } from "@/features/duas/dua.types";
import { stackBackNavigator } from "@/features/navigation/StackBackNavigator";

/** Personal dua library — single scroll: lists, saved, categories, suggested. */
export default function DuasLibraryScreen() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<DuaCategoryId | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [savedExpanded, setSavedExpanded] = useState(false);
  const [suggestedExpanded, setSuggestedExpanded] = useState(false);
  const [createListOpen, setCreateListOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<DuaCollection | null>(null);

  const savedIds = useDuaLibrary((s) => s.savedIds);
  const favoriteIds = useDuaLibrary((s) => s.favoriteIds);
  const collections = useDuaLibrary((s) => s.collections);
  const toggleSaved = useDuaLibrary((s) => s.toggleSaved);
  const toggleFavorite = useDuaLibrary((s) => s.toggleFavorite);

  const lists = useMemo(
    () => DuaLibraryPresenter.filterUserLists(collections, query),
    [collections, query]
  );
  const saved = useMemo(
    () => DuaLibraryPresenter.filterSaved(query, savedIds),
    [savedIds, query]
  );
  const suggested = useMemo(
    () => DuaLibraryPresenter.filterSuggested(query, categoryId),
    [query, categoryId]
  );
  const featured = useMemo(
    () => DuaLibraryPresenter.featuredSuggestion(savedIds, suggested),
    [savedIds, suggested]
  );
  const suggestedPreview = useMemo(() => {
    if (suggestedExpanded) return suggested;
    return DuaLibraryPresenter.suggestedPreview(savedIds, suggested);
  }, [savedIds, suggested, suggestedExpanded]);
  const visibleSaved = savedExpanded ? saved : saved.slice(0, SAVED_PREVIEW_COUNT);

  const openDua = (id: string) => router.push(DuaRoutes.detail(id));
  const openList = (id: string) => router.push(DuaRoutes.collection(id));

  const openCategory = (id: DuaCategoryId) => {
    setCategoryId(id);
    setFilterOpen(true);
    setSuggestedExpanded(true);
  };

  const handleCreateList = (name: string, duaIds: string[]) => {
    DuaLibraryManager.createList(name, duaIds);
  };

  const handleLongPressList = (id: string) => {
    const collection = collections.find((item) => item.id === id);
    if (!collection) return;
    duaListActionsCoordinator.present(collection, {
      onRename: () => setRenameTarget(collection),
      onDelete: () => DuaLibraryManager.deleteList(collection.id),
    });
  };

  return (
    <Screen scroll tabBarPadding>
      <DuaLibraryHeader
        onBack={() => stackBackNavigator.goBack()}
        onNewList={() => setCreateListOpen(true)}
      />

      <DuaSearchBar
        value={query}
        onChangeText={setQuery}
        filterActive={filterOpen || categoryId !== null}
        onFilterPress={() => setFilterOpen((open) => !open)}
      />

      {filterOpen ? (
        <View style={styles.filterPad}>
          <DuaCategoryFilter selected={categoryId} onChange={setCategoryId} />
        </View>
      ) : null}

      <DuaLibraryContent
        lists={lists}
        saved={visibleSaved}
        savedTotal={saved.length}
        favoriteIds={favoriteIds}
        savedExpanded={savedExpanded}
        browseCategories={DuaLibraryPresenter.browseCategories()}
        suggestedPreview={suggestedPreview}
        featured={featured}
        suggestedExpanded={suggestedExpanded}
        suggestedTotal={suggested.length}
        savedIds={savedIds}
        onExpandSaved={() => setSavedExpanded(true)}
        onExpandSuggested={() => setSuggestedExpanded(true)}
        onOpenDua={openDua}
        onOpenList={openList}
        onLongPressList={handleLongPressList}
        onToggleFavorite={toggleFavorite}
        onUnsave={toggleSaved}
        onBrowseCategory={openCategory}
        onToggleSave={toggleSaved}
      />

      <DuaCreateListModal
        visible={createListOpen}
        onClose={() => setCreateListOpen(false)}
        onCreate={handleCreateList}
      />

      <DuaRenameListModal
        visible={renameTarget !== null}
        initialName={renameTarget?.name ?? ""}
        onClose={() => setRenameTarget(null)}
        onSave={(name) => {
          if (!renameTarget) return;
          DuaLibraryManager.renameList(renameTarget.id, name);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterPad: { marginBottom: 12 },
});
