import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/primitives/ThemedText";
import { useLinearCountUp } from "../useLinearCountUp";
import { OnboardingMissedBarFillPolicy } from "@/features/onboarding/OnboardingMissedBarFillPolicy";
import { OnboardingMissedGraphTheme } from "@/features/onboarding/OnboardingMissedGraphTheme";
import { OnboardingMissedImpactCopy } from "@/features/onboarding/OnboardingMissedImpactCopy";
import { OnboardingStatsCalculator } from "@/features/onboarding/OnboardingStatsCalculator";
import { OnboardingAnswers, OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingMissedGraphStepProps {
  step: OnboardingStep;
  answers: OnboardingAnswers;
}

const BAR_LABELS = ["Day", "Week", "Month", "Year"] as const;
const BAR_MS = 750;
const STAGGER_MS = 160;
const SUB_DELAY_MS = 520;

/** Cream stats page — red bars and red yearly total, black labels. */
export function OnboardingMissedGraphStep({ step, answers }: OnboardingMissedGraphStepProps) {
  const daily = typeof answers["missed-per-day"] === "number" ? answers["missed-per-day"] : 0;
  const stats = OnboardingStatsCalculator.fromDailyMissed(daily);
  const values = [stats.daily, stats.weekly, stats.monthly, stats.yearly];
  const [showSub, setShowSub] = useState(false);
  const [animationEpoch, setAnimationEpoch] = useState(0);

  const yearlyDisplay = useLinearCountUp(stats.yearly, 1000, 120);
  const heroOpacity = useSharedValue(0);

  useEffect(() => {
    setShowSub(false);
    setAnimationEpoch((epoch) => epoch + 1);
    heroOpacity.value = 0;
    heroOpacity.value = withDelay(80, withTiming(1, { duration: 420, easing: Easing.linear }));

    const timer = setTimeout(() => setShowSub(true), SUB_DELAY_MS);
    return () => clearTimeout(timer);
  }, [daily, heroOpacity]);

  const heroStyle = useAnimatedStyle(() => ({ opacity: heroOpacity.value }));
  const costTitle = OnboardingMissedImpactCopy.costTitle();
  const costSub = OnboardingMissedImpactCopy.costSub(daily);

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
        </Animated.View>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: OnboardingMissedGraphTheme.chartSurface,
              borderColor: OnboardingMissedGraphTheme.chartBorder,
            },
          ]}
        >
          <View style={styles.chart}>
            {values.map((val, index) => (
              <BarColumn
                key={`${BAR_LABELS[index]}-${animationEpoch}`}
                label={BAR_LABELS[index]}
                value={val}
                fillRatio={OnboardingMissedBarFillPolicy.fillRatio(val)}
                delay={200 + index * STAGGER_MS}
              />
            ))}
          </View>
        </View>

        <View style={styles.costBlock}>
          <ThemedText
            variant="bodyStrong"
            style={[styles.costTitle, { color: OnboardingMissedGraphTheme.label }]}
          >
            {costTitle}
          </ThemedText>
          <View style={styles.subSlot}>
            {showSub ? (
              <Animated.View entering={FadeIn.duration(420).easing(Easing.linear)}>
                <ThemedText
                  variant="body"
                  style={[styles.costSub, { color: OnboardingMissedGraphTheme.mutedLabel }]}
                >
                  {costSub}
                </ThemedText>
              </Animated.View>
            ) : null}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function BarColumn({
  label,
  value,
  fillRatio,
  delay,
}: {
  label: string;
  value: number;
  fillRatio: number;
  delay: number;
}) {
  const height = useSharedValue(0);
  const displayValue = useLinearCountUp(value, BAR_MS, delay);

  useEffect(() => {
    height.value = 0;
    height.value = withDelay(
      delay,
      withTiming(fillRatio, { duration: BAR_MS, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, fillRatio, height]);

  const animatedHeight = useAnimatedStyle(() => ({
    height: `${height.value * 100}%`,
  }));

  return (
    <View style={styles.column}>
      <ThemedText
        variant="caption"
        style={[styles.valueLabel, { color: OnboardingMissedGraphTheme.label }]}
      >
        {OnboardingMissedImpactCopy.formatCount(displayValue)}
      </ThemedText>
      <View
        style={[
          styles.barTrack,
          { backgroundColor: OnboardingMissedGraphTheme.barTrack },
        ]}
      >
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: OnboardingMissedGraphTheme.barRed },
            animatedHeight,
          ]}
        />
      </View>
      <ThemedText
        variant="caption"
        style={[styles.axisLabel, { color: OnboardingMissedGraphTheme.label }]}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  centeredBlock: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  hero: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  stat: {
    fontVariant: ["tabular-nums"],
    fontSize: 56,
    lineHeight: 60,
  },
  chartCard: {
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 14,
    height: 168,
    width: "100%",
  },
  column: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    height: "100%",
  },
  valueLabel: {
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    fontSize: 13,
  },
  barTrack: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    borderRadius: 10,
  },
  axisLabel: {
    fontWeight: "600",
    fontSize: 12,
  },
  costBlock: {
    alignItems: "center",
    gap: 6,
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 8,
  },
  costTitle: {
    textAlign: "center",
    fontSize: 18,
  },
  subSlot: {
    minHeight: 40,
    justifyContent: "flex-start",
    paddingHorizontal: 12,
  },
  costSub: {
    textAlign: "center",
    lineHeight: 22,
    fontSize: 15,
  },
});
