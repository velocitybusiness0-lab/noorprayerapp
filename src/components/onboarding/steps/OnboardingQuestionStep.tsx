import React from "react";
import { StyleSheet, View } from "react-native";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingOptionGrid } from "../OnboardingOptionGrid";
import { OnboardingAnswers, OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingQuestionStepProps {
  step: OnboardingStep;
  answers: OnboardingAnswers;
  onAnswer: (stepId: string, value: string[]) => void;
}

/** Multi select question with title lower on screen. */
export function OnboardingQuestionStep({ step, answers, onAnswer }: OnboardingQuestionStepProps) {
  const selected = (answers[step.id] as string[] | undefined) ?? [];

  return (
    <View style={styles.wrap}>
      <ThemedText variant="heading" style={styles.title}>
        {step.title}
      </ThemedText>
      <View style={styles.options}>
        {step.options ? (
          <OnboardingOptionGrid
            multi
            options={step.options}
            layout={step.layout ?? "grid-2x2"}
            spacing={step.optionSpacing}
            selectedIds={selected}
            onSelect={(id) => {
              const next = selected.includes(id)
                ? selected.filter((item) => item !== id)
                : [...selected, id];
              onAnswer(step.id, next);
            }}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: "100%",
    paddingTop: 48,
  },
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  options: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 16,
  },
});
