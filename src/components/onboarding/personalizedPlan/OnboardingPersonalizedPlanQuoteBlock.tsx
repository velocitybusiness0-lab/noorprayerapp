import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanQuote } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanStarsCapsule } from "./OnboardingPersonalizedPlanStarsCapsule";

interface OnboardingPersonalizedPlanQuoteBlockProps {
  quote: PersonalizedPlanQuote;
}

/** Stars capsule + short anonymous salah quote. */
export function OnboardingPersonalizedPlanQuoteBlock({
  quote,
}: OnboardingPersonalizedPlanQuoteBlockProps) {
  return (
    <View style={styles.wrap}>
      <OnboardingPersonalizedPlanStarsCapsule />
      <View style={styles.card}>
        <ThemedText variant="body" style={styles.quote}>
          “{quote.quote}”
        </ThemedText>
        <ThemedText variant="caption" style={styles.attribution}>
          {quote.attribution}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    gap: 14,
    alignItems: "center",
  },
  card: {
    width: "100%",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: Theme.quoteSurface,
    gap: 10,
    alignItems: "center",
  },
  quote: {
    color: Theme.ink,
    textAlign: "center",
    lineHeight: 24,
  },
  attribution: {
    color: Theme.softMuted,
    textAlign: "center",
  },
});
