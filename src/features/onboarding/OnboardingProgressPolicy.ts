import { OnboardingStepCatalog } from "./OnboardingStepCatalog";
import { OnboardingStep } from "./onboarding.types";

/** Header progress shows through pre-calculation steps, then hides. */
export class OnboardingProgressPolicy {
  private static readonly calculationIndex = OnboardingStepCatalog.steps.findIndex(
    (step) => step.id === "calculation"
  );

  static shouldShowProgressBar(step: OnboardingStep | null, stepIndex: number): boolean {
    if (step?.type === "welcome") return false;
    if (step?.type === "calculation") return false;
    if (this.calculationIndex < 0) return true;
    return stepIndex < this.calculationIndex;
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

  /** Hides back on calculation, cinematic beats, and choose-goals. */
  static shouldShowBack(step: OnboardingStep | null, stepIndex: number): boolean {
    if (stepIndex <= 0 || !step) return false;
    if (step.id === "choose-goals") return false;
    if (step.type === "calculation") return false;
    if (step.type === "downtrend") return false;
    if (step.type === "slideshow") return false;
    if (step.type === "hope-screen") return false;
    if (step.type === "commitment") return false;
    if (step.type === "benefits-graph") return false;
    if (step.type === "personalized-plan") return false;
    return true;
  }
}
