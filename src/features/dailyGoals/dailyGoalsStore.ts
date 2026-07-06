import { create } from "zustand";
import { dailyGoalsManager } from "./DailyGoalsManager";
import { DailyGoal, DailyGoalsSnapshot, MAX_DAILY_GOALS, NAMAZ_PRAYED_GOAL_ID } from "./dailyGoals.types";

interface DailyGoalsState {
  ready: boolean;
  goals: DailyGoal[];
  progress: Record<string, number>;
  init: () => void;
  refresh: () => void;
  increment: (goalId: string) => void;
  decrement: (goalId: string) => void;
  addGoal: (title: string, target: number) => void;
  updateGoal: (goalId: string, title: string, target: number) => void;
  removeGoal: (goalId: string) => void;
  syncNamazPrayed: (count: number) => void;
  canAddGoal: () => boolean;
}

function applySnapshot(set: (partial: Partial<DailyGoalsState>) => void, snapshot: DailyGoalsSnapshot) {
  dailyGoalsManager.save(snapshot);
  set({ goals: snapshot.goals, progress: snapshot.progress });
}

export const useDailyGoals = create<DailyGoalsState>((set, get) => ({
  ready: false,
  goals: [],
  progress: {},

  init: () => {
    const snapshot = dailyGoalsManager.ensureToday();
    set({ goals: snapshot.goals, progress: snapshot.progress, ready: true });
  },

  refresh: () => {
    const snapshot = dailyGoalsManager.ensureToday();
    set({ goals: snapshot.goals, progress: snapshot.progress });
  },

  increment: (goalId) => {
    const snapshot = dailyGoalsManager.ensureToday();
    applySnapshot(set, dailyGoalsManager.increment(snapshot, goalId));
  },

  decrement: (goalId) => {
    const snapshot = dailyGoalsManager.ensureToday();
    applySnapshot(set, dailyGoalsManager.decrement(snapshot, goalId));
  },

  addGoal: (title, target) => {
    const snapshot = dailyGoalsManager.ensureToday();
    applySnapshot(set, dailyGoalsManager.addGoal(snapshot, title, target));
  },

  updateGoal: (goalId, title, target) => {
    const snapshot = dailyGoalsManager.ensureToday();
    applySnapshot(set, dailyGoalsManager.updateGoal(snapshot, goalId, title, target));
  },

  removeGoal: (goalId) => {
    const snapshot = dailyGoalsManager.ensureToday();
    applySnapshot(set, dailyGoalsManager.removeGoal(snapshot, goalId));
  },

  syncNamazPrayed: (count) => {
    const snapshot = dailyGoalsManager.ensureToday();
    applySnapshot(set, dailyGoalsManager.syncNamazPrayed(snapshot, count));
  },

  canAddGoal: () =>
    get().goals.filter((goal) => goal.id !== NAMAZ_PRAYED_GOAL_ID).length < MAX_DAILY_GOALS,
}));
