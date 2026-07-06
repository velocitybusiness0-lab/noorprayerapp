import { RankGoal } from "./gamification.types";
import { XP_PER_NAMAZ, XP_PER_QURAN_SESSION } from "./XpManager";

export interface RankTier {
  title: string;
  namaz: number;
  quranSessions: number;
  perfectDays: number;
  activeDays: number;
}

/**
 * All five ranks combined ≈ six months of steady logging
 * (~4 namaz/day, ~2 quran sessions/week, ~1 perfect day/week).
 */
const JOURNEY_NAMAZ = 720;
const JOURNEY_QURAN = 48;
const JOURNEY_PERFECT_DAYS = 24;
const JOURNEY_ACTIVE_DAYS = 144;

const RANK_COUNT = 5;
const STEP_NAMAZ = JOURNEY_NAMAZ / (RANK_COUNT - 1);
const STEP_QURAN = JOURNEY_QURAN / (RANK_COUNT - 1);
const STEP_PERFECT_DAYS = JOURNEY_PERFECT_DAYS / (RANK_COUNT - 1);
const STEP_ACTIVE_DAYS = JOURNEY_ACTIVE_DAYS / (RANK_COUNT - 1);

const RANK_TIERS: RankTier[] = [
  { title: "Seeker", namaz: 0, quranSessions: 0, perfectDays: 0, activeDays: 0 },
  {
    title: "Devoted",
    namaz: STEP_NAMAZ,
    quranSessions: STEP_QURAN,
    perfectDays: STEP_PERFECT_DAYS,
    activeDays: STEP_ACTIVE_DAYS,
  },
  {
    title: "Committed",
    namaz: STEP_NAMAZ * 2,
    quranSessions: STEP_QURAN * 2,
    perfectDays: STEP_PERFECT_DAYS * 2,
    activeDays: STEP_ACTIVE_DAYS * 2,
  },
  {
    title: "Steadfast",
    namaz: STEP_NAMAZ * 3,
    quranSessions: STEP_QURAN * 3,
    perfectDays: STEP_PERFECT_DAYS * 3,
    activeDays: STEP_ACTIVE_DAYS * 3,
  },
  {
    title: "Muhsin",
    namaz: JOURNEY_NAMAZ,
    quranSessions: JOURNEY_QURAN,
    perfectDays: JOURNEY_PERFECT_DAYS,
    activeDays: JOURNEY_ACTIVE_DAYS,
  },
];

export interface RankProgressInput {
  totalNamaz: number;
  quranSessions: number;
  perfectDays: number;
  activeDays: number;
}

/** Maps lifetime activity to rank tiers and next-rank completion goals. */
export class RankRequirementsManager {
  tiers(): readonly RankTier[] {
    return RANK_TIERS;
  }

  xpThresholdForLevel(level: number): number {
    const index = Math.max(0, Math.min(level - 1, RANK_TIERS.length - 1));
    const tier = RANK_TIERS[index];
    return tier.namaz * XP_PER_NAMAZ + tier.quranSessions * XP_PER_QURAN_SESSION;
  }

  levelFor(input: RankProgressInput): {
    level: number;
    levelTitle: string;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpToNextLevel: number;
    progressRatio: number;
  } {
    const xp = this.totalXp(input.totalNamaz, input.quranSessions);
    let level = 1;

    for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
      if (this.meetsTier(input, RANK_TIERS[i])) {
        level = i + 1;
        break;
      }
    }

    const current = RANK_TIERS[level - 1];
    const next = RANK_TIERS[level];
    const xpForCurrentLevel = this.xpThresholdForLevel(level);
    const xpForNextLevel = next ? this.xpThresholdForLevel(level + 1) : xpForCurrentLevel;
    const span = xpForNextLevel - xpForCurrentLevel;
    const progressRatio = span > 0 ? Math.min(1, Math.max(0, (xp - xpForCurrentLevel) / span)) : 1;

    return {
      level,
      levelTitle: current.title,
      xpForCurrentLevel,
      xpForNextLevel,
      xpToNextLevel: next ? xpForNextLevel - xp : 0,
      progressRatio,
    };
  }

  goalsForNextRank(input: RankProgressInput, level: number): RankGoal[] {
    const next = RANK_TIERS[level];
    if (!next) return [];

    const current = RANK_TIERS[level - 1];
    return [
      goal("namaz", "Namaz completed", input.totalNamaz, current.namaz, next.namaz, "moon-outline"),
      goal("quran", "Quran sessions", input.quranSessions, current.quranSessions, next.quranSessions, "book-outline"),
      goal("perfect", "Perfect days", input.perfectDays, current.perfectDays, next.perfectDays, "checkmark-done-outline"),
      goal("active", "Active days", input.activeDays, current.activeDays, next.activeDays, "calendar-outline"),
    ];
  }

  totalXp(namazCount: number, quranSessions: number): number {
    return namazCount * XP_PER_NAMAZ + quranSessions * XP_PER_QURAN_SESSION;
  }

  private meetsTier(input: RankProgressInput, tier: RankTier): boolean {
    return (
      input.totalNamaz >= tier.namaz &&
      input.quranSessions >= tier.quranSessions &&
      input.perfectDays >= tier.perfectDays &&
      input.activeDays >= tier.activeDays
    );
  }
}

function goal(
  id: string,
  label: string,
  currentTotal: number,
  currentTierFloor: number,
  nextTierTarget: number,
  icon: string
): RankGoal {
  const span = nextTierTarget - currentTierFloor;
  const progressInTier = Math.max(0, currentTotal - currentTierFloor);
  return {
    id,
    label,
    icon,
    current: Math.min(progressInTier, span),
    target: span,
  };
}

export const rankRequirementsManager = new RankRequirementsManager();
