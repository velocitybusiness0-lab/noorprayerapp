export interface DailyGoal {
  id: string;
  title: string;
  target: number;
}

export interface DailyGoalsSnapshot {
  dayKey: string;
  goals: DailyGoal[];
  progress: Record<string, number>;
}

export const MAX_DAILY_GOALS = 6;
export const MIN_GOAL_TARGET = 1;
export const MAX_GOAL_TARGET = 99;

export const NAMAZ_PRAYED_GOAL_ID = "goal-auto-namaz-prayed";
export const NAMAZ_PRAYED_GOAL_TITLE = "Namazes prayed";
export const NAMAZ_PRAYED_TARGET = 5;

export const GOAL_PRESETS = [
  "Good deeds done",
  "Quran pages read",
  "Dhikr sessions",
] as const;

export function isAutoNamazGoal(goalId: string): boolean {
  return goalId === NAMAZ_PRAYED_GOAL_ID;
}
