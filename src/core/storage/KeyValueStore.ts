/**
 * Persistence boundary for lightweight settings/flags. Implemented by a fast
 * native store (MMKV) in real builds and an in-memory fallback where the
 * native module is unavailable (e.g. Expo Go), SQLite-backed storage is used.
 */
export interface KeyValueStore {
  getString(key: string): string | undefined;
  setString(key: string, value: string): void;
  getBoolean(key: string): boolean | undefined;
  setBoolean(key: string, value: boolean): void;
  getNumber(key: string): number | undefined;
  setNumber(key: string, value: number): void;
  remove(key: string): void;
  contains(key: string): boolean;
}

/**
 * Volatile fallback used when no native key-value store is present. Data does
 * not survive a reload; a dev/EAS build is required for real persistence.
 */
export class InMemoryKeyValueStore implements KeyValueStore {
  private readonly map = new Map<string, string | boolean | number>();

  getString(key: string): string | undefined {
    const value = this.map.get(key);
    return typeof value === "string" ? value : undefined;
  }
  setString(key: string, value: string): void {
    this.map.set(key, value);
  }
  getBoolean(key: string): boolean | undefined {
    const value = this.map.get(key);
    return typeof value === "boolean" ? value : undefined;
  }
  setBoolean(key: string, value: boolean): void {
    this.map.set(key, value);
  }
  getNumber(key: string): number | undefined {
    const value = this.map.get(key);
    return typeof value === "number" ? value : undefined;
  }
  setNumber(key: string, value: number): void {
    this.map.set(key, value);
  }
  remove(key: string): void {
    this.map.delete(key);
  }
  contains(key: string): boolean {
    return this.map.has(key);
  }
}
