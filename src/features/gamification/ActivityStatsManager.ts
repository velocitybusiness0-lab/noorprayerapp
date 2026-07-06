import { PlayerProgress, PlayerProgressInput } from "./gamification.types";
import { rankRequirementsManager } from "./RankRequirementsManager";
import { xpManager } from "./XpManager";

/** Builds player-facing rank goals and XP progress from prayer history. */
export class ActivityStatsManager {
  build(input: PlayerProgressInput): PlayerProgress {
    const rankInput = {
      totalNamaz: input.totalNamaz,
      quranSessions: input.quranSessions,
      perfectDays: input.perfectDays,
      activeDays: input.activeDays,
    };
    const xp = xpManager.totalXp(input.totalNamaz, input.quranSessions);
    const level = rankRequirementsManager.levelFor(rankInput);
    const nextTier = rankRequirementsManager.tiers()[level.level];

    return {
      level: level.level,
      levelTitle: level.levelTitle,
      nextRankTitle: nextTier?.title,
      totalNamaz: input.totalNamaz,
      xp,
      xpForCurrentLevel: level.xpForCurrentLevel,
      xpForNextLevel: level.xpForNextLevel,
      xpToNextLevel: level.xpToNextLevel,
      progressRatio: level.progressRatio,
      rankGoals: rankRequirementsManager.goalsForNextRank(rankInput, level.level),
    };
  }
}

export const activityStatsManager = new ActivityStatsManager();
