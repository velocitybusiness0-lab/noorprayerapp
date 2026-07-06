import * as SQLite from "expo-sqlite";

/**
 * Owns the single SQLite connection used for relational data
 * (prayer history, streak snapshots). Feature managers receive this
 * instance via injection and declare their own schema through migrations.
 */
export class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  constructor(private readonly name = "noor.db") {}

  async connection(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync(this.name);
      await this.db.execAsync("PRAGMA journal_mode = WAL;");
    }
    return this.db;
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
