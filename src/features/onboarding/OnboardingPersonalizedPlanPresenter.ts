import { OnboardingAnswers } from "./onboarding.types";
import {
  OnboardingPersonalizedPlanCatalog,
  PersonalizedPlanHabitStep,
  PersonalizedPlanKeywordItem,
  PersonalizedPlanMotivationBenefit,
  PersonalizedPlanQuote,
} from "./OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanGoalDateFormatter } from "./OnboardingPersonalizedPlanGoalDateFormatter";

export interface PersonalizedPlanViewModel {
  headline: string;
  goalLead: string;
  goalDateLabel: string;
  socialProofCaption: string;
  howTitle: string;
  helpItems: readonly PersonalizedPlanKeywordItem[];
  howQuote: PersonalizedPlanQuote;
  protectTitle: string;
  protectItems: readonly PersonalizedPlanKeywordItem[];
  protectQuote: PersonalizedPlanQuote;
  habitsTitle: string;
  habitsBody: string;
  habitsHowLead: string;
  habitSteps: readonly PersonalizedPlanHabitStep[];
  motivationTitle: string;
  motivationBody: string;
  motivationBenefits: readonly PersonalizedPlanMotivationBenefit[];
  discountTitle: string;
  discountBody: string;
  discountCta: string;
  trustLine: string;
}

/** Maps onboarding answers into personalized-plan copy. */
export class OnboardingPersonalizedPlanPresenter {
  static present(answers: OnboardingAnswers): PersonalizedPlanViewModel {
    const name = this.resolveName(answers);
    return {
      headline: name
        ? `${name}, we've made you a custom plan.`
        : "We've made you a custom plan.",
      goalLead: OnboardingPersonalizedPlanCatalog.goalLead,
      goalDateLabel: OnboardingPersonalizedPlanGoalDateFormatter.labelFromToday(),
      socialProofCaption: OnboardingPersonalizedPlanCatalog.socialProofCaption,
      howTitle: OnboardingPersonalizedPlanCatalog.howTitle,
      helpItems: OnboardingPersonalizedPlanCatalog.helpItems,
      howQuote: OnboardingPersonalizedPlanCatalog.howQuote,
      protectTitle: OnboardingPersonalizedPlanCatalog.protectTitle,
      protectItems: OnboardingPersonalizedPlanCatalog.protectItems,
      protectQuote: OnboardingPersonalizedPlanCatalog.protectQuote,
      habitsTitle: OnboardingPersonalizedPlanCatalog.habitsTitle,
      habitsBody: OnboardingPersonalizedPlanCatalog.habitsBody,
      habitsHowLead: OnboardingPersonalizedPlanCatalog.habitsHowLead,
      habitSteps: OnboardingPersonalizedPlanCatalog.habitSteps,
      motivationTitle: OnboardingPersonalizedPlanCatalog.motivationTitle,
      motivationBody: OnboardingPersonalizedPlanCatalog.motivationBody,
      motivationBenefits: OnboardingPersonalizedPlanCatalog.motivationBenefits,
      discountTitle: OnboardingPersonalizedPlanCatalog.discountTitle,
      discountBody: OnboardingPersonalizedPlanCatalog.discountBody,
      discountCta: OnboardingPersonalizedPlanCatalog.discountCta,
      trustLine: OnboardingPersonalizedPlanCatalog.trustLine,
    };
  }

  private static resolveName(answers: OnboardingAnswers): string | null {
    const raw = answers.name;
    if (typeof raw !== "string") return null;
    const trimmed = raw.trim();
    if (trimmed.length === 0) return null;
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }
}
