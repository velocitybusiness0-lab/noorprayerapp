import { Database, database } from "@/core/storage/Database";
import { dayKey } from "@/core/utils/time";

interface QuranRow {
  day_key: string;
  logged_at: number;
}

/** One quran session tick per calendar day. */
export class QuranHistoryManager {
  constructor(private readonly db: Database = database) {}

  async init(): Promise<void> {
    await this.db.run(
      `CREATE TABLE IF NOT EXISTS quran_log (
         day_key TEXT PRIMARY KEY NOT NULL,
         logged_at INTEGER NOT NULL
       );`
    );
  }

  async logSession(when: Date = new Date()): Promise<void> {
    await this.db.run(
      `INSERT OR REPLACE INTO quran_log (day_key, logged_at) VALUES (?, ?);`,
      [dayKey(when), when.getTime()]
    );
  }

  async unlogSession(when: Date = new Date()): Promise<void> {
    await this.db.run(`DELETE FROM quran_log WHERE day_key = ?;`, [dayKey(when)]);
  }

  async clearAll(): Promise<void> {
    await this.db.run(`DELETE FROM quran_log;`);
  }

  async isLoggedToday(when: Date = new Date()): Promise<boolean> {
    const rows = await this.db.all<QuranRow>(`SELECT day_key FROM quran_log WHERE day_key = ?;`, [
      dayKey(when),
    ]);
    return rows.length > 0;
  }

  async totalSessions(): Promise<number> {
    const rows = await this.db.all<{ count: number }>(
      `SELECT COUNT(*) as count FROM quran_log;`
    );
    return rows[0]?.count ?? 0;
  }
}

export const quranHistoryManager = new QuranHistoryManager();
