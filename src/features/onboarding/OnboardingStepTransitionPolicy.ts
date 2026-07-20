import { OnboardingStepType } from "./onboarding.types";

export type OnboardingStepTransitionMode = "fade" | "slide";

export type OnboardingStepTransitionDirection = "forward" | "back";

/**
 * Reload-style horizontal slide for narrative beats; fade reserved for welcome
 * and personalized-plan handoff.
 */
export class OnboardingStepTransitionPolicy {
  private static readonly fadeOnlyTypes = new Set<OnboardingStepType>([
    "welcome",
    "prepaywall-typing",
    "personalized-plan",
  ]);

  static isQuestionStep(type: OnboardingStepType | undefined): boolean {
    return type === "multi-choice";
  }

  /** Slide for most steps; fade only on welcome and plan reveal. */
  static modeForIncomingStep(
    type: OnboardingStepType | undefined
  ): OnboardingStepTransitionMode {
    if (!type || this.fadeOnlyTypes.has(type)) return "fade";
    return "slide";
  }

  static directionForIndexChange(
    previousIndex: number,
    nextIndex: number
  ): OnboardingStepTransitionDirection {
    return nextIndex < previousIndex ? "back" : "forward";
  }
}
