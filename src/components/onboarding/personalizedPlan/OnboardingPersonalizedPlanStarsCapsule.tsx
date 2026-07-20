import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";

interface OnboardingPersonalizedPlanStarsCapsuleProps {
  size?: number;
}

/** Soft star capsule used under benefit lists and quotes. */
export function OnboardingPersonalizedPlanStarsCapsule({
  size = 13,
}: OnboardingPersonalizedPlanStarsCapsuleProps) {
  return (
    <View style={styles.capsule}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Ionicons key={index} name="star" size={size} color={Theme.star} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  capsule: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 3,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Theme.capsuleFill,
  },
});
