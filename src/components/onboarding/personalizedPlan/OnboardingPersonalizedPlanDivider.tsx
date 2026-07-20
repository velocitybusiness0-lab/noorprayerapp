import React from "react";
import { StyleSheet, View } from "react-native";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";

/** Hairline sage divider between major plan sections. */
export function OnboardingPersonalizedPlanDivider() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: {
    width: "72%",
    alignSelf: "center",
    height: 1,
    backgroundColor: Theme.divider,
    marginVertical: 8,
  },
});
