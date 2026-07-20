import { addDays, format } from "date-fns";

/** Formats the ~30-day presence milestone date for the plan page. */
export class OnboardingPersonalizedPlanGoalDateFormatter {
  static readonly streakDays = 30;

  static labelFromToday(now: Date = new Date()): string {
    return format(addDays(now, this.streakDays), "MMM d, yyyy");
  }
}
