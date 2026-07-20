import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanTextSegment } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";

interface OnboardingPersonalizedPlanSegmentedTextProps {
  segments: readonly PersonalizedPlanTextSegment[];
}

/** Renders checklist copy with selective bold segments. */
export function OnboardingPersonalizedPlanSegmentedText({
  segments,
}: OnboardingPersonalizedPlanSegmentedTextProps) {
  return (
    <ThemedText variant="body" style={styles.base}>
      {segments.map((segment, index) => (
        <ThemedText
          key={`${segment.text}-${index}`}
          variant="body"
          style={segment.bold ? styles.bold : styles.regular}
        >
          {segment.text}
        </ThemedText>
      ))}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  base: Type.style({
    color: Theme.ink,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.15,
  }),
  regular: Type.style({
    color: Theme.ink,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "400",
  }),
  bold: Type.style({
    color: Theme.ink,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
  }),
});
