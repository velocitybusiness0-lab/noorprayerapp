import React, { useCallback, useMemo } from "react";
import { OnboardingAnswers } from "@/features/onboarding/onboarding.types";
import { SoftOnboardingPaywallPresenter } from "@/features/subscriptions/SoftOnboardingPaywallPresenter";
import { OnboardingPersonalizedPlanStepView } from "./OnboardingPersonalizedPlanStepView";

interface OnboardingPersonalizedPlanStepSoftProps {
  answers: OnboardingAnswers;
  onPaywallContinue: () => void;
}

/** Local trial CTAs when Superwall native module / keys are unavailable. */
export function OnboardingPersonalizedPlanStepSoft({
  answers,
  onPaywallContinue,
}: OnboardingPersonalizedPlanStepSoftProps) {
  const soft = useMemo(
    () => new SoftOnboardingPaywallPresenter(onPaywallContinue),
    [onPaywallContinue]
  );

  const onStartPlan = useCallback(() => {
    void soft.presentOnboardingPaywall();
  }, [soft]);

  return (
    <OnboardingPersonalizedPlanStepView
      answers={answers}
      onStartPlan={onStartPlan}
    />
  );
}
