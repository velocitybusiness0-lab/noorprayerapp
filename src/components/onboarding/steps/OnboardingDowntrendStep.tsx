import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import { useTheme } from "@/core/theme";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { useLinearCountUp } from "../useLinearCountUp";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface OnboardingDowntrendStepProps {
  step: OnboardingStep;
}

/** Downtrend graph with animated metrics after bad habits message. */
export function OnboardingDowntrendStep({ step }: OnboardingDowntrendStepProps) {
  const theme = useTheme();
  const progress = useSharedValue(0);
  const consistency = useLinearCountUp(38, 1200, 500);
  const missed = useLinearCountUp(24, 1200, 500);
  const discipline = useLinearCountUp(41, 1200, 500);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(250, withTiming(1, { duration: 1400 }));
  }, [progress, step.id]);

  const pathD = "M 12 28 Q 70 24, 110 52 T 190 88 T 248 118";
  const areaD = `${pathD} L 248 130 L 12 130 Z`;

  const lineProps = useAnimatedProps(() => ({
    strokeDashoffset: 300 * (1 - progress.value),
  }));

  const areaProps = useAnimatedProps(() => ({
    opacity: progress.value * 0.22,
  }));

  return (
    <View style={styles.wrap}>
      <ThemedText variant="heading" style={styles.title}>
        {step.title}
      </ThemedText>

      <View style={styles.metricsRow}>
        <MetricCard label="Consistency" value={`${consistency}%`} />
        <MetricCard label="Missed / month" value={String(missed)} />
        <MetricCard label="Discipline" value={`${discipline}%`} />
      </View>

      <View style={[styles.chart, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
        <ThemedText variant="caption" style={styles.chartLabel}>
          Momentum over time
        </ThemedText>
        <Svg width="100%" height={150} viewBox="0 0 260 140">
          <Path d="M 12 8 L 248 8 M 12 8 L 12 130" stroke={theme.colors.hairline} strokeWidth={1} fill="none" />
          <AnimatedPath d={areaD} fill={theme.colors.danger} animatedProps={areaProps} />
          <AnimatedPath
            d={pathD}
            stroke={theme.colors.danger}
            strokeWidth={3.5}
            fill="none"
            strokeDasharray={300}
            animatedProps={lineProps}
            strokeLinecap="round"
          />
          <Circle cx="248" cy="118" r="5" fill={theme.colors.danger} />
        </Svg>
        <View style={styles.axisRow}>
          <ThemedText variant="caption" style={styles.axis}>3 mo ago</ThemedText>
          <ThemedText variant="caption" style={styles.axis}>Today</ThemedText>
        </View>
      </View>

      <View style={styles.bullets}>
        {(step.bullets ?? []).map((line) => (
          <ThemedText key={line} variant="body" style={styles.bullet}>
            • {line}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <ThemedText variant="caption" style={styles.metricLabel}>
        {label}
      </ThemedText>
      <ThemedText variant="title" style={styles.metricValue}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 52,
    paddingBottom: 12,
    alignItems: "center",
    gap: 18,
  },
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    maxWidth: 320,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "rgba(220,38,38,0.08)",
    alignItems: "center",
    gap: 4,
  },
  metricLabel: {
    color: ONBOARDING_INK,
    opacity: 0.65,
    textAlign: "center",
    fontSize: 11,
  },
  metricValue: {
    color: "#DC2626",
    fontVariant: ["tabular-nums"],
    fontSize: 20,
  },
  chart: {
    width: "100%",
    maxWidth: 320,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  chartLabel: {
    color: ONBOARDING_INK,
    opacity: 0.6,
    marginBottom: 4,
  },
  axisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  axis: {
    color: ONBOARDING_INK,
    opacity: 0.5,
  },
  bullets: {
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  bullet: {
    color: ONBOARDING_INK,
    opacity: 0.72,
    textAlign: "center",
  },
});
