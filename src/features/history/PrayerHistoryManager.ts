import { Database, database } from "@/core/storage/Database";
import { dayKey } from "@/core/utils/time";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { DayCompletion, PrayerLogEntry, PrayerSource } from "./history.types";

const OBLIGATORY_COUNT = 5;

interface LogRow {
  day_key: string;
  slot: string;
  prayed_at: number;
  source: string;
}

/**
 * Persists the prayer log in SQLite and answers completion queries.
 * Pure data access: streak math lives in `StreakManager`.
 */
export class PrayerHistoryManager {
  constructor(private readonly db: Database = database) {}

  async init(): Promise<void> {
    await this.db.run(
      `CREATE TABLE IF NOT EXISTS prayer_log (
         day_key TEXT NOT NULL,
         slot TEXT NOT NULL,
         prayed_at INTEGER NOT NULL,
         source TEXT NOT NULL,
         PRIMARY KEY (day_key, slot)
       );`
    );
  }

  async log(
    slot: ObligatoryPrayer,
    source: PrayerSource,
    when: Date = new Date()
  ): Promise<void> {
    await this.db.run(
      `INSERT OR REPLACE INTO prayer_log (day_key, slot, prayed_at, source)
       VALUES (?, ?, ?, ?);`,
      [dayKey(when), slot, when.getTime(), source]
    );
  }

  async unlog(slot: ObligatoryPrayer, when: Date = new Date()): Promise<void> {
    await this.db.run(`DELETE FROM prayer_log WHERE day_key = ? AND slot = ?;`, [
      dayKey(when),
      slot,
    ]);
  }

  async slotsForDay(key: string): Promise<ObligatoryPrayer[]> {
    const rows = await this.db.all<LogRow>(
      `SELECT * FROM prayer_log WHERE day_key = ?;`,
      [key]
    );
    return rows.map((r) => r.slot as ObligatoryPrayer);
  }

  async completionsSince(days: number): Promise<DayCompletion[]> {
    const rows = await this.db.all<LogRow>(
      `SELECT * FROM prayer_log ORDER BY day_key DESC;`
    );
    const byDay = new Map<string, ObligatoryPrayer[]>();
    for (const row of rows) {
      const list = byDay.get(row.day_key) ?? [];
      list.push(row.slot as ObligatoryPrayer);
      byDay.set(row.day_key, list);
    }

    const result: DayCompletion[] = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = dayKey(d);
      const prayed = byDay.get(key) ?? [];
      result.push({
        dayKey: key,
        prayed,
        complete: prayed.length >= OBLIGATORY_COUNT,
      });
    }
    return result;
  }

  async allEntries(): Promise<PrayerLogEntry[]> {
    const rows = await this.db.all<LogRow>(`SELECT * FROM prayer_log;`);
    return rows.map((r) => ({
      dayKey: r.day_key,
      slot: r.slot as ObligatoryPrayer,
      prayedAt: r.prayed_at,
      source: r.source as PrayerSource,
    }));
  }
}

export const prayerHistoryManager = new PrayerHistoryManager();
