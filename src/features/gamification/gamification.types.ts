export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface RewardProgress {
  level: number;
  levelTitle: string;
  /** Lifetime obligatory prayers logged. */
  totalPrayers: number;
  /** Prayers remaining until the next level (0 at max). */
  toNextLevel: number;
  badges: Badge[];
}

export interface RewardInput {
  currentStreak: number;
  longestStreak: number;
  totalPrayers: number;
}
