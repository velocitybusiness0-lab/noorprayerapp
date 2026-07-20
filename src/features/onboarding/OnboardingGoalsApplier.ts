import { dailyGoalsManager } from "@/features/dailyGoals/DailyGoalsManager";
import { useDailyGoals } from "@/features/dailyGoals/dailyGoalsStore";
import { OnboardingAnswers } from "./onboarding.types";

interface OnboardingGoalConfig {
  id: string;
  title: string;
  target: number;
}

const CHOOSE_GOALS_MAP: Record<string, OnboardingGoalConfig> = {
  "five-daily": {
    id: "goal-onboarding-five-daily",
    title: "Pray all 5 daily prayers",
    target: 5,
  },
  discipline: {
    id: "goal-onboarding-discipline",
    title: "Build discipline",
    target: 1,
  },
  quran: {
    id: "goal-onboarding-quran",
    title: "Read Quran daily",
    target: 1,
  },
  dhikr: {
    id: "goal-onboarding-dhikr",
    title: "Remember Allah more",
    target: 1,
  },
  "fasting": {
    id: "goal-onboarding-fasting",
    title: "Fast Mondays & Thursdays",
    target: 2,
  },
  tahajjud: {
    id: "goal-onboarding-tahajjud",
    title: "Wake for tahajjud",
    target: 1,
  },
  charity: {
    id: "goal-onboarding-charity",
    title: "Give charity regularly",
    target: 1,
  },
};

/** Adds onboarding goal picks into the daily goals list. */
export class OnboardingGoalsApplier {
  static apply(answers: OnboardingAnswers): void {
    const selected = answers["choose-goals"];
    if (!Array.isArray(selected) || selected.length === 0) return;

    let snapshot = dailyGoalsManager.ensureToday();

    for (const choiceId of selected) {
      const config = CHOOSE_GOALS_MAP[choiceId];
      if (!config) continue;

      const exists = snapshot.goals.some(
        (goal) =>
          goal.id === config.id ||
          goal.title.toLowerCase() === config.title.toLowerCase()
      );
      if (exists) continue;

      snapshot = dailyGoalsManager.addGoal(
        snapshot,
        config.title,
        config.target,
        config.id
      );
    }

    dailyGoalsManager.save(snapshot);
    useDailyGoals.getState().refresh();
  }
}
