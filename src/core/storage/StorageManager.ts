import { KeyValueStore } from "./KeyValueStore";
import { createKeyValueStore } from "./createKeyValueStore";

/**
 * Thin, typed wrapper around a fast key-value store.
 *
 * This is the single dependency-injectable persistence boundary for
 * lightweight settings and flags. Larger relational data (prayer history)
 * lives in the SQLite `Database` instead. The underlying store is chosen at
 * runtime (MMKV, or an in-memory fallback when native modules are absent).
 */
export class StorageManager {
  private readonly store: KeyValueStore;

  constructor(id = "noor.settings") {
    this.store = createKeyValueStore(id);
  }

  getString(key: string): string | undefined {
    return this.store.getString(key);
  }

  setString(key: string, value: string): void {
    this.store.setString(key, value);
  }

  getBoolean(key: string): boolean | undefined {
    return this.store.getBoolean(key);
  }

  setBoolean(key: string, value: boolean): void {
    this.store.setBoolean(key, value);
  }

  getNumber(key: string): number | undefined {
    return this.store.getNumber(key);
  }

  setNumber(key: string, value: number): void {
    this.store.setNumber(key, value);
  }

  getObject<T>(key: string): T | undefined {
    const raw = this.store.getString(key);
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }

  setObject<T>(key: string, value: T): void {
    this.store.setString(key, JSON.stringify(value));
  }

  delete(key: string): void {
    this.store.remove(key);
  }

  contains(key: string): boolean {
    return this.store.contains(key);
  }
}

/** Shared singleton for app-wide settings. */
export const storage = new StorageManager();
