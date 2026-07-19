import React from "react";
import { StyleSheet, View } from "react-native";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingOptionsPlacement } from "@/features/onboarding/OnboardingOptionsPlacement";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingOptionList } from "../OnboardingOptionList";
import { OnboardingAnswers, OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingQuestionStepProps {
  step: OnboardingStep;
  answers: OnboardingAnswers;
  onAnswer: (stepId: string, value: string[]) => void;
}

/** Multi/single select question with list-style answer rows. */
export function OnboardingQuestionStep({
  step,
  answers,
  onAnswer,
}: OnboardingQuestionStepProps) {
  const selected = (answers[step.id] as string[] | undefined) ?? [];

  return (
    <View style={styles.wrap}>
      <ThemedText variant="heading" style={styles.title}>
        {step.title}
      </ThemedText>
      <View
        style={[
          styles.options,
          OnboardingOptionsPlacement.resolve(step.optionsPlacement),
        ]}
      >
        {step.options ? (
          <OnboardingOptionList
            multi
            options={step.options}
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
  },
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    marginBottom: 48,
    paddingHorizontal: 8,
  },
  options: {
    flex: 1,
    paddingBottom: 16,
  },
});
