import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { dayKey } from "@/core/utils/time";
import {
  DailyGoal,
  DailyGoalsSnapshot,
  MAX_DAILY_GOALS,
  MAX_GOAL_TARGET,
  MIN_GOAL_TARGET,
  NAMAZ_PRAYED_GOAL_ID,
  NAMAZ_PRAYED_GOAL_TITLE,
  NAMAZ_PRAYED_TARGET,
} from "./dailyGoals.types";

/** Persists daily goals and per-day progress counts. */
export class DailyGoalsManager {
  load(today = new Date()): DailyGoalsSnapshot {
    const stored = storage.getObject<DailyGoalsSnapshot>(StorageKeys.dailyGoals);
    const currentKey = dayKey(today);

    if (!stored) {
      return { dayKey: currentKey, goals: [], progress: {} };
    }

    if (stored.dayKey !== currentKey) {
      return { dayKey: currentKey, goals: stored.goals, progress: {} };
    }

    return stored;
  }

  /** Loads goals and resets progress to 0 when a new calendar day starts. */
  ensureToday(today = new Date()): DailyGoalsSnapshot {
    const snapshot = this.dedupeGoals(this.load(today));
    const stored = storage.getObject<DailyGoalsSnapshot>(StorageKeys.dailyGoals);
    if (stored && stored.dayKey !== snapshot.dayKey) {
      this.save(snapshot);
      return snapshot;
    }
    if (stored && stored.goals.length !== snapshot.goals.length) {
      this.save(snapshot);
    }
    return snapshot;
  }

  save(snapshot: DailyGoalsSnapshot): void {
    storage.setObject(StorageKeys.dailyGoals, snapshot);
  }

  increment(snapshot: DailyGoalsSnapshot, goalId: string): DailyGoalsSnapshot {
    const goal = snapshot.goals.find((item) => item.id === goalId);
    if (!goal) return snapshot;

    const current = snapshot.progress[goalId] ?? 0;
    const next = Math.min(goal.target, current + 1);
    return this.withProgress(snapshot, goalId, next);
  }

  decrement(snapshot: DailyGoalsSnapshot, goalId: string): DailyGoalsSnapshot {
    const current = snapshot.progress[goalId] ?? 0;
    const next = Math.max(0, current - 1);
    return this.withProgress(snapshot, goalId, next);
  }

  addGoal(
    snapshot: DailyGoalsSnapshot,
    title: string,
    target: number,
    goalId?: string
  ): DailyGoalsSnapshot {
    if (snapshot.goals.length >= MAX_DAILY_GOALS) return snapshot;

    const trimmed = title.trim();
    if (!trimmed) return snapshot;

    const id = goalId ?? this.createUniqueGoalId();
    if (snapshot.goals.some((goal) => goal.id === id)) return snapshot;

    const goal: DailyGoal = {
      id,
      title: trimmed,
      target: this.clampTarget(target),
    };

    return {
      ...snapshot,
      goals: [...snapshot.goals, goal],
      progress: { ...snapshot.progress, [goal.id]: 0 },
    };
  }

  updateGoal(
    snapshot: DailyGoalsSnapshot,
    goalId: string,
    title: string,
    target: number
  ): DailyGoalsSnapshot {
    const trimmed = title.trim();
    if (!trimmed) return snapshot;

    const clampedTarget = this.clampTarget(target);
    const goals = snapshot.goals.map((goal) =>
      goal.id === goalId ? { ...goal, title: trimmed, target: clampedTarget } : goal
    );
    const current = snapshot.progress[goalId] ?? 0;

    return {
      ...snapshot,
      goals,
      progress: { ...snapshot.progress, [goalId]: Math.min(current, clampedTarget) },
    };
  }

  removeGoal(snapshot: DailyGoalsSnapshot, goalId: string): DailyGoalsSnapshot {
    const { [goalId]: _, ...progress } = snapshot.progress;
    return {
      ...snapshot,
      goals: snapshot.goals.filter((goal) => goal.id !== goalId),
      progress,
    };
  }

  /** Keeps an auto "Namazes prayed" goal in sync with today's logged prayers. */
  syncNamazPrayed(snapshot: DailyGoalsSnapshot, count: number): DailyGoalsSnapshot {
    const clamped = Math.max(0, Math.min(NAMAZ_PRAYED_TARGET, count));
    const existing = snapshot.goals.find((goal) => goal.id === NAMAZ_PRAYED_GOAL_ID);

    if (clamped === 0) {
      return existing ? this.removeGoal(snapshot, NAMAZ_PRAYED_GOAL_ID) : snapshot;
    }

    if (!existing) {
      const autoGoal: DailyGoal = {
        id: NAMAZ_PRAYED_GOAL_ID,
        title: NAMAZ_PRAYED_GOAL_TITLE,
        target: NAMAZ_PRAYED_TARGET,
      };
      const manualGoals = snapshot.goals.filter((goal) => goal.id !== NAMAZ_PRAYED_GOAL_ID);
      return this.withProgress({ ...snapshot, goals: [autoGoal, ...manualGoals] }, NAMAZ_PRAYED_GOAL_ID, clamped);
    }

    return this.withProgress(snapshot, NAMAZ_PRAYED_GOAL_ID, clamped);
  }

  private createUniqueGoalId(): string {
    return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  /** Removes duplicate goal ids from persisted snapshots. */
  private dedupeGoals(snapshot: DailyGoalsSnapshot): DailyGoalsSnapshot {
    const seen = new Set<string>();
    const goals: DailyGoal[] = [];
    const progress: Record<string, number> = {};

    for (const goal of snapshot.goals) {
      if (seen.has(goal.id)) continue;
      seen.add(goal.id);
      goals.push(goal);
      progress[goal.id] = snapshot.progress[goal.id] ?? 0;
    }

    if (goals.length === snapshot.goals.length) return snapshot;
    return { ...snapshot, goals, progress };
  }

  private withProgress(
    snapshot: DailyGoalsSnapshot,
    goalId: string,
    count: number
  ): DailyGoalsSnapshot {
    return {
      ...snapshot,
      progress: { ...snapshot.progress, [goalId]: count },
    };
  }

  private clampTarget(target: number): number {
    return Math.max(MIN_GOAL_TARGET, Math.min(MAX_GOAL_TARGET, Math.round(target)));
  }
}

export const dailyGoalsManager = new DailyGoalsManager();
