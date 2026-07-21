import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { OnboardingPersonalizedPlanBenefitsSection } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanBenefitsSection";
import { OnboardingPersonalizedPlanClosingSection } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanClosingSection";
import { OnboardingPersonalizedPlanDivider } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanDivider";
import {
  OnboardingPersonalizedPlanFloatCta,
  OnboardingPersonalizedPlanFloatCtaLayout,
} from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanFloatCta";
import { OnboardingPersonalizedPlanOutcomesSection } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanOutcomesSection";
import { OnboardingPersonalizedPlanSetupSection } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanSetupSection";
import { OnboardingPersonalizedPlanTopSection } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanTopSection";
import { OnboardingPersonalizedPlanPresenter } from "@/features/onboarding/OnboardingPersonalizedPlanPresenter";
import { OnboardingAnswers } from "@/features/onboarding/onboarding.types";

interface OnboardingPersonalizedPlanStepProps {
  answers: OnboardingAnswers;
  onContinue: () => void;
}

/**
 * Pre-paywall conversion page:
 * Top → Benefits chips → Setup → Outcomes → Testimonials.
 * Sage CTA floats over scroll near the bottom.
 */
export function OnboardingPersonalizedPlanStep({
  answers,
  onContinue,
}: OnboardingPersonalizedPlanStepProps) {
  const model = useMemo(
    () => OnboardingPersonalizedPlanPresenter.present(answers),
    [answers]
  );

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <OnboardingPersonalizedPlanTopSection
          headline={model.headline}
          lead={model.lead}
        />

        <OnboardingPersonalizedPlanBenefitsSection
          title={model.benefitsTitle}
          subtitle={model.benefitsSubtitle}
          chips={model.benefitChips}
        />

        <OnboardingPersonalizedPlanDivider />

        <OnboardingPersonalizedPlanSetupSection
          planIncludesTitle={model.planIncludesTitle}
          planIncludesSubheader={model.planIncludesSubheader}
          planIncludesItems={model.planIncludesItems}
          fields={model.setupFields}
          socialProofLine={model.socialProofLine}
          ratingLine={model.ratingLine}
        />

        <OnboardingPersonalizedPlanDivider />

        <OnboardingPersonalizedPlanOutcomesSection
          rows={model.outcomeRows}
          ratingLine={model.outcomesRatingLine}
        />

        <OnboardingPersonalizedPlanDivider />

        <OnboardingPersonalizedPlanClosingSection
          testimonials={model.testimonials}
          secondaryQuote={model.secondaryQuote}
          secondaryAttribution={model.secondaryAttribution}
          comeThisFar={model.comeThisFar}
          investHeadline={model.investHeadline}
          termsLabel={model.termsLabel}
          privacyLabel={model.privacyLabel}
          restoreLabel={model.restoreLabel}
        />
      </ScrollView>

      <OnboardingPersonalizedPlanFloatCta
        label={model.ctaLabel}
        trustLine={model.trustLine}
        onContinue={onContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    overflow: "visible",
  },
  content: {
    paddingTop: 4,
    paddingBottom: OnboardingPersonalizedPlanFloatCtaLayout.scrollBottomPadding,
    gap: 28,
    overflow: "visible",
  },
});
