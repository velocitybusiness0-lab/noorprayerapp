import React from "react";
import { StyleSheet, View } from "react-native";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingContentLayout } from "@/features/onboarding/OnboardingContentLayout";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";
import { OnboardingTypingReveal } from "../OnboardingTypingReveal";

interface OnboardingMessageStepProps {
  step: OnboardingStep;
  onTypingComplete?: () => void;
}

/** Full-page message — typing reveal centered; optional upper placement. */
export function OnboardingMessageStep({
  step,
  onTypingComplete,
}: OnboardingMessageStepProps) {
  const upper = step.contentPlacement === "upper";

  return (
    <View style={[styles.center, upper && styles.upper]}>
      <OnboardingTypingReveal
        title={step.title ?? ""}
        body={step.body}
        titleStyle={styles.title}
        bodyStyle={styles.body}
        onComplete={onTypingComplete}
      />
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
  upper: {
    justifyContent: "flex-start",
    paddingTop: OnboardingContentLayout.centeredContentTopPadding + 24,
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
