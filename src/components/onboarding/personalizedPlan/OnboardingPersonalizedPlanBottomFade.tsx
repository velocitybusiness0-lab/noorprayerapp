import React from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";

/** Soft cream fade + light blur under the float CTA. */
export class OnboardingPersonalizedPlanBottomFadeLayout {
  static readonly height = 108;
  static readonly blurIntensity = 12;
  /** Matches `OnboardingShell` content horizontal padding for edge bleed. */
  static readonly shellSideInset = 20;
}

/**
 * Non-interactive cream vignette at the screen bottom so scroll content
 * softens under the floating Start-my-plan CTA.
 */
export function OnboardingPersonalizedPlanBottomFade() {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.root,
        {
          height: OnboardingPersonalizedPlanBottomFadeLayout.height,
          marginHorizontal: -OnboardingPersonalizedPlanBottomFadeLayout.shellSideInset,
        },
      ]}
    >
      <BlurView
        intensity={OnboardingPersonalizedPlanBottomFadeLayout.blurIntensity}
        tint="light"
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[...Theme.bottomFadeColors]}
        locations={[...Theme.bottomFadeLocations]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});
