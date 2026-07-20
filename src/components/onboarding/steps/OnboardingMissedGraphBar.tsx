import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingMissedBarAnimationTiming } from "@/features/onboarding/OnboardingMissedBarAnimationTiming";
import { OnboardingMissedBarFillPolicy } from "@/features/onboarding/OnboardingMissedBarFillPolicy";
import { OnboardingMissedGraphTheme } from "@/features/onboarding/OnboardingMissedGraphTheme";
import { OnboardingMissedImpactCopy } from "@/features/onboarding/OnboardingMissedImpactCopy";
import { useLinearCountUp } from "../useLinearCountUp";

interface OnboardingMissedGraphBarProps {
  label: string;
  value: number;
  maxValue: number;
  delay: number;
}

/** Single animated column in the missed-prayer bar chart. */
export function OnboardingMissedGraphBar({
  label,
  value,
  maxValue,
  delay,
}: OnboardingMissedGraphBarProps) {
  const targetHeight = OnboardingMissedBarFillPolicy.fillHeight(value, maxValue);
  const height = useSharedValue(0);
  const displayValue = useLinearCountUp(
    value,
    OnboardingMissedBarAnimationTiming.barMs,
    delay
  );

  useEffect(() => {
    height.value = 0;
    height.value = withDelay(
      delay,
      withTiming(targetHeight, {
        duration: OnboardingMissedBarAnimationTiming.barMs,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [delay, height, targetHeight]);

  const animatedFill = useAnimatedStyle(() => ({
    height: height.value,
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
          {
            height: OnboardingMissedBarFillPolicy.trackHeight,
            backgroundColor: OnboardingMissedGraphTheme.barTrack,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: OnboardingMissedGraphTheme.barRed },
            animatedFill,
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
  column: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  valueLabel: {
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    fontSize: 13,
  },
  barTrack: {
    width: "100%",
    maxWidth: 52,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    borderRadius: 12,
  },
  axisLabel: {
    fontWeight: "600",
    fontSize: 12,
  },
});
