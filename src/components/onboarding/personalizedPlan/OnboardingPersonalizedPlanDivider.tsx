import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";

interface OnboardingPersonalizedPlanDividerProps {
  /** Tighter vertical padding (e.g. top → benefits). */
  compact?: boolean;
}

/** Soft faded sage rule between major plan sections. */
export function OnboardingPersonalizedPlanDivider({
  compact = false,
}: OnboardingPersonalizedPlanDividerProps) {
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <LinearGradient
        colors={[Theme.dividerFade, Theme.divider, Theme.dividerFade]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.line}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 8,
  },
  wrapCompact: {
    paddingVertical: 4,
  },
  line: {
    width: "58%",
    height: StyleSheet.hairlineWidth * 2,
    borderRadius: 1,
  },
});
