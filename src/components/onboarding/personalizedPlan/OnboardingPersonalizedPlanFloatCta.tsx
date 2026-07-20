import React from "react";
import { StyleSheet, View } from "react-native";
import { ImpactFeedbackStyle } from "expo-haptics";
import { Pressable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPersonalizedPlanBottomFade } from "@/components/onboarding/personalizedPlan/OnboardingPersonalizedPlanBottomFade";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";

interface OnboardingPersonalizedPlanFloatCtaProps {
  label: string;
  trustLine: string;
  onContinue: () => void;
}

/**
 * Sage CTA that floats over scroll content near the bottom
 * (not shell-anchored). Trust line sits under the pill.
 */
export function OnboardingPersonalizedPlanFloatCta({
  label,
  trustLine,
  onContinue,
}: OnboardingPersonalizedPlanFloatCtaProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.overlay, { paddingBottom: Math.max(insets.bottom, 10) + 8 }]}
    >
      <OnboardingPersonalizedPlanBottomFade />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => {
          haptics.impact(ImpactFeedbackStyle.Medium);
          onContinue();
        }}
        style={({ pressed }) => [
          styles.cta,
          {
            opacity: pressed ? 0.94 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          },
        ]}
      >
        <ThemedText variant="bodyStrong" style={styles.ctaLabel}>
          {label}
        </ThemedText>
      </Pressable>
      <ThemedText variant="caption" style={styles.trust}>
        {trustLine}
      </ThemedText>
    </View>
  );
}

/** Scroll padding so legal links stay reachable above the float. */
export class OnboardingPersonalizedPlanFloatCtaLayout {
  static readonly scrollBottomPadding = 118;
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    gap: 10,
    paddingTop: 12,
    zIndex: 20,
  },
  cta: {
    zIndex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 54,
    borderRadius: 999,
    backgroundColor: Theme.accent,
  },
  ctaLabel: Type.style({
    color: Theme.onCheckFill,
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: -0.1,
  }),
  trust: Type.style({
    color: Theme.softMuted,
    textAlign: "center",
    fontSize: 13,
    letterSpacing: 0.1,
  }),
});
