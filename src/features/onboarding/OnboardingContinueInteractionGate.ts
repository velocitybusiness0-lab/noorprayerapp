import { OnboardingStepType } from "./onboarding.types";

/**
 * Steps that keep Continue disabled until an in-step animation/typing finishes.
 */
export class OnboardingContinueInteractionGate {
  static needsReady(stepType: OnboardingStepType | undefined): boolean {
    return (
      stepType === "comparison" ||
      stepType === "message" ||
      stepType === "hope-screen" ||
      stepType === "rating"
    );
  }
}
