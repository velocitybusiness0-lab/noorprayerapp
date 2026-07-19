import { OnboardingStepCatalog } from "./OnboardingStepCatalog";
import { OnboardingStep } from "./onboarding.types";

/** Progress bar fills to 100% on the calculation step, then hides. */
export class OnboardingProgressPolicy {
  private static readonly calculationIndex = OnboardingStepCatalog.steps.findIndex(
    (step) => step.id === "calculation"
  );

  static shouldShowProgressBar(step: OnboardingStep | null, stepIndex: number): boolean {
    if (step?.type === "welcome") return false;
    if (this.calculationIndex < 0) return true;
    return stepIndex <= this.calculationIndex;
  }

  /** Maps pre-calculation steps to 0–95%, then calculation animates to 100%. */
  static headerProgress(stepIndex: number, calcProgress: number, isCalculationStep: boolean): number {
    const calcIndex = this.calculationIndex;
    if (calcIndex <= 0) return 1;

    if (stepIndex > calcIndex) return 1;

    if (isCalculationStep) {
      const start = calcIndex > 0 ? (calcIndex - 1) / calcIndex : 0;
      return start + calcProgress * (1 - start);
    }

    return calcIndex > 0 ? stepIndex / calcIndex : 0;
  }

  static progressOpacityDuringCalculation(calcProgress: number): number {
    if (calcProgress >= 0.92) {
      return Math.max(0, 1 - (calcProgress - 0.92) / 0.08);
    }
    return 1;
  }
}
