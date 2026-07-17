import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/core/theme";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";
import { OnboardingCalculationQuoteRotator } from "./OnboardingCalculationQuoteRotator";

interface OnboardingCalculationStepProps {
  step: OnboardingStep;
  onComplete: () => void;
  onHeaderProgress?: (value: number) => void;
}

const DEFAULT_DURATION_MS = 6000;
const QUOTE_INTERVAL_MS = 2000;
const HEADER_TICK_MS = 50;

/** Plan build with a linear progress bar and cross-fading faith quotes. */
export function OnboardingCalculationStep({
  step,
  onComplete,
  onHeaderProgress,
}: OnboardingCalculationStepProps) {
  const theme = useTheme();
  const quotes = step.calculationQuotes ?? [];
  const totalMs = step.calculationDurationMs ?? DEFAULT_DURATION_MS;
  const progress = useSharedValue(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const onHeaderProgressRef = useRef(onHeaderProgress);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onHeaderProgressRef.current = onHeaderProgress;
  });

  useEffect(() => {
    progress.value = 0;
    setQuoteIndex(0);
    onHeaderProgressRef.current?.(0);

    progress.value = withTiming(1, { duration: totalMs, easing: Easing.linear });

    const startedAt = Date.now();
    const headerTimer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const value = Math.min(elapsed / totalMs, 1);
      onHeaderProgressRef.current?.(value);
    }, HEADER_TICK_MS);

    const quoteTimers = Array.from({ length: quotes.length }, (_, index) => {
      if (index === 0) return null;
      return setTimeout(() => setQuoteIndex(index), index * QUOTE_INTERVAL_MS);
    });

    const done = setTimeout(() => {
      clearInterval(headerTimer);
      onHeaderProgressRef.current?.(1);
      onCompleteRef.current();
    }, totalMs);

    return () => {
      clearInterval(headerTimer);
      quoteTimers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
      clearTimeout(done);
    };
  }, [progress, quotes.length, step.id, totalMs]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const activeQuote = quotes[quoteIndex];

  return (
    <View style={styles.wrap}>
      <ThemedText variant="caption" style={styles.kicker}>
        {step.title}
      </ThemedText>

      {activeQuote ? (
        <OnboardingCalculationQuoteRotator key={quoteIndex} quote={activeQuote} />
      ) : (
        <View style={styles.fallback}>
          <ThemedText variant="body" style={styles.fallbackText}>
            Preparing your plan…
          </ThemedText>
        </View>
      )}

      <View style={styles.progressBlock}>
        <View style={[styles.track, { backgroundColor: theme.colors.hairline }]}>
          <Animated.View
            style={[styles.fill, { backgroundColor: ONBOARDING_INK }, barStyle]}
          />
        </View>
        <ThemedText variant="caption" style={styles.stepLabel}>
          {`${Math.min(quoteIndex + 1, quotes.length)} of ${quotes.length}`}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 28,
  },
  kicker: {
    color: ONBOARDING_INK,
    opacity: 0.55,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  fallback: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    color: ONBOARDING_INK,
    textAlign: "center",
  },
  progressBlock: {
    width: "100%",
    maxWidth: 280,
    alignItems: "center",
    gap: 10,
  },
  track: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  stepLabel: {
    color: ONBOARDING_INK,
    opacity: 0.55,
  },
});
