import { Badge, RewardInput, RewardProgress } from "./gamification.types";

interface LevelTier {
  threshold: number;
  title: string;
}

const LEVELS: LevelTier[] = [
  { threshold: 0, title: "Seeker" },
  { threshold: 50, title: "Devoted" },
  { threshold: 150, title: "Committed" },
  { threshold: 400, title: "Steadfast" },
  { threshold: 1000, title: "Muhsin" },
];

/**
 * Turns raw stats into levels and badges to make praying all five rewarding.
 * Pure logic; no persistence or UI.
 */
export class RewardManager {
  evaluate(input: RewardInput): RewardProgress {
    const { level, levelTitle, toNextLevel } = this.levelFor(input.totalPrayers);
    return {
      level,
      levelTitle,
      totalPrayers: input.totalPrayers,
      toNextLevel,
      badges: this.badges(input),
    };
  }

  private levelFor(total: number) {
    let index = 0;
    for (let i = 0; i < LEVELS.length; i++) {
      if (total >= LEVELS[i].threshold) index = i;
    }
    const next = LEVELS[index + 1];
    return {
      level: index + 1,
      levelTitle: LEVELS[index].title,
      toNextLevel: next ? next.threshold - total : 0,
    };
  }

  private badges(input: RewardInput): Badge[] {
    const { currentStreak, longestStreak, totalPrayers } = input;
    const best = Math.max(currentStreak, longestStreak);
    return [
      badge("streak-3", "Consistent", "3-day streak", "flame-outline", best >= 3),
      badge("streak-7", "Steadfast", "7-day streak", "flame", best >= 7),
      badge("streak-30", "Devoted", "30-day streak", "flame-sharp", best >= 30),
      badge("streak-100", "Unwavering", "100-day streak", "shield-checkmark", best >= 100),
      badge("total-50", "Fifty", "50 prayers logged", "ribbon-outline", totalPrayers >= 50),
      badge("total-500", "Five Hundred", "500 prayers logged", "ribbon", totalPrayers >= 500),
      badge("total-1000", "Thousand", "1000 prayers logged", "trophy", totalPrayers >= 1000),
    ];
  }
}

function badge(
  id: string,
  label: string,
  description: string,
  icon: string,
  unlocked: boolean
): Badge {
  return { id, label, description, icon, unlocked };
}

export const rewardManager = new RewardManager();
