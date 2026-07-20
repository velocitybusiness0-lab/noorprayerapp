import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanStarsCapsule } from "./OnboardingPersonalizedPlanStarsCapsule";

interface OnboardingPersonalizedPlanSocialProofProps {
  caption: string;
}

/** Soft star capsule + qualitative social-proof caption (no fake counts). */
export function OnboardingPersonalizedPlanSocialProof({
  caption,
}: OnboardingPersonalizedPlanSocialProofProps) {
  return (
    <View style={styles.wrap}>
      <OnboardingPersonalizedPlanStarsCapsule size={14} />
      <ThemedText variant="caption" style={styles.caption}>
        {caption}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 10,
    paddingBottom: 4,
  },
  caption: {
    color: Theme.softMuted,
    textAlign: "center",
    paddingHorizontal: 16,
    lineHeight: 18,
  },
});
