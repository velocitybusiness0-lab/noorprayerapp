import { OnboardingStepType } from "./onboarding.types";

export type OnboardingStepTransitionMode = "fade" | "slide";

export type OnboardingStepTransitionDirection = "forward" | "back";

/**
 * Decides content transition style. Navigating onto a question/options page
 * uses a horizontal slide; every other destination keeps the existing fade.
 */
export class OnboardingStepTransitionPolicy {
  static isQuestionStep(type: OnboardingStepType | undefined): boolean {
    return type === "multi-choice";
  }

  /** Slide when the incoming step is a question; otherwise fade. */
  static modeForIncomingStep(
    type: OnboardingStepType | undefined
  ): OnboardingStepTransitionMode {
    return this.isQuestionStep(type) ? "slide" : "fade";
  }

  static directionForIndexChange(
    previousIndex: number,
    nextIndex: number
  ): OnboardingStepTransitionDirection {
    return nextIndex < previousIndex ? "back" : "forward";
  }
}
