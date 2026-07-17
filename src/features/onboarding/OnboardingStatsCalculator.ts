export interface MissedPrayerStats {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

/** Turns “missed per day” into headline stats for the onboarding reveal. */
export class OnboardingStatsCalculator {
  static fromDailyMissed(daily: number): MissedPrayerStats {
    return {
      daily,
      weekly: daily * 7,
      monthly: daily * 30,
      yearly: daily * 365,
    };
  }
}
