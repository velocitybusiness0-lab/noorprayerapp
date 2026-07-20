import { OnboardingAnswers } from "./onboarding.types";
import {
  OnboardingPersonalizedPlanCatalog,
  PersonalizedPlanBenefitChip,
  PersonalizedPlanIncludesItem,
  PersonalizedPlanOutcomeRow,
  PersonalizedPlanSetupField,
  PersonalizedPlanTestimonial,
} from "./OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanSetupFieldResolver } from "./OnboardingPersonalizedPlanSetupFieldResolver";

export interface PersonalizedPlanViewModel {
  headline: string;
  lead: string;
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefitChips: readonly PersonalizedPlanBenefitChip[];
  planIncludesTitle: string;
  planIncludesSubheader: string;
  planIncludesItems: readonly PersonalizedPlanIncludesItem[];
  setupFields: readonly PersonalizedPlanSetupField[];
  socialProofLine: string;
  ratingLine: string;
  outcomeRows: readonly PersonalizedPlanOutcomeRow[];
  outcomesRatingLine: string;
  testimonials: readonly PersonalizedPlanTestimonial[];
  secondaryQuote: string;
  secondaryAttribution: string;
  comeThisFar: string;
  investHeadline: string;
  ctaLabel: string;
  trustLine: string;
  termsLabel: string;
  privacyLabel: string;
  restoreLabel: string;
}

/** Maps onboarding answers into personalized-plan copy. */
export class OnboardingPersonalizedPlanPresenter {
  static present(answers: OnboardingAnswers): PersonalizedPlanViewModel {
    const name = this.resolveName(answers);
    const catalog = OnboardingPersonalizedPlanCatalog;

    return {
      headline: name
        ? `${name}, we've made you a custom plan.`
        : "We've made you a custom plan.",
      lead: catalog.lead,
      benefitsTitle: catalog.benefitsTitle,
      benefitsSubtitle: catalog.benefitsSubtitle,
      benefitChips: catalog.benefitChips,
      planIncludesTitle: catalog.planIncludesTitle,
      planIncludesSubheader: catalog.planIncludesSubheader,
      planIncludesItems: catalog.planIncludesItems,
      setupFields: OnboardingPersonalizedPlanSetupFieldResolver.resolve(answers),
      socialProofLine: catalog.socialProofLine,
      ratingLine: catalog.ratingLine,
      outcomeRows: catalog.outcomeRows,
      outcomesRatingLine: catalog.outcomesRatingLine,
      testimonials: catalog.testimonials,
      secondaryQuote: catalog.secondaryQuote,
      secondaryAttribution: catalog.secondaryAttribution,
      comeThisFar: catalog.comeThisFar,
      investHeadline: catalog.investHeadline,
      ctaLabel: catalog.ctaLabel,
      trustLine: catalog.trustLine,
      termsLabel: catalog.termsLabel,
      privacyLabel: catalog.privacyLabel,
      restoreLabel: catalog.restoreLabel,
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
