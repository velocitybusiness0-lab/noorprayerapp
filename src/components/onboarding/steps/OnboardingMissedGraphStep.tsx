import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/primitives/ThemedText";
import { useLinearCountUp } from "../useLinearCountUp";
import { OnboardingMissedBarAnimationTiming } from "@/features/onboarding/OnboardingMissedBarAnimationTiming";
import { OnboardingMissedGraphTheme } from "@/features/onboarding/OnboardingMissedGraphTheme";
import { OnboardingMissedImpactCopy } from "@/features/onboarding/OnboardingMissedImpactCopy";
import { OnboardingStatsCalculator } from "@/features/onboarding/OnboardingStatsCalculator";
import { OnboardingAnswers, OnboardingStep } from "@/features/onboarding/onboarding.types";
import { OnboardingMissedGraphBar } from "./OnboardingMissedGraphBar";

interface OnboardingMissedGraphStepProps {
  step: OnboardingStep;
  answers: OnboardingAnswers;
}

const BAR_LABELS = ["Day", "Week", "Month", "Year"] as const;

/** Cream stats page — red yearly total, growing bars, calm spacing. */
export function OnboardingMissedGraphStep({ step, answers }: OnboardingMissedGraphStepProps) {
  const daily = typeof answers["missed-per-day"] === "number" ? answers["missed-per-day"] : 0;
  const stats = OnboardingStatsCalculator.fromDailyMissed(daily);
  const values = [stats.daily, stats.weekly, stats.monthly, stats.yearly];
  const maxValue = stats.yearly;
  const [animationEpoch, setAnimationEpoch] = useState(0);

  const yearlyDisplay = useLinearCountUp(stats.yearly, 1000, 100);
  const heroOpacity = useSharedValue(0);

  useEffect(() => {
    setAnimationEpoch((epoch) => epoch + 1);
    heroOpacity.value = 0;
    heroOpacity.value = withDelay(
      OnboardingMissedBarAnimationTiming.heroDelayMs,
      withTiming(1, {
        duration: OnboardingMissedBarAnimationTiming.heroFadeMs,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [daily, heroOpacity]);

  const heroStyle = useAnimatedStyle(() => ({ opacity: heroOpacity.value }));

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.centeredBlock}>
        {step.title ? (
          <ThemedText
            variant="heading"
            style={[styles.title, { color: OnboardingMissedGraphTheme.label }]}
          >
            {step.title}
          </ThemedText>
        ) : null}

        <Animated.View style={[styles.hero, heroStyle]}>
          <ThemedText
            variant="display"
            style={[styles.stat, { color: OnboardingMissedGraphTheme.totalRed }]}
          >
            {OnboardingMissedImpactCopy.formatCount(yearlyDisplay)}
          </ThemedText>
          <ThemedText
            variant="bodyStrong"
            style={[styles.statLabel, { color: OnboardingMissedGraphTheme.label }]}
          >
            {OnboardingMissedImpactCopy.yearlyMissLabel()}
          </ThemedText>
        </Animated.View>

        <View style={styles.chart}>
          {values.map((val, index) => (
            <OnboardingMissedGraphBar
              key={`${BAR_LABELS[index]}-${animationEpoch}`}
              label={BAR_LABELS[index]}
              value={val}
              maxValue={maxValue}
              delay={OnboardingMissedBarAnimationTiming.delayForIndex(index)}
            />
          ))}
        </View>

        <ThemedText
          variant="bodyStrong"
          style={[styles.duaLine, { color: OnboardingMissedGraphTheme.label }]}
        >
          {OnboardingMissedImpactCopy.missedDuaLine()}
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
    // Bias block upward so bars sit nearer vertical middle (footer sits below).
    paddingTop: 4,
    paddingBottom: 72,
  },
  centeredBlock: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 28,
  },
  hero: {
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
    width: "100%",
  },
  stat: {
    fontVariant: ["tabular-nums"],
    fontSize: 56,
    lineHeight: 60,
  },
  statLabel: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 18,
    width: "100%",
    maxWidth: 300,
    alignSelf: "center",
  },
  duaLine: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
    lineHeight: 22,
    maxWidth: 280,
  },
});
