import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { OnboardingSlideGraphicCatalog } from "@/features/onboarding/OnboardingSlideGraphicCatalog";
import { OnboardingSlideGraphicType } from "@/features/onboarding/onboarding.types";

interface OnboardingSlideGraphicProps {
  type: OnboardingSlideGraphicType;
}

/** Bundled illustrations for urgency / hope / Miraj welcome slideshow slides. */
export function OnboardingSlideGraphic({ type }: OnboardingSlideGraphicProps) {
  const frame = OnboardingSlideGraphicCatalog.frameSizeFor(type);

  return (
    <View style={[styles.frame, { width: frame.width, height: frame.height }]}>
      <Image
        source={OnboardingSlideGraphicCatalog.sourceFor(type)}
        style={styles.image}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
