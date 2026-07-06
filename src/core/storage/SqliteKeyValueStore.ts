import { SQLiteStorage } from "expo-sqlite/kv-store";
import { KeyValueStore } from "./KeyValueStore";

/**
 * Persistent key-value store backed by SQLite. Works in Expo Go and dev builds
 * when MMKV's native module is unavailable.
 */
export class SqliteKeyValueStore implements KeyValueStore {
  private readonly storage: SQLiteStorage;

  constructor(databaseName = "noor.kv") {
    this.storage = new SQLiteStorage(databaseName);
  }

  getString(key: string): string | undefined {
    return this.storage.getItemSync(key) ?? undefined;
  }

  setString(key: string, value: string): void {
    this.storage.setItemSync(key, value);
  }

  getBoolean(key: string): boolean | undefined {
    const raw = this.getString(key);
    if (raw === undefined) return undefined;
    return raw === "true";
  }

  setBoolean(key: string, value: boolean): void {
    this.setString(key, value ? "true" : "false");
  }

  getNumber(key: string): number | undefined {
    const raw = this.getString(key);
    if (raw === undefined) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  setNumber(key: string, value: number): void {
    this.setString(key, String(value));
  }

  remove(key: string): void {
    this.storage.removeItemSync(key);
  }

  contains(key: string): boolean {
    return this.storage.getItemSync(key) !== null;
  }
}
