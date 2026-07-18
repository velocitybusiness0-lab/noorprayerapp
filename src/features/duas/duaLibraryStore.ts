import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { DuaCollection, DuaLibrarySnapshot } from "./dua.types";
import { DuaCustomListIconCatalog } from "./DuaCustomListIconCatalog";
import { DuaDefaultCollections } from "./DuaDefaultCollections";

export interface CreateDuaCollectionInput {
  name: string;
  duaIds?: string[];
  emoji?: string;
  icon?: string;
}

interface DuaLibraryState extends DuaLibrarySnapshot {
  toggleSaved: (duaId: string) => void;
  toggleFavorite: (duaId: string) => void;
  toggleReminder: (duaId: string) => void;
  addToCollection: (collectionId: string, duaId: string) => void;
  addDuasToCollection: (collectionId: string, duaIds: string[]) => void;
  setCollectionDuas: (collectionId: string, duaIds: string[]) => void;
  removeFromCollection: (collectionId: string, duaId: string) => void;
  createCollection: (input: CreateDuaCollectionInput) => DuaCollection;
  renameCollection: (collectionId: string, name: string) => void;
  deleteCollection: (collectionId: string) => void;
  isSaved: (duaId: string) => boolean;
  isFavorite: (duaId: string) => boolean;
  hasReminder: (duaId: string) => boolean;
}

/** Ensures older user lists get a custom icon without rewriting starters. */
function normalizeCollections(collections: DuaCollection[]): DuaCollection[] {
  const assigned: string[] = [];
  let changed = false;

  const next = collections.map((collection) => {
    if (DuaDefaultCollections.isStarter(collection.id)) return collection;
    if (collection.icon) {
      assigned.push(collection.icon);
      return collection;
    }
    const style = DuaCustomListIconCatalog.pickNext(assigned);
    assigned.push(style.icon);
    changed = true;
    return { ...collection, icon: style.icon };
  });

  return changed ? next : collections;
}

function persist(state: DuaLibrarySnapshot): void {
  storage.setObject(StorageKeys.duaLibrary, {
    savedIds: state.savedIds,
    favoriteIds: state.favoriteIds,
    reminderIds: state.reminderIds,
    collections: state.collections,
  });
}

function loadSnapshot(): DuaLibrarySnapshot {
  const stored = storage.getObject<DuaLibrarySnapshot>(StorageKeys.duaLibrary);
  if (stored) {
    const hadCollections = (stored.collections?.length ?? 0) > 0;
    const collections = hadCollections
      ? normalizeCollections(stored.collections)
      : DuaDefaultCollections.create();
    const snapshot = {
      savedIds: stored.savedIds ?? [],
      favoriteIds: stored.favoriteIds ?? [],
      reminderIds: stored.reminderIds ?? [],
      collections,
    };
    if (hadCollections && collections !== stored.collections) {
      persist(snapshot);
    }
    return snapshot;
  }
  return {
    savedIds: [],
    favoriteIds: [],
    reminderIds: [],
    collections: DuaDefaultCollections.create(),
  };
}

function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

/** Persisted personal dua library — saved, favourites, reminders, collections. */
export const useDuaLibrary = create<DuaLibraryState>((set, get) => ({
  ...loadSnapshot(),

  isSaved: (duaId) => get().savedIds.includes(duaId),
  isFavorite: (duaId) => get().favoriteIds.includes(duaId),
  hasReminder: (duaId) => get().reminderIds.includes(duaId),

  toggleSaved: (duaId) => {
    set((state) => {
      const savedIds = toggleId(state.savedIds, duaId);
      const favoriteIds = savedIds.includes(duaId)
        ? state.favoriteIds
        : state.favoriteIds.filter((id) => id !== duaId);
      const reminderIds = savedIds.includes(duaId)
        ? state.reminderIds
        : state.reminderIds.filter((id) => id !== duaId);
      const next = { ...state, savedIds, favoriteIds, reminderIds };
      persist(next);
      return next;
    });
  },

  toggleFavorite: (duaId) => {
    set((state) => {
      let savedIds = state.savedIds;
      if (!savedIds.includes(duaId)) savedIds = [...savedIds, duaId];
      const favoriteIds = toggleId(state.favoriteIds, duaId);
      const next = { ...state, savedIds, favoriteIds };
      persist(next);
      return next;
    });
  },

  toggleReminder: (duaId) => {
    set((state) => {
      let savedIds = state.savedIds;
      if (!savedIds.includes(duaId)) savedIds = [...savedIds, duaId];
      const reminderIds = toggleId(state.reminderIds, duaId);
      const next = { ...state, savedIds, reminderIds };
      persist(next);
      return next;
    });
  },

  addToCollection: (collectionId, duaId) => {
    get().addDuasToCollection(collectionId, [duaId]);
  },

  addDuasToCollection: (collectionId, duaIds) => {
    const uniqueIncoming = [...new Set(duaIds.filter(Boolean))];
    if (uniqueIncoming.length === 0) return;

    set((state) => {
      const collections = state.collections.map((collection) => {
        if (collection.id !== collectionId) return collection;
        const merged = [...collection.duaIds];
        for (const duaId of uniqueIncoming) {
          if (!merged.includes(duaId)) merged.push(duaId);
        }
        return { ...collection, duaIds: merged };
      });
      const savedIds = uniqueIncoming.reduce(
        (ids, duaId) => (ids.includes(duaId) ? ids : [...ids, duaId]),
        state.savedIds
      );
      const next = { ...state, savedIds, collections };
      persist(next);
      return next;
    });
  },

  setCollectionDuas: (collectionId, duaIds) => {
    const uniqueIds = [...new Set(duaIds.filter(Boolean))];

    set((state) => {
      const collections = state.collections.map((collection) =>
        collection.id === collectionId
          ? { ...collection, duaIds: uniqueIds }
          : collection
      );
      const savedIds = uniqueIds.reduce(
        (ids, duaId) => (ids.includes(duaId) ? ids : [...ids, duaId]),
        state.savedIds
      );
      const next = { ...state, savedIds, collections };
      persist(next);
      return next;
    });
  },

  removeFromCollection: (collectionId, duaId) => {
    set((state) => {
      const collections = state.collections.map((collection) =>
        collection.id === collectionId
          ? { ...collection, duaIds: collection.duaIds.filter((id) => id !== duaId) }
          : collection
      );
      const next = { ...state, collections };
      persist(next);
      return next;
    });
  },

  createCollection: (input) => {
    const uniqueDuaIds = [...new Set((input.duaIds ?? []).filter(Boolean))];
    const collection: DuaCollection = {
      id: `col-${Date.now()}`,
      name: input.name.trim() || "New collection",
      emoji: input.emoji || "📿",
      icon: input.icon,
      duaIds: uniqueDuaIds,
      createdAt: Date.now(),
    };
    set((state) => {
      const savedIds = uniqueDuaIds.reduce(
        (ids, duaId) => (ids.includes(duaId) ? ids : [...ids, duaId]),
        state.savedIds
      );
      const next = {
        ...state,
        savedIds,
        collections: [...state.collections, collection],
      };
      persist(next);
      return next;
    });
    return collection;
  },

  renameCollection: (collectionId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    set((state) => {
      const collections = state.collections.map((collection) =>
        collection.id === collectionId ? { ...collection, name: trimmed } : collection
      );
      const next = { ...state, collections };
      persist(next);
      return next;
    });
  },

  deleteCollection: (collectionId) => {
    set((state) => {
      const next = {
        ...state,
        collections: state.collections.filter((collection) => collection.id !== collectionId),
      };
      persist(next);
      return next;
    });
  },
}));
