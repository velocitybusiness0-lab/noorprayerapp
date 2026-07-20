import React from "react";
import { Image, StyleSheet } from "react-native";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import {
  OnboardingRatingLaurelCatalog,
  OnboardingRatingLaurelSide,
} from "@/features/onboarding/OnboardingRatingVisuals";

export type { OnboardingRatingLaurelSide };

interface OnboardingRatingLaurelProps {
  side: OnboardingRatingLaurelSide;
  size?: number;
}

/**
 * App Store–style laurel flanking the rating stars.
 * Uses transparent PNG silhouettes (left/right assets as provided).
 */
export function OnboardingRatingLaurel({
  side,
  size = 34,
}: OnboardingRatingLaurelProps) {
  const aspect = side === "leading" ? 91 / 166 : 96 / 171;
  const height = size;
  const width = Math.round(height * aspect);

  return (
    <Image
      source={OnboardingRatingLaurelCatalog.sourceFor(side)}
      style={[styles.laurel, { width, height, tintColor: ONBOARDING_INK }]}
      resizeMode="contain"
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}

const styles = StyleSheet.create({
  laurel: {
    opacity: 0.78,
  },
});
