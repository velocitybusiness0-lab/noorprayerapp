import { DuaCatalog } from "./DuaCatalog";
import { DUA_BROWSE_CATEGORIES } from "./catalog/DuaBrowseCategories";
import { DuaCategoryId, DuaCollection, DuaEntry } from "./dua.types";
import { DuaDefaultCollections } from "./DuaDefaultCollections";
import { DuaLibraryManager } from "./DuaLibraryManager";

const SUGGESTED_PREVIEW_COUNT = 6;

const SHORT_LABELS: Partial<Record<DuaCategoryId, string>> = {
  health: "Health",
  wealth: "Wealth",
  "evil-eye": "Evil Eye",
  protection: "Protection",
  forgiveness: "Forgiveness",
  guidance: "Guidance",
  anxiety: "Anxiety",
  patience: "Patience",
  gratitude: "Gratitude",
  family: "Family",
  children: "Children",
  studies: "Studies",
  career: "Career",
  travel: "Travel",
  "morning-evening": "Morning",
  sleep: "Sleep",
  food: "Food",
  "after-salah": "After Salah",
  hardship: "Hardship",
};

/** Presentation helpers for the My Duas library screen. */
export class DuaLibraryPresenter {
  static shortCategoryLabel(categoryId: DuaCategoryId): string {
    return SHORT_LABELS[categoryId] ?? DuaCatalog.categoryLabel(categoryId);
  }

  static metaLine(dua: DuaEntry): string {
    const category = this.shortCategoryLabel(dua.categoryId);
    const sourceHint = this.sourceHint(dua);
    return `${category} • ${sourceHint}`;
  }

  static snippet(dua: DuaEntry): string {
    return dua.translation.trim();
  }

  static authenticityTag(dua: DuaEntry): string {
    const source = dua.source.toLowerCase();
    if (source.includes("qur")) return "Qur'an";
    return "Hadith";
  }

  static featuredSuggestion(
    savedIds: string[],
    pool: DuaEntry[] = DuaCatalog.all()
  ): DuaEntry | null {
    if (pool.length === 0) return null;
    const preferred = pool.find((dua) => dua.id === "evil-eye-muawwidhat");
    if (preferred && !savedIds.includes(preferred.id)) return preferred;
    const unsaved = pool.find((dua) => !savedIds.includes(dua.id));
    return unsaved ?? pool[0] ?? null;
  }

  /** Compact suggested list for the Saved tab (~5–6 cards). */
  static suggestedPreview(
    savedIds: string[],
    pool: DuaEntry[] = DuaCatalog.all(),
    count: number = SUGGESTED_PREVIEW_COUNT
  ): DuaEntry[] {
    if (pool.length === 0) return [];
    const featured = this.featuredSuggestion(savedIds, pool);
    const rest = pool.filter((dua) => dua.id !== featured?.id);
    const ordered = featured ? [featured, ...rest] : rest;
    return ordered.slice(0, count);
  }

  static filterSaved(query: string, savedIds: string[]): DuaEntry[] {
    const entries = DuaLibraryManager.entriesForIds(savedIds);
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((dua) => this.matchesQuery(dua, needle));
  }

  static filterSuggested(query: string, categoryId: DuaCategoryId | null): DuaEntry[] {
    return DuaCatalog.search(query, categoryId);
  }

  static browseCategories() {
    return DUA_BROWSE_CATEGORIES;
  }

  /** User-created lists for the library saved area (excludes starter defaults). */
  static filterUserLists(collections: DuaCollection[], query: string): DuaCollection[] {
    const needle = query.trim().toLowerCase();
    const userLists = collections
      .filter((collection) => !DuaDefaultCollections.isStarter(collection.id))
      .sort((a, b) => b.createdAt - a.createdAt);
    if (!needle) return userLists;
    return userLists.filter((collection) =>
      collection.name.toLowerCase().includes(needle)
    );
  }

  /** Catalog (+ saved-first) options for the create-list dua picker. */
  static pickableDuas(query: string): DuaEntry[] {
    const needle = query.trim().toLowerCase();
    const saved = DuaLibraryManager.savedEntries();
    const savedIds = new Set(saved.map((dua) => dua.id));
    const catalogRest = DuaCatalog.all().filter((dua) => !savedIds.has(dua.id));
    const pool = [...saved, ...catalogRest];
    if (!needle) return pool;
    return pool.filter((dua) => this.matchesQuery(dua, needle));
  }

  private static sourceHint(dua: DuaEntry): string {
    const when = dua.whenToRecite.toLowerCase();
    if (when.includes("morning") || when.includes("evening") || when.includes("daily")) {
      return "Daily";
    }
    if (dua.source.toLowerCase().includes("qur")) return "Qur'an";
    return "Hadith";
  }

  private static matchesQuery(dua: DuaEntry, needle: string): boolean {
    return (
      dua.title.toLowerCase().includes(needle) ||
      dua.translation.toLowerCase().includes(needle) ||
      dua.transliteration.toLowerCase().includes(needle) ||
      dua.source.toLowerCase().includes(needle) ||
      this.shortCategoryLabel(dua.categoryId).toLowerCase().includes(needle) ||
      DuaCatalog.categoryLabel(dua.categoryId).toLowerCase().includes(needle)
    );
  }
}
