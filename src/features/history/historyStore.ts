import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { setPrayerLogHandler } from "@/features/notifications/notificationRouter";
import { activityStatsManager } from "@/features/gamification/ActivityStatsManager";
import { PlayerProgress, SlotCounts } from "@/features/gamification/gamification.types";
import { prayerHistoryManager } from "./PrayerHistoryManager";
import { quranHistoryManager } from "./QuranHistoryManager";
import { streakManager } from "./StreakManager";
import { DayCompletion, PrayerLogEntry, PrayerSource, StreakSummary } from "./history.types";

const HISTORY_WINDOW_DAYS = 365;
/** Legacy flag from removed demo seeder — wipe once so fake history disappears. */
const LEGACY_DEMO_KEY = "history.random-demo.v1";

interface HistoryState {
  ready: boolean;
  todaySlots: ObligatoryPrayer[];
  quranLoggedToday: boolean;
  streak: StreakSummary;
  progress: PlayerProgress;
  completions: DayCompletion[];
  init: () => Promise<void>;
  refresh: () => Promise<void>;
  toggle: (slot: ObligatoryPrayer) => Promise<void>;
  toggleQuranToday: () => Promise<void>;
  logPrayed: (slot: ObligatoryPrayer, source: PrayerSource) => Promise<void>;
  isLogged: (slot: ObligatoryPrayer) => boolean;
}

const EMPTY_STREAK: StreakSummary = { current: 0, longest: 0, todayCount: 0 };

const EMPTY_PROGRESS: PlayerProgress = {
  level: 1,
  levelTitle: "Seeker",
  xp: 0,
  xpForCurrentLevel: 0,
  xpForNextLevel: 1500,
  xpToNextLevel: 1500,
  progressRatio: 0,
  totalNamaz: 0,
  rankGoals: [],
};

function countBySlot(entries: PrayerLogEntry[]): SlotCounts {
  const counts: SlotCounts = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
  for (const entry of entries) {
    counts[entry.slot] += 1;
  }
  return counts;
}

export const useHistory = create<HistoryState>((set, get) => ({
  ready: false,
  todaySlots: [],
  quranLoggedToday: false,
  streak: EMPTY_STREAK,
  progress: EMPTY_PROGRESS,
  completions: [],

  init: async () => {
    await prayerHistoryManager.init();
    await quranHistoryManager.init();
    if (storage.getBoolean(LEGACY_DEMO_KEY)) {
      try {
        await prayerHistoryManager.clearAll();
        await quranHistoryManager.clearAll();
      } catch (error) {
        console.warn("[History] Failed to clear legacy demo data", error);
      } finally {
        storage.delete(LEGACY_DEMO_KEY);
      }
    }
    setPrayerLogHandler((slot) => {
      void get().logPrayed(slot, "notification");
    });
    await get().refresh();
    set({ ready: true });
  },

  refresh: async () => {
    const completions = await prayerHistoryManager.completionsSince(HISTORY_WINDOW_DAYS);
    const entries = await prayerHistoryManager.allEntries();
    const quranSessions = await quranHistoryManager.totalSessions();
    const quranLoggedToday = await quranHistoryManager.isLoggedToday();
    const activeDays = completions.filter((day) => day.prayed.length > 0).length;
    const perfectDays = completions.filter((day) => day.complete).length;
    const streak = streakManager.summarize(completions);

    const progress = activityStatsManager.build({
      totalNamaz: entries.length,
      quranSessions,
      activeDays,
      perfectDays,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      slotCounts: countBySlot(entries),
    });

    set({
      completions,
      todaySlots: completions[0]?.prayed ?? [],
      quranLoggedToday,
      streak,
      progress,
    });
  },

  toggle: async (slot) => {
    if (get().isLogged(slot)) {
      await prayerHistoryManager.unlog(slot);
    } else {
      await prayerHistoryManager.log(slot, "manual");
    }
    await get().refresh();
  },

  toggleQuranToday: async () => {
    if (get().quranLoggedToday) {
      await quranHistoryManager.unlogSession();
    } else {
      await quranHistoryManager.logSession();
    }
    await get().refresh();
  },

  logPrayed: async (slot, source) => {
    if (get().isLogged(slot)) return;
    await prayerHistoryManager.ensureReady();
    await prayerHistoryManager.log(slot, source);
    await get().refresh();
  },

  isLogged: (slot) => get().todaySlots.includes(slot),
}));
