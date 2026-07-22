import React from "react";
import { OnboardingAnswers } from "@/features/onboarding/onboarding.types";
import { useSuperwallOnboardingPaywallPresenter } from "@/features/subscriptions/useSuperwallOnboardingPaywallPresenter";
import { OnboardingPersonalizedPlanStepView } from "./OnboardingPersonalizedPlanStepView";

interface OnboardingPersonalizedPlanStepWithSuperwallProps {
  answers: OnboardingAnswers;
  onPaywallContinue: () => void;
}

/**
 * Superwall-backed personalized plan CTAs. Lazy-required only when the native
 * module is linked so Metro does not evaluate expo-superwall at boot.
 */
export function OnboardingPersonalizedPlanStepWithSuperwall({
  answers,
  onPaywallContinue,
}: OnboardingPersonalizedPlanStepWithSuperwallProps) {
  const { presentOnboardingPaywall, isPresenting } =
    useSuperwallOnboardingPaywallPresenter(onPaywallContinue);

  return (
    <OnboardingPersonalizedPlanStepView
      answers={answers}
      disabled={isPresenting}
      onStartPlan={() => {
        void presentOnboardingPaywall();
      }}
    />
  );
}
