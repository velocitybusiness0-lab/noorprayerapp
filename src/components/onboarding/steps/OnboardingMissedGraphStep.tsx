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
import { OnboardingPastelPalette } from "@/features/onboarding/OnboardingPastelPalette";
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
const IMPACT_DELAY_MS = BAR_MS + STAGGER_MS * 3 + 450;

/** Red stats page with high-contrast white copy and chart card. */
export function OnboardingMissedGraphStep({ step, answers }: OnboardingMissedGraphStepProps) {
  const palette = OnboardingPastelPalette.forTone(step.pastel ?? "hardRed", false);
  const textColor = palette.text;
  const mutedColor = palette.textMuted;
  const daily = typeof answers["missed-per-day"] === "number" ? answers["missed-per-day"] : 0;
  const stats = OnboardingStatsCalculator.fromDailyMissed(daily);
  const values = [stats.daily, stats.weekly, stats.monthly, stats.yearly];
  const maxVal = Math.max(...values, 1);
  const [showImpact, setShowImpact] = useState(false);

  const yearlyDisplay = useLinearCountUp(stats.yearly, 1000, 120);
  const heroOpacity = useSharedValue(0);

  useEffect(() => {
    setShowImpact(false);
    heroOpacity.value = 0;
    heroOpacity.value = withDelay(80, withTiming(1, { duration: 420, easing: Easing.linear }));

    const timer = setTimeout(() => setShowImpact(true), IMPACT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [daily, heroOpacity]);

  const heroStyle = useAnimatedStyle(() => ({ opacity: heroOpacity.value }));
  const punchline = OnboardingMissedImpactCopy.punchline(daily, stats.yearly);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText variant="heading" style={[styles.title, { color: textColor }]}>
        {step.title}
      </ThemedText>

      <Animated.View style={[styles.hero, heroStyle]}>
        <ThemedText variant="display" style={[styles.stat, { color: textColor }]}>
          {yearlyDisplay}
        </ThemedText>
        <ThemedText variant="bodyStrong" style={[styles.subtitle, { color: mutedColor }]}>
          namaz missed this year
        </ThemedText>
      </Animated.View>

      <View style={styles.chartCard}>
        <View style={styles.chart}>
          {values.map((val, index) => (
            <BarColumn
              key={BAR_LABELS[index]}
              label={BAR_LABELS[index]}
              value={val}
              ratio={val / maxVal}
              delay={200 + index * STAGGER_MS}
              textColor={textColor}
            />
          ))}
        </View>
      </View>

      <View style={styles.impactSlot}>
        {showImpact ? (
          <Animated.View entering={FadeIn.duration(500).easing(Easing.linear)}>
            <ThemedText variant="bodyStrong" style={[styles.impactBody, { color: textColor }]}>
              {punchline}
            </ThemedText>
          </Animated.View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function BarColumn({
  label,
  value,
  ratio,
  delay,
  textColor,
}: {
  label: string;
  value: number;
  ratio: number;
  delay: number;
  textColor: string;
}) {
  const height = useSharedValue(0);
  const displayValue = useLinearCountUp(value, BAR_MS, delay);

  useEffect(() => {
    height.value = 0;
    height.value = withDelay(
      delay,
      withTiming(ratio, { duration: BAR_MS, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, height, ratio]);

  const animatedHeight = useAnimatedStyle(() => ({
    height: `${Math.max(height.value * 100, 8)}%`,
  }));

  return (
    <View style={styles.column}>
      <ThemedText variant="caption" style={[styles.valueLabel, { color: textColor }]}>
        {displayValue}
      </ThemedText>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, animatedHeight]} />
      </View>
      <ThemedText variant="caption" style={[styles.axisLabel, { color: textColor }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 8,
    paddingBottom: 12,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  hero: {
    alignItems: "center",
    gap: 4,
    marginBottom: 20,
  },
  stat: {
    fontVariant: ["tabular-nums"],
    fontSize: 56,
    lineHeight: 60,
  },
  subtitle: {
    textAlign: "center",
  },
  chartCard: {
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
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
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  barFill: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  axisLabel: {
    fontWeight: "600",
    fontSize: 12,
  },
  impactSlot: {
    minHeight: 88,
    justifyContent: "center",
    paddingTop: 18,
    paddingHorizontal: 6,
  },
  impactBody: {
    textAlign: "center",
    lineHeight: 24,
    fontSize: 16,
  },
});
