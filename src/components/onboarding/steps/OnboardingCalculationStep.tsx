import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ImpactFeedbackStyle } from "expo-haptics";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { haptics } from "@/core/haptics/HapticsManager";
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

/** Plan build with quotes, percentage, haptic milestones, and checklist. */
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
  const [percentLabel, setPercentLabel] = useState(0);
  const [checklistStatuses, setChecklistStatuses] = useState(() =>
    new OnboardingCalculationChecklistProgress(tasks.length, totalMs).statusAt(0)
  );
  const onCompleteRef = useRef(onComplete);
  const onHeaderProgressRef = useRef(onHeaderProgress);
  const completedTasksRef = useRef(0);

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
    setPercentLabel(0);
    completedTasksRef.current = 0;
    setChecklistStatuses(checklistProgress.statusAt(0));
    onHeaderProgressRef.current?.(0);

    progress.value = withTiming(1, { duration: totalMs, easing: Easing.linear });

    const startedAt = Date.now();
    const headerTimer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const value = Math.min(elapsed / totalMs, 1);
      setPercentLabel(Math.round(value * 100));
      onHeaderProgressRef.current?.(value);
    }, HEADER_TICK_MS);

    const checklistTimer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const statuses = checklistProgress.statusAt(elapsed);
      const completed = statuses.filter((s) => s === "completed").length;
      if (completed > completedTasksRef.current) {
        completedTasksRef.current = completed;
        haptics.impact(ImpactFeedbackStyle.Light);
      }
      setChecklistStatuses(statuses);
    }, OnboardingCalculationChecklistProgress.tickMs);

    const quoteTimers = Array.from({ length: quotes.length }, (_, index) => {
      if (index === 0) return null;
      return setTimeout(() => setQuoteIndex(index), index * QUOTE_INTERVAL_MS);
    });

    const done = setTimeout(() => {
      clearInterval(headerTimer);
      clearInterval(checklistTimer);
      setChecklistStatuses(checklistProgress.statusAt(totalMs));
      setPercentLabel(100);
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
        <ThemedText variant="caption" style={styles.percent}>
          {percentLabel}%
        </ThemedText>
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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 24,
    gap: 20,
  },
  fallback: {
    minHeight: 120,
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
    gap: 8,
  },
  percent: {
    color: ONBOARDING_INK,
    opacity: 0.65,
    fontVariant: ["tabular-nums"],
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
