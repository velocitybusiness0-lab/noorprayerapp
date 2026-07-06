import { dayKey } from "@/core/utils/time";
import { OBLIGATORY_PRAYERS, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { prayerHistoryManager, PrayerHistoryManager } from "./PrayerHistoryManager";
import { quranHistoryManager, QuranHistoryManager } from "./QuranHistoryManager";

const DEMO_DAYS = 90;

/** Seeds varied prayer history in development for previewing streaks and heatmaps. */
export class DemoHistorySeeder {
  constructor(
    private readonly history: PrayerHistoryManager,
    private readonly quran: QuranHistoryManager
  ) {}

  /** Fills the last ~90 days with random namaz counts (0–5) and quran sessions. */
  async seedRandomDemo(): Promise<boolean> {
    if (!__DEV__) return false;

    const today = new Date();
    let seeded = false;

    for (let offset = DEMO_DAYS - 1; offset >= 0; offset--) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      const key = dayKey(date);
      const existing = await this.history.slotsForDay(key);
      if (existing.length > 0) continue;

      const count = this.randomPrayerCount();
      const slots = this.pickRandomSlots(count);
      for (const slot of slots) {
        await this.history.log(slot, "manual", date);
        seeded = true;
      }

      if (Math.random() < 0.28) {
        await this.quran.logSession(date);
        seeded = true;
      }
    }

    return seeded;
  }

  /** Weighted mix: some missed, few, most, and all prayed days. */
  private randomPrayerCount(): number {
    const roll = Math.random();
    if (roll < 0.14) return 0;
    if (roll < 0.3) return this.randomInt(1, 2);
    if (roll < 0.62) return this.randomInt(3, 4);
    return 5;
  }

  private pickRandomSlots(count: number): ObligatoryPrayer[] {
    if (count === 0) return [];
    const shuffled = [...OBLIGATORY_PRAYERS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export const demoHistorySeeder = new DemoHistorySeeder(prayerHistoryManager, quranHistoryManager);
