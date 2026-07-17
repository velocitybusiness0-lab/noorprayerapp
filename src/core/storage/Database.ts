import * as SQLite from "expo-sqlite";

/**
 * Owns the single SQLite connection used for relational data
 * (prayer history, streak snapshots). Feature managers receive this
 * instance via injection and declare their own schema through migrations.
 */
export class Database {
  private db: SQLite.SQLiteDatabase | null = null;
  private opening: Promise<SQLite.SQLiteDatabase> | null = null;

  constructor(private readonly name = "noor.db") {}

  async connection(): Promise<SQLite.SQLiteDatabase> {
    if (this.db) return this.db;
    if (!this.opening) {
      this.opening = (async () => {
        const opened = await SQLite.openDatabaseAsync(this.name);
        await opened.execAsync("PRAGMA journal_mode = WAL;");
        this.db = opened;
        return opened;
      })();
    }
    return this.opening;
  }

  async run(sql: string, params: SQLite.SQLiteBindValue[] = []): Promise<void> {
    const db = await this.connection();
    await db.runAsync(sql, params);
  }

  async all<T>(sql: string, params: SQLite.SQLiteBindValue[] = []): Promise<T[]> {
    const db = await this.connection();
    return db.getAllAsync<T>(sql, params);
  }

  async first<T>(
    sql: string,
    params: SQLite.SQLiteBindValue[] = []
  ): Promise<T | null> {
    const db = await this.connection();
    return db.getFirstAsync<T>(sql, params);
  }
}

/** Shared singleton connection. */
export const database = new Database();
