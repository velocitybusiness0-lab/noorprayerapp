import { DayCompletion, StreakSummary } from "./history.types";

/**
 * Pure streak math over a day-completion series ordered newest-first
 * (index 0 = today). Today may be incomplete without breaking the streak.
 */
export class StreakManager {
  summarize(completions: DayCompletion[]): StreakSummary {
    return {
      current: this.current(completions),
      longest: this.longest(completions),
      todayCount: completions[0]?.prayed.length ?? 0,
    };
  }

  private current(completions: DayCompletion[]): number {
    if (completions.length === 0) return 0;
    let streak = 0;
    // Grace for today: an incomplete today does not break yesterday's streak.
    let start = completions[0].complete ? 0 : 1;
    for (let i = start; i < completions.length; i++) {
      if (completions[i].complete) streak++;
      else break;
    }
    return streak;
  }

  private longest(completions: DayCompletion[]): number {
    let longest = 0;
    let run = 0;
    for (const day of completions) {
      if (day.complete) {
        run++;
        longest = Math.max(longest, run);
      } else {
        run = 0;
      }
    }
    return longest;
  }
}

export const streakManager = new StreakManager();
