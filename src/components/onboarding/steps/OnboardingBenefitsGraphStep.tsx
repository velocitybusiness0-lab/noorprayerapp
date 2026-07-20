import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingBenefitsComparisonChartHost } from "@/components/onboarding/OnboardingBenefitsComparisonChart";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingBenefitsGraphStepProps {
  step: OnboardingStep;
}

/** Cream/white prayer-consistency chart with lowered content rhythm. */
export function OnboardingBenefitsGraphStep({ step }: OnboardingBenefitsGraphStepProps) {
  return (
    <View style={styles.wrap}>
      <ThemedText variant="heading" style={styles.title}>
        {step.title}
      </ThemedText>

      <View style={styles.chartWrap}>
        <OnboardingBenefitsComparisonChartHost />
      </View>

      {step.footer ? (
        <ThemedText variant="body" style={styles.footer}>
          {step.footer}
        </ThemedText>
      ) : step.body ? (
        <ThemedText variant="body" style={styles.footer}>
          {step.body}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 24,
    gap: 18,
  },
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  chartWrap: {
    width: "100%",
  },
  footer: {
    color: ONBOARDING_INK,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
