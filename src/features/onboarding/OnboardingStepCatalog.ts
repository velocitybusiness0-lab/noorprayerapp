import { ONBOARDING_DISCOVERY_STEPS } from "./catalog/OnboardingDiscoverySteps";
import { ONBOARDING_SETUP_STEPS } from "./catalog/OnboardingSetupSteps";
import { OnboardingStep } from "./onboarding.types";

/** Full onboarding flow in display order. */
export class OnboardingStepCatalog {
  static readonly steps: OnboardingStep[] = [
    ...ONBOARDING_DISCOVERY_STEPS,
    ...ONBOARDING_SETUP_STEPS,
  ];

  static totalSteps(): number {
    return this.steps.length;
  }

  static stepAt(index: number): OnboardingStep | null {
    return this.steps[index] ?? null;
  }
}
