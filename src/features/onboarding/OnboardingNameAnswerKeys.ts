import { OnboardingAnswers } from "./onboarding.types";

/** Answer keys and completion rules for the name onboarding step (name + age). */
export class OnboardingNameAnswerKeys {
  static readonly age = "age";

  static isNameFilled(value: unknown): boolean {
    return typeof value === "string" && value.trim().length > 0;
  }

  /** Non-empty numeric age in a realistic range. */
  static isAgeValid(value: unknown): boolean {
    if (typeof value !== "string" || !/^\d+$/.test(value)) return false;
    const age = Number(value);
    return age >= 1 && age <= 120;
  }

  static canContinue(answers: OnboardingAnswers, nameStepId: string): boolean {
    return (
      this.isNameFilled(answers[nameStepId]) &&
      this.isAgeValid(answers[this.age])
    );
  }
}
