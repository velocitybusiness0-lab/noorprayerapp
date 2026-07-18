import { DuaCatalog } from "./DuaCatalog";
import { DuaCustomListIconCatalog } from "./DuaCustomListIconCatalog";
import { DuaDefaultCollections } from "./DuaDefaultCollections";
import { DuaCollection, DuaEntry } from "./dua.types";
import { useDuaLibrary } from "./duaLibraryStore";

/** Resolves saved / favourite dua entries and list mutation helpers. */
export class DuaLibraryManager {
  static savedEntries(): DuaEntry[] {
    const { savedIds } = useDuaLibrary.getState();
    return savedIds
      .map((id) => DuaCatalog.byId(id))
      .filter((dua): dua is DuaEntry => dua !== null);
  }

  static favoriteEntries(): DuaEntry[] {
    const { favoriteIds } = useDuaLibrary.getState();
    return favoriteIds
      .map((id) => DuaCatalog.byId(id))
      .filter((dua): dua is DuaEntry => dua !== null);
  }

  static entriesForIds(ids: string[]): DuaEntry[] {
    return ids
      .map((id) => DuaCatalog.byId(id))
      .filter((dua): dua is DuaEntry => dua !== null);
  }

  /** Creates a list with a distinct custom icon and optional dua ids. */
  static createList(name: string, duaIds: string[] = []): DuaCollection {
    const existingIcons = useDuaLibrary
      .getState()
      .collections.filter((collection) => !DuaDefaultCollections.isStarter(collection.id))
      .map((collection) => collection.icon);
    const style = DuaCustomListIconCatalog.pickNext(existingIcons);
    return useDuaLibrary.getState().createCollection({
      name,
      duaIds,
      emoji: "📿",
      icon: style.icon,
    });
  }

  static renameList(collectionId: string, name: string): void {
    useDuaLibrary.getState().renameCollection(collectionId, name);
  }

  static deleteList(collectionId: string): void {
    useDuaLibrary.getState().deleteCollection(collectionId);
  }

  static addDuasToList(collectionId: string, duaIds: string[]): void {
    useDuaLibrary.getState().addDuasToCollection(collectionId, duaIds);
  }

  static setListDuas(collectionId: string, duaIds: string[]): void {
    useDuaLibrary.getState().setCollectionDuas(collectionId, duaIds);
  }
}
