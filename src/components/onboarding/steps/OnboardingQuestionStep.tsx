import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingOptionsPlacement } from "@/features/onboarding/OnboardingOptionsPlacement";
import { OnboardingMultiChoiceSelectionManager } from "@/features/onboarding/OnboardingMultiChoiceSelectionManager";
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
  const scrollable = multi || step.id === "choose-goals";

  const title = (
    <ThemedText variant="heading" style={styles.title}>
      {step.title}
    </ThemedText>
  );

  const options = (
    <View
      style={[
        styles.options,
        !scrollable && styles.optionsFill,
        !scrollable && OnboardingOptionsPlacement.resolve(step.optionsPlacement),
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
              onAnswer(
                step.id,
                OnboardingMultiChoiceSelectionManager.nextSelection(
                  selectedIds,
                  id,
                  true
                )
              );
              return;
            }
            onAnswer(step.id, id);
          }}
        />
      ) : null}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        style={styles.wrap}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {title}
        {options}
      </ScrollView>
    );
  }

  return (
    <View style={styles.wrap}>
      {title}
      {options}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    marginBottom: 48,
    paddingHorizontal: 8,
    fontSize: 26,
    lineHeight: 34,
  },
  options: {
    paddingBottom: 16,
  },
  optionsFill: {
    flex: 1,
  },
});
