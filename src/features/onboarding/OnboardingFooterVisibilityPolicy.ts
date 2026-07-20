import { OnboardingStepType } from "./onboarding.types";

/**
 * Decides when the shell Continue footer is hidden or pinned in-flow.
 * Personalized-plan always shows Start my plan (Claim Now is a second path).
 */
export class OnboardingFooterVisibilityPolicy {
  static shouldHideContinue(stepType: OnboardingStepType): boolean {
    return (
      stepType === "calculation" ||
      stepType === "commitment" ||
      stepType === "prepaywall-typing"
    );
  }

  /** In-flow footer avoids absolute overlay being covered by long scroll pages. */
  static shouldPinFooterInFlow(stepType: OnboardingStepType): boolean {
    return (
      stepType === "personalized-plan" ||
      stepType === "name" ||
      stepType === "symptoms" ||
      stepType === "rating"
    );
  }
}
