/** Category ids for suggested duas. */
export type DuaCategoryId =
  | "health"
  | "wealth"
  | "evil-eye"
  | "protection"
  | "forgiveness"
  | "guidance"
  | "anxiety"
  | "patience"
  | "gratitude"
  | "family"
  | "children"
  | "studies"
  | "career"
  | "travel"
  | "morning-evening"
  | "sleep"
  | "food"
  | "after-salah"
  | "hardship";

export interface DuaCategory {
  id: DuaCategoryId;
  label: string;
  icon: string;
}

/** A curated or user-facing dua entry. */
export interface DuaEntry {
  id: string;
  categoryId: DuaCategoryId;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  whenToRecite: string;
}

export interface DuaCollection {
  id: string;
  name: string;
  emoji: string;
  /** Ionicons glyph for user-created lists; starters use emoji only. */
  icon?: string;
  duaIds: string[];
  createdAt: number;
}

export interface DuaLibrarySnapshot {
  savedIds: string[];
  favoriteIds: string[];
  reminderIds: string[];
  collections: DuaCollection[];
}
