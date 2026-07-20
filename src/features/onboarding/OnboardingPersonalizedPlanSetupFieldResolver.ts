import { ONBOARDING_DISCOVERY_STEPS } from "./catalog/OnboardingDiscoverySteps";
import { ONBOARDING_SETUP_STEPS } from "./catalog/OnboardingSetupSteps";
import {
  OnboardingAnswers,
  OnboardingOption,
  OnboardingStep,
} from "./onboarding.types";
import { PersonalizedPlanSetupField } from "./OnboardingPersonalizedPlanCatalog";

interface SetupFieldSource {
  answerKey: string;
  label: string;
  fallback: string;
}

/** Maps onboarding answers into labeled “Your setup” summary fields. */
export class OnboardingPersonalizedPlanSetupFieldResolver {
  private static readonly sources: readonly SetupFieldSource[] = [
    {
      answerKey: "biggest-problem",
      label: "Your biggest challenge",
      fallback: "Missing prayers",
    },
    {
      answerKey: "holding-back",
      label: "Holding you back",
      fallback: "Distractions",
    },
    {
      answerKey: "choose-goals",
      label: "Your goals",
      fallback: "Pray all 5 daily prayers",
    },
  ];

  static resolve(answers: OnboardingAnswers): PersonalizedPlanSetupField[] {
    return this.sources.map((source) => ({
      id: source.answerKey,
      label: source.label,
      value: this.resolveValue(answers, source),
    }));
  }

  private static resolveValue(
    answers: OnboardingAnswers,
    source: SetupFieldSource
  ): string {
    const raw = answers[source.answerKey];
    if (raw === undefined || raw === null) return source.fallback;

    if (Array.isArray(raw)) {
      const labels = raw
        .map((id) => this.optionLabel(source.answerKey, String(id)))
        .filter((label) => label.length > 0);
      if (labels.length === 0) return source.fallback;
      return labels.slice(0, 2).join(", ");
    }

    if (typeof raw === "string" && raw.trim().length > 0) {
      return this.optionLabel(source.answerKey, raw) || source.fallback;
    }

    if (typeof raw === "number") {
      return `${raw} missed / day`;
    }

    return source.fallback;
  }

  private static optionLabel(stepId: string, optionId: string): string {
    const step = this.findStep(stepId);
    const match = step?.options?.find((option: OnboardingOption) => option.id === optionId);
    return match?.label ?? optionId;
  }

  private static findStep(stepId: string): OnboardingStep | undefined {
    return (
      ONBOARDING_DISCOVERY_STEPS.find((step) => step.id === stepId) ??
      ONBOARDING_SETUP_STEPS.find((step) => step.id === stepId)
    );
  }
}
