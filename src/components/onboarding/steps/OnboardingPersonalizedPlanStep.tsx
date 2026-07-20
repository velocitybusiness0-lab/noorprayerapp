import React, { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { OnboardingPersonalizedPlanDivider } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanDivider";
import { OnboardingPersonalizedPlanGoal } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanGoal";
import { OnboardingPersonalizedPlanHabitsSection } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanHabitsSection";
import { OnboardingPersonalizedPlanHero } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanHero";
import { OnboardingPersonalizedPlanMotivationSection } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanMotivationSection";
import { OnboardingPersonalizedPlanSocialProof } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanSocialProof";
import { OnboardingPersonalizedPlanValueSection } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanValueSection";
import { OnboardingPersonalizedPlanPresenter } from "@/features/onboarding/OnboardingPersonalizedPlanPresenter";
import { OnboardingAnswers } from "@/features/onboarding/onboarding.types";

interface OnboardingPersonalizedPlanStepProps {
  answers: OnboardingAnswers;
  onContinue: () => void;
}

/** Final onboarding beat: scrollable Miraj plan page before entering the app. */
export function OnboardingPersonalizedPlanStep({
  answers,
  onContinue,
}: OnboardingPersonalizedPlanStepProps) {
  const model = useMemo(
    () => OnboardingPersonalizedPlanPresenter.present(answers),
    [answers]
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, styles.contentPad]}
      showsVerticalScrollIndicator={false}
    >
      <OnboardingPersonalizedPlanHero headline={model.headline} />

      <OnboardingPersonalizedPlanGoal
        lead={model.goalLead}
        dateLabel={model.goalDateLabel}
      />

      <OnboardingPersonalizedPlanSocialProof
        caption={model.socialProofCaption}
      />

      <OnboardingPersonalizedPlanDivider />

      <OnboardingPersonalizedPlanValueSection
        graphicKind="helps"
        title={model.howTitle}
        items={model.helpItems}
        quote={model.howQuote}
      />

      <OnboardingPersonalizedPlanDivider />

      <OnboardingPersonalizedPlanValueSection
        graphicKind="protect"
        title={model.protectTitle}
        items={model.protectItems}
        quote={model.protectQuote}
      />

      <OnboardingPersonalizedPlanDivider />

      <OnboardingPersonalizedPlanHabitsSection
        title={model.habitsTitle}
        body={model.habitsBody}
        howLead={model.habitsHowLead}
        steps={model.habitSteps}
      />

      <OnboardingPersonalizedPlanDivider />

      <OnboardingPersonalizedPlanMotivationSection
        title={model.motivationTitle}
        body={model.motivationBody}
        benefits={model.motivationBenefits}
        discountTitle={model.discountTitle}
        discountBody={model.discountBody}
        discountCta={model.discountCta}
        trustLine={model.trustLine}
        onClaimDiscount={onContinue}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
    gap: 22,
  },
  /** Shell already reserves footer height; light trailing space only. */
  contentPad: {
    paddingBottom: 16,
  },
});
