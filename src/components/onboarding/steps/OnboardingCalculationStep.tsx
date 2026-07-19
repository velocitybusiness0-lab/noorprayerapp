import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingCalculationChecklistProgress } from "@/features/onboarding/OnboardingCalculationChecklistProgress";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";
import { OnboardingCalculationChecklist } from "./OnboardingCalculationChecklist";
import { OnboardingCalculationQuoteRotator } from "./OnboardingCalculationQuoteRotator";

interface OnboardingCalculationStepProps {
  step: OnboardingStep;
  onComplete: () => void;
  onHeaderProgress?: (value: number) => void;
}

const DEFAULT_DURATION_MS = 6000;
const QUOTE_INTERVAL_MS = 2000;
const HEADER_TICK_MS = 50;

/** Plan build with rotating faith quotes, a progress bar, and a timed checklist. */
export function OnboardingCalculationStep({
  step,
  onComplete,
  onHeaderProgress,
}: OnboardingCalculationStepProps) {
  const theme = useTheme();
  const quotes = step.calculationQuotes ?? [];
  const tasks = step.calculationTasks ?? [];
  const totalMs = step.calculationDurationMs ?? DEFAULT_DURATION_MS;
  const progress = useSharedValue(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [checklistStatuses, setChecklistStatuses] = useState(() =>
    new OnboardingCalculationChecklistProgress(tasks.length, totalMs).statusAt(0)
  );
  const onCompleteRef = useRef(onComplete);
  const onHeaderProgressRef = useRef(onHeaderProgress);

  const checklistProgress = useMemo(
    () => new OnboardingCalculationChecklistProgress(tasks.length, totalMs),
    [tasks.length, totalMs]
  );

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onHeaderProgressRef.current = onHeaderProgress;
  });

  useEffect(() => {
    progress.value = 0;
    setQuoteIndex(0);
    setChecklistStatuses(checklistProgress.statusAt(0));
    onHeaderProgressRef.current?.(0);

    progress.value = withTiming(1, { duration: totalMs, easing: Easing.linear });

    const startedAt = Date.now();
    const headerTimer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const value = Math.min(elapsed / totalMs, 1);
      onHeaderProgressRef.current?.(value);
    }, HEADER_TICK_MS);

    const checklistTimer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setChecklistStatuses(checklistProgress.statusAt(elapsed));
    }, OnboardingCalculationChecklistProgress.tickMs);

    const quoteTimers = Array.from({ length: quotes.length }, (_, index) => {
      if (index === 0) return null;
      return setTimeout(() => setQuoteIndex(index), index * QUOTE_INTERVAL_MS);
    });

    const done = setTimeout(() => {
      clearInterval(headerTimer);
      clearInterval(checklistTimer);
      setChecklistStatuses(checklistProgress.statusAt(totalMs));
      onHeaderProgressRef.current?.(1);
      onCompleteRef.current();
    }, totalMs);

    return () => {
      clearInterval(headerTimer);
      clearInterval(checklistTimer);
      quoteTimers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
      clearTimeout(done);
    };
  }, [checklistProgress, progress, quotes.length, step.id, totalMs]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const activeQuote = quotes[quoteIndex];

  return (
    <View style={styles.wrap}>
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
      </View>

      <OnboardingCalculationChecklist tasks={tasks} statuses={checklistStatuses} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 24,
  },
  fallback: {
    minHeight: 132,
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    color: ONBOARDING_INK,
    textAlign: "center",
  },
  progressBlock: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
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
});
