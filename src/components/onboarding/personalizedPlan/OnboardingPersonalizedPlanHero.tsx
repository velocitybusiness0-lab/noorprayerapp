import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";

interface OnboardingPersonalizedPlanHeroProps {
  headline: string;
}

/** Soft glow + checkmark + personalized headline. */
export function OnboardingPersonalizedPlanHero({
  headline,
}: OnboardingPersonalizedPlanHeroProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[Theme.heroGlowStart, Theme.heroGlowEnd]}
        style={styles.glow}
        pointerEvents="none"
      />
      <View style={styles.check}>
        <Ionicons name="checkmark" size={28} color="#FFFFFF" />
      </View>
      <ThemedText variant="title" style={styles.headline}>
        {headline}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  check: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.checkFill,
    alignItems: "center",
    justifyContent: "center",
  },
  headline: {
    color: Theme.ink,
    textAlign: "center",
    paddingHorizontal: 8,
    fontSize: 26,
    lineHeight: 32,
  },
});
