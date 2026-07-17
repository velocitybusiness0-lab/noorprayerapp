import { InMemoryKeyValueStore, KeyValueStore } from "./KeyValueStore";
import { SqliteKeyValueStore } from "./SqliteKeyValueStore";
import { isExpoGo } from "@/core/runtime/isExpoGo";

/** Adapts the MMKV instance to the {@link KeyValueStore} interface. */
class MmkvKeyValueStore implements KeyValueStore {
  constructor(private readonly store: any) {}

  getString(key: string): string | undefined {
    return this.store.getString(key);
  }
  setString(key: string, value: string): void {
    this.store.set(key, value);
  }
  getBoolean(key: string): boolean | undefined {
    return this.store.getBoolean(key);
  }
  setBoolean(key: string, value: boolean): void {
    this.store.set(key, value);
  }
  getNumber(key: string): number | undefined {
    return this.store.getNumber(key);
  }
  setNumber(key: string, value: number): void {
    this.store.set(key, value);
  }
  remove(key: string): void {
    this.store.remove(key);
  }
  contains(key: string): boolean {
    return this.store.contains(key);
  }
}

let warned = false;

function warnFallback(reason: string): void {
  if (warned) return;
  warned = true;
  console.warn(
    `[storage] ${reason} Using SQLite-backed settings instead. For fastest storage, use a dev build (eas build --profile development).`
  );
}

function createSqliteOrMemory(id: string): KeyValueStore {
  try {
    return new SqliteKeyValueStore(id);
  } catch {
    console.warn(
      "[storage] SQLite KV store unavailable. Using volatile in-memory settings."
    );
    return new InMemoryKeyValueStore();
  }
}

/**
 * Picks the best available store: MMKV in dev/EAS builds, SQLite in Expo Go,
 * and an in-memory store only if both fail.
 *
 * MMKV must never be `require`d in Expo Go — its NitroModules dependency throws
 * at module load time, before any try/catch can run.
 */
export function createKeyValueStore(id: string): KeyValueStore {
  if (isExpoGo()) {
    warnFallback("Running in Expo Go — native MMKV is skipped.");
    return createSqliteOrMemory(id);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createMMKV } = require("react-native-mmkv");
    return new MmkvKeyValueStore(createMMKV({ id }));
  } catch {
    warnFallback("Native MMKV unavailable.");
    return createSqliteOrMemory(id);
  }
}
