import { DUA_CATEGORIES } from "./catalog/DuaCategories";
import { SUGGESTED_DUAS } from "./catalog/SuggestedDuas";
import { DuaCategory, DuaCategoryId, DuaEntry } from "./dua.types";

/** Read-only access to curated duas and categories. */
export class DuaCatalog {
  static all(): DuaEntry[] {
    return SUGGESTED_DUAS;
  }

  static categories(): DuaCategory[] {
    return DUA_CATEGORIES;
  }

  static byId(id: string): DuaEntry | null {
    return SUGGESTED_DUAS.find((dua) => dua.id === id) ?? null;
  }

  static byCategory(categoryId: DuaCategoryId | null): DuaEntry[] {
    if (!categoryId) return SUGGESTED_DUAS;
    return SUGGESTED_DUAS.filter((dua) => dua.categoryId === categoryId);
  }

  static search(query: string, categoryId: DuaCategoryId | null = null): DuaEntry[] {
    const needle = query.trim().toLowerCase();
    const pool = this.byCategory(categoryId);
    if (!needle) return pool;
    return pool.filter(
      (dua) =>
        dua.title.toLowerCase().includes(needle) ||
        dua.translation.toLowerCase().includes(needle) ||
        dua.transliteration.toLowerCase().includes(needle) ||
        dua.source.toLowerCase().includes(needle)
    );
  }

  static categoryLabel(categoryId: DuaCategoryId): string {
    return DUA_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
  }
}
