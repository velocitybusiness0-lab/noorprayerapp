import { OnboardingStepType } from "./onboarding.types";

/**
 * Decides when the shell Continue footer is hidden or pinned in-flow.
 * Personalized-plan owns a floating in-step CTA (Start my plan).
 */
export class OnboardingFooterVisibilityPolicy {
  static shouldHideContinue(stepType: OnboardingStepType): boolean {
    return (
      stepType === "calculation" ||
      stepType === "commitment" ||
      stepType === "prepaywall-typing" ||
      stepType === "personalized-plan"
    );
  }

  /** In-flow footer avoids absolute overlay being covered by long scroll pages. */
  static shouldPinFooterInFlow(stepType: OnboardingStepType): boolean {
    return (
      stepType === "name" ||
      stepType === "symptoms" ||
      stepType === "rating"
    );
  }
}
