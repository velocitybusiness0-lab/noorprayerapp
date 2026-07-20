import React from "react";
import { StyleSheet, View } from "react-native";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import {
  OnboardingAnswers,
  OnboardingStep,
} from "@/features/onboarding/onboarding.types";
import { OnboardingQuestionStep } from "./steps/OnboardingQuestionStep";
import { OnboardingComparisonStep } from "./steps/OnboardingComparisonStep";
import { OnboardingMissedSliderStep } from "./steps/OnboardingMissedSliderStep";
import { OnboardingMissedGraphStep } from "./steps/OnboardingMissedGraphStep";
import { OnboardingFeatureSlideshowStep } from "./steps/OnboardingFeatureSlideshowStep";
import { OnboardingNameStep } from "./steps/OnboardingNameStep";
import { OnboardingMessageStep } from "./steps/OnboardingMessageStep";
import { OnboardingCalculationStep } from "./steps/OnboardingCalculationStep";
import { OnboardingDowntrendStep } from "./steps/OnboardingDowntrendStep";
import { OnboardingHopeScreenStep } from "./steps/OnboardingHopeScreenStep";
import { OnboardingSlideshowStep } from "./steps/OnboardingSlideshowStep";
import { OnboardingStreakStep } from "./steps/OnboardingStreakStep";
import { OnboardingCommitmentStep } from "./steps/OnboardingCommitmentStep";
import { OnboardingBenefitsGraphStep } from "./steps/OnboardingBenefitsGraphStep";
import { OnboardingPersonalizedPlanStep } from "./steps/OnboardingPersonalizedPlanStep";
import { OnboardingNameAnswerKeys } from "@/features/onboarding/OnboardingNameAnswerKeys";

interface OnboardingStepContentProps {
  step: OnboardingStep;
  answers: OnboardingAnswers;
  onAnswer: (stepId: string, value: string | string[] | number) => void;
  onCalculationComplete?: () => void;
  onCalculationProgress?: (value: number) => void;
  slideshowIndex?: number;
  onActiveSlideChange?: (index: number) => void;
  onComparisonAnimationComplete?: () => void;
  onTypingComplete?: () => void;
  onCommitmentLockIn?: () => void;
  onContinue?: () => void;
}

/** Routes each onboarding step to its focused renderer. */
export function OnboardingStepContent({
  step,
  answers,
  onAnswer,
  onCalculationComplete,
  onCalculationProgress,
  slideshowIndex = 0,
  onActiveSlideChange,
  onComparisonAnimationComplete,
  onTypingComplete,
  onCommitmentLockIn,
  onContinue,
}: OnboardingStepContentProps) {
  if (step.type === "welcome") {
    return <OnboardingWelcomeStep step={step} />;
  }

  if (step.type === "multi-choice") {
    return (
      <OnboardingQuestionStep step={step} answers={answers} onAnswer={onAnswer} />
    );
  }

  if (step.type === "message") {
    return (
      <OnboardingMessageStep step={step} onTypingComplete={onTypingComplete} />
    );
  }

  if (step.type === "comparison") {
    return (
      <OnboardingComparisonStep
        step={step}
        onAnimationComplete={onComparisonAnimationComplete}
      />
    );
  }

  if (step.type === "slider") {
    const value =
      typeof answers[step.id] === "number" ? (answers[step.id] as number) : step.min ?? 0;
    return (
      <OnboardingMissedSliderStep
        step={step}
        value={value}
        onChange={(next) => onAnswer(step.id, next)}
      />
    );
  }

  if (step.type === "missed-graph") {
    return <OnboardingMissedGraphStep step={step} answers={answers} />;
  }

  if (step.type === "feature-slideshow") {
    return <OnboardingFeatureSlideshowStep step={step} />;
  }

  if (step.type === "name") {
    const name = (answers[step.id] as string | undefined) ?? "";
    const age = (answers[OnboardingNameAnswerKeys.age] as string | undefined) ?? "";
    return (
      <OnboardingNameStep
        step={step}
        nameValue={name}
        ageValue={age}
        onNameChange={(text) => onAnswer(step.id, text.trimStart())}
        onAgeChange={(text) =>
          onAnswer(OnboardingNameAnswerKeys.age, text.replace(/[^0-9]/g, ""))
        }
      />
    );
  }

  if (step.type === "calculation") {
    return (
      <OnboardingCalculationStep
        step={step}
        onComplete={() => onCalculationComplete?.()}
        onHeaderProgress={onCalculationProgress}
      />
    );
  }

  if (step.type === "downtrend") {
    return <OnboardingDowntrendStep step={step} />;
  }

  if (step.type === "slideshow") {
    return (
      <OnboardingSlideshowStep
        step={step}
        activeSlideIndex={slideshowIndex}
        onActiveSlideChange={onActiveSlideChange}
      />
    );
  }

  if (step.type === "hope-screen") {
    return (
      <OnboardingHopeScreenStep
        step={step}
        onTypingComplete={onTypingComplete}
      />
    );
  }

  if (step.type === "streak") {
    return <OnboardingStreakStep step={step} />;
  }

  if (step.type === "commitment") {
    return (
      <OnboardingCommitmentStep
        step={step}
        onLockIn={() => onCommitmentLockIn?.()}
      />
    );
  }

  if (step.type === "benefits-graph") {
    return <OnboardingBenefitsGraphStep step={step} />;
  }

  if (step.type === "personalized-plan") {
    return (
      <OnboardingPersonalizedPlanStep
        answers={answers}
        onContinue={() => onContinue?.()}
      />
    );
  }

  return null;
}

function OnboardingWelcomeStep({ step }: { step: OnboardingStep }) {
  return (
    <View style={styles.center}>
      <ThemedText variant="display" style={styles.inkCenter}>
        {step.title}
      </ThemedText>
      {step.body ? (
        <ThemedText variant="body" style={styles.inkBody}>
          {step.body}
        </ThemedText>
      ) : null}
    </View>
  );
}

const ink = { color: ONBOARDING_INK };

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    gap: 16,
  },
  inkCenter: {
    ...ink,
    textAlign: "center",
  },
  inkBody: {
    ...ink,
    textAlign: "center",
    maxWidth: 320,
    opacity: 0.75,
  },
});
