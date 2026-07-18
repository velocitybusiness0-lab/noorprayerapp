import { DuaEntry } from "../dua.types";
import { DUA_ENTRIES_DAILY } from "./entries/DuaEntriesDaily";
import { DUA_ENTRIES_LIFE } from "./entries/DuaEntriesLife";
import { DUA_ENTRIES_NEEDS } from "./entries/DuaEntriesNeeds";
import { DUA_ENTRIES_PROTECTION } from "./entries/DuaEntriesProtection";

/** Curated suggested duas — combined catalog across all categories. */
export const SUGGESTED_DUAS: DuaEntry[] = [
  ...DUA_ENTRIES_PROTECTION,
  ...DUA_ENTRIES_NEEDS,
  ...DUA_ENTRIES_LIFE,
  ...DUA_ENTRIES_DAILY,
];
