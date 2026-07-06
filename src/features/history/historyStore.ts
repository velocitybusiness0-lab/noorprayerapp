import { create } from "zustand";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { setPrayerLogHandler } from "@/features/notifications/notificationRouter";
import { prayerHistoryManager } from "./PrayerHistoryManager";
import { streakManager } from "./StreakManager";
import { rewardManager } from "@/features/gamification/RewardManager";
import { RewardProgress } from "@/features/gamification/gamification.types";
import { DayCompletion, PrayerSource, StreakSummary } from "./history.types";

const HISTORY_WINDOW_DAYS = 365;

interface HistoryState {
  ready: boolean;
  todaySlots: ObligatoryPrayer[];
  streak: StreakSummary;
  reward: RewardProgress;
  completions: DayCompletion[];
  init: () => Promise<void>;
  refresh: () => Promise<void>;
  toggle: (slot: ObligatoryPrayer) => Promise<void>;
  logPrayed: (slot: ObligatoryPrayer, source: PrayerSource) => Promise<void>;
  isLogged: (slot: ObligatoryPrayer) => boolean;
}

const EMPTY_STREAK: StreakSummary = { current: 0, longest: 0, todayCount: 0 };
const EMPTY_REWARD: RewardProgress = {
  level: 1,
  levelTitle: "Seeker",
  totalPrayers: 0,
  toNextLevel: 50,
  badges: [],
};

export const useHistory = create<HistoryState>((set, get) => ({
  ready: false,
  todaySlots: [],
  streak: EMPTY_STREAK,
  reward: EMPTY_REWARD,
  completions: [],

  init: async () => {
    await prayerHistoryManager.init();
    setPrayerLogHandler((slot) => {
      void get().logPrayed(slot, "notification");
    });
    await get().refresh();
    set({ ready: true });
  },

  refresh: async () => {
    const completions = await prayerHistoryManager.completionsSince(HISTORY_WINDOW_DAYS);
    const entries = await prayerHistoryManager.allEntries();
    const streak = streakManager.summarize(completions);
    const reward = rewardManager.evaluate({
      currentStreak: streak.current,
      longestStreak: streak.longest,
      totalPrayers: entries.length,
    });
    set({
      completions,
      todaySlots: completions[0]?.prayed ?? [],
      streak,
      reward,
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

  logPrayed: async (slot, source) => {
    if (get().isLogged(slot)) return;
    await prayerHistoryManager.log(slot, source);
    await get().refresh();
  },

  isLogged: (slot) => get().todaySlots.includes(slot),
}));
