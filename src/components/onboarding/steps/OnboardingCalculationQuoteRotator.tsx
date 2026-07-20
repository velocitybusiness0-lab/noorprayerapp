import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingCalculationQuote } from "@/features/onboarding/onboarding.types";

interface OnboardingCalculationQuoteRotatorProps {
  quote: OnboardingCalculationQuote;
}

/** Single faith quote with a gentle cross-fade when the index changes. */
export function OnboardingCalculationQuoteRotator({
  quote,
}: OnboardingCalculationQuoteRotatorProps) {
  return (
    <View style={styles.slot}>
      <Animated.View
        key={quote.title}
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(350)}
        style={styles.quote}
      >
        <ThemedText variant="bodyStrong" style={styles.title}>
          {`\u201c${quote.title}\u201d`}
        </ThemedText>
        {quote.source ? (
          <ThemedText variant="caption" style={styles.source}>
            - {quote.source}
          </ThemedText>
        ) : null}
      </Animated.View>
    </View>
  );
}

const ink = { color: ONBOARDING_INK };

const styles = StyleSheet.create({
  slot: {
    minHeight: 140,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  quote: {
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 4,
    maxWidth: 380,
  },
  title: {
    ...ink,
    textAlign: "center",
    fontSize: 20,
    lineHeight: 28,
  },
  source: {
    ...ink,
    textAlign: "center",
    opacity: 0.58,
  },
});
