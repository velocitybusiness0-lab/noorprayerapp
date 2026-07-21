import React from "react";
import { Image, StyleSheet } from "react-native";
import { OnboardingPersonalizedPlanStarsLaurelsCatalog as Catalog } from "@/features/onboarding/OnboardingPersonalizedPlanStarsLaurelsCatalog";

interface OnboardingPersonalizedPlanStarsLaurelsProps {
  width?: number;
}

/** Centered stars + laurels graphic above the benefits headline. */
export function OnboardingPersonalizedPlanStarsLaurels({
  width = 268,
}: OnboardingPersonalizedPlanStarsLaurelsProps) {
  const height = Math.round(width / Catalog.aspectRatio);

  return (
    <Image
      source={Catalog.source}
      style={[styles.image, { width, height }]}
      resizeMode="contain"
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: "center",
  },
});
