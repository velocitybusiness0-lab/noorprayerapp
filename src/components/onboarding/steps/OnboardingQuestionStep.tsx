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
  onAnswer: (stepId: string, value: string | string[]) => void;
}

function readMultiSelected(
  answers: OnboardingAnswers,
  stepId: string
): string[] {
  const value = answers[stepId];
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.length > 0) return [value];
  return [];
}

/** Single- or multi-select question with list-style answer rows. */
export function OnboardingQuestionStep({
  step,
  answers,
  onAnswer,
}: OnboardingQuestionStepProps) {
  const multi = step.selectionMode === "multi";
  const selectedIds = readMultiSelected(answers, step.id);
  const selectedId = selectedIds[0];

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
            multi={multi}
            options={step.options}
            spacing={step.optionSpacing}
            selectedId={selectedId}
            selectedIds={selectedIds}
            onSelect={(id) => {
              if (multi) {
                const next = selectedIds.includes(id)
                  ? selectedIds.filter((item) => item !== id)
                  : [...selectedIds, id];
                onAnswer(step.id, next);
                return;
              }
              onAnswer(step.id, id);
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
    fontSize: 22,
    lineHeight: 28,
  },
  options: {
    flex: 1,
    paddingBottom: 16,
  },
});
