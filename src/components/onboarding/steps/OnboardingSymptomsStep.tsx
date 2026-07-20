import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingSymptomsCatalog } from "@/features/onboarding/catalog/OnboardingSymptomsCatalog";
import { OnboardingAnswers, OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingSymptomsStepProps {
  step: OnboardingStep;
  answers: OnboardingAnswers;
  onAnswer: (stepId: string, value: string[]) => void;
}

function readSelected(answers: OnboardingAnswers, stepId: string): string[] {
  const value = answers[stepId];
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

/** Multi-select symptom checklist grouped by category. */
export function OnboardingSymptomsStep({
  step,
  answers,
  onAnswer,
}: OnboardingSymptomsStepProps) {
  const selected = readSelected(answers, step.id);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
    const timer = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(timer);
  }, [step.id]);

  const toggle = useCallback(
    (symptomId: string) => {
      haptics.selection();
      const next = selected.includes(symptomId)
        ? selected.filter((id) => id !== symptomId)
        : [...selected, symptomId];
      onAnswer(step.id, next);
    },
    [onAnswer, selected, step.id]
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {step.title ? (
        <Animated.View entering={revealed ? FadeIn.duration(300) : undefined}>
          <ThemedText variant="heading" style={styles.title}>
            {step.title}
          </ThemedText>
        </Animated.View>
      ) : null}

      <Animated.View
        entering={revealed ? FadeIn.duration(300).delay(100) : undefined}
        style={styles.warningBox}
      >
        <ThemedText variant="bodyStrong" style={styles.warningText}>
          {OnboardingSymptomsCatalog.warningCopy}
        </ThemedText>
      </Animated.View>

      <Animated.View entering={revealed ? FadeIn.duration(300).delay(200) : undefined}>
        <ThemedText variant="body" style={styles.instruction}>
          {OnboardingSymptomsCatalog.instructionCopy}
        </ThemedText>
      </Animated.View>

      <View style={styles.categories}>
        {OnboardingSymptomsCatalog.categories.map((category, categoryIndex) => (
          <Animated.View
            key={category.id}
            entering={
              revealed ? FadeIn.duration(300).delay(300 + categoryIndex * 100) : undefined
            }
            style={styles.categoryBlock}
          >
            <ThemedText variant="bodyStrong" style={styles.categoryTitle}>
              {category.title}
            </ThemedText>
            <View style={styles.symptomList}>
              {category.symptoms.map((symptom) => {
                const active = selected.includes(symptom.id);
                return (
                  <SymptomRow
                    key={symptom.id}
                    label={symptom.label}
                    active={active}
                    onPress={() => toggle(symptom.id)}
                  />
                );
              })}
            </View>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

function SymptomRow({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.symptomRow, active && styles.symptomRowActive]}
    >
      <View style={[styles.checkbox, active && styles.checkboxActive]}>
        {active ? <Ionicons name="checkmark" size={12} color="#FFFFFF" /> : null}
      </View>
      <ThemedText variant="body" style={[styles.symptomLabel, active && styles.symptomLabelActive]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, width: "100%" },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 24,
    gap: 16,
  },
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    fontSize: 26,
    lineHeight: 32,
  },
  warningBox: {
    borderWidth: 2,
    borderColor: "#FECACA",
    borderRadius: 12,
    backgroundColor: "rgba(220,38,38,0.08)",
    padding: 16,
  },
  warningText: {
    color: ONBOARDING_INK,
    lineHeight: 20,
  },
  instruction: {
    color: ONBOARDING_INK,
    fontWeight: "600",
  },
  categories: {
    gap: 24,
  },
  categoryBlock: {
    gap: 12,
  },
  categoryTitle: {
    color: ONBOARDING_INK,
    textAlign: "center",
    fontSize: 17,
  },
  symptomList: {
    gap: 12,
  },
  symptomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(61,56,50,0.06)",
  },
  symptomRowActive: {
    backgroundColor: "#DC2626",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(61,56,50,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    borderColor: "#FFFFFF",
  },
  symptomLabel: {
    color: ONBOARDING_INK,
    flex: 1,
    lineHeight: 20,
  },
  symptomLabelActive: {
    color: "#FFFFFF",
  },
});
