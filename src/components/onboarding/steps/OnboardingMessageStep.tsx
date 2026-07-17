import React from "react";
import { StyleSheet, View } from "react-native";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingMessageStepProps {
  step: OnboardingStep;
}

/** Centered full-page message — no card box. */
export function OnboardingMessageStep({ step }: OnboardingMessageStepProps) {
  return (
    <View style={styles.center}>
      <ThemedText variant="title" style={styles.title}>
        {step.title}
      </ThemedText>
      {step.body ? (
        <ThemedText variant="body" style={styles.body}>
          {step.body}
        </ThemedText>
      ) : null}
      {step.checks?.map((line) => (
        <ThemedText key={line} variant="bodyStrong" style={styles.check}>
          ✓ {line}
        </ThemedText>
      ))}
    </View>
  );
}

const ink = { color: ONBOARDING_INK };

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 14,
  },
  title: {
    ...ink,
    textAlign: "center",
  },
  body: {
    ...ink,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 24,
  },
  check: {
    ...ink,
    textAlign: "center",
  },
});
