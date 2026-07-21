import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";

interface OnboardingPersonalizedPlanTopSectionProps {
  headline: string;
  lead: string;
}

/** Checkmark, custom-plan headline, and short empathy lead. */
export function OnboardingPersonalizedPlanTopSection({
  headline,
  lead,
}: OnboardingPersonalizedPlanTopSectionProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.check}>
        <Ionicons name="checkmark" size={26} color={Theme.onCheckFill} />
      </View>
      <ThemedText variant="heading" style={styles.headline}>
        {headline}
      </ThemedText>
      <ThemedText variant="body" style={styles.lead}>
        {lead}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 12,
    paddingTop: 4,
    paddingHorizontal: 6,
    paddingBottom: 0,
  },
  check: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Theme.checkFill,
    alignItems: "center",
    justifyContent: "center",
  },
  headline: Type.style({
    color: Theme.ink,
    textAlign: "center",
    paddingHorizontal: 10,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "600",
    letterSpacing: -0.35,
  }),
  lead: Type.style({
    color: Theme.muted,
    textAlign: "center",
    lineHeight: 23,
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: -0.15,
    paddingHorizontal: 4,
  }),
});
