export interface RankGoal {
  id: string;
  label: string;
  icon: string;
  current: number;
  target: number;
}

export interface PlayerProgress {
  level: number;
  levelTitle: string;
  nextRankTitle?: string;
  totalNamaz: number;
  xp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpToNextLevel: number;
  progressRatio: number;
  rankGoals: RankGoal[];
}

export interface SlotCounts {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface PlayerProgressInput {
  totalNamaz: number;
  quranSessions: number;
  activeDays: number;
  perfectDays: number;
  currentStreak: number;
  longestStreak: number;
  slotCounts: SlotCounts;
}
