import React from "react";
import { OnboardingAnswers } from "@/features/onboarding/onboarding.types";
import { superwallManager } from "@/features/subscriptions/SuperwallManager";
import { OnboardingPersonalizedPlanStepSoft } from "./OnboardingPersonalizedPlanStepSoft";

interface OnboardingPersonalizedPlanStepProps {
  answers: OnboardingAnswers;
  onPaywallContinue: () => void;
}

/**
 * Pre-paywall conversion page.
 * Primary CTA presents Superwall `onboarding_paywall`.
 * Superwall UI is lazy-required so a missing native module does not crash boot.
 */
export function OnboardingPersonalizedPlanStep({
  answers,
  onPaywallContinue,
}: OnboardingPersonalizedPlanStepProps) {
  if (superwallManager.canPresentPaywalls()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { OnboardingPersonalizedPlanStepWithSuperwall } =
      require("./OnboardingPersonalizedPlanStepSuperwall") as typeof import("./OnboardingPersonalizedPlanStepSuperwall");
    return (
      <OnboardingPersonalizedPlanStepWithSuperwall
        answers={answers}
        onPaywallContinue={onPaywallContinue}
      />
    );
  }

  return (
    <OnboardingPersonalizedPlanStepSoft
      answers={answers}
      onPaywallContinue={onPaywallContinue}
    />
  );
}
