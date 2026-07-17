import React, { useCallback, useEffect, useMemo } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingMissedSliderStepProps {
  step: OnboardingStep;
  value: number | undefined;
  onChange: (value: number) => void;
}

const THUMB_SIZE = 26;

function sliderColorForRatio(ratio: number, accent: string): string {
  if (ratio <= 0) return accent;
  if (ratio <= 0.35) return "#84CC16";
  if (ratio <= 0.55) return "#EAB308";
  if (ratio <= 0.75) return "#F97316";
  return "#DC2626";
}

/** Draggable bar for missed namaz per day — redder as value rises. */
export function OnboardingMissedSliderStep({
  step,
  value,
  onChange,
}: OnboardingMissedSliderStepProps) {
  const theme = useTheme();
  const min = step.min ?? 0;
  const max = step.max ?? 5;
  const current = value ?? min;
  const trackWidth = useSharedValue(0);
  const dragX = useSharedValue(0);
  const lastCommitted = useSharedValue(current);

  const steps = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max]
  );

  const ratio = max === min ? 0 : (current - min) / (max - min);
  const activeColor = sliderColorForRatio(ratio, theme.colors.accent);

  const commitValue = useCallback(
    (next: number) => {
      if (next !== current) {
        haptics.selection();
        onChange(next);
      }
    },
    [current, onChange]
  );

  const snapFromX = useCallback(
    (x: number) => {
      if (trackWidth.value <= 0) return;
      const clamped = Math.max(0, Math.min(trackWidth.value, x));
      dragX.value = clamped;
      const next = Math.round((clamped / trackWidth.value) * (max - min)) + min;
      if (next !== lastCommitted.value) {
        lastCommitted.value = next;
        commitValue(next);
      }
    },
    [commitValue, dragX, lastCommitted, max, min, trackWidth]
  );

  useEffect(() => {
    lastCommitted.value = current;
    if (trackWidth.value <= 0) return;
    dragX.value = ratio * trackWidth.value;
  }, [current, dragX, lastCommitted, ratio, trackWidth]);

  const pan = Gesture.Pan().onUpdate((event) => {
    if (trackWidth.value <= 0) return;
    const clamped = Math.max(0, Math.min(trackWidth.value, event.x));
    dragX.value = clamped;
    const next = Math.round((clamped / trackWidth.value) * (max - min)) + min;
    if (next !== lastCommitted.value) {
      lastCommitted.value = next;
      runOnJS(commitValue)(next);
    }
  });

  const tap = Gesture.Tap().onEnd((event) => {
    runOnJS(snapFromX)(event.x);
  });

  const gesture = Gesture.Race(pan, tap);

  const onTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidth.value = width;
    dragX.value = ratio * width;
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: Math.max(dragX.value, 0),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value - THUMB_SIZE / 2 }],
  }));

  return (
    <View style={styles.wrap}>
      <ThemedText variant="heading" style={styles.title}>
        {step.title}
      </ThemedText>

      <View style={styles.center}>
        <ThemedText variant="display" style={[styles.value, { color: activeColor }]}>
          {current}
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary">
          namaz missed per day
        </ThemedText>

        <GestureDetector gesture={gesture}>
          <View style={styles.trackWrap} onLayout={onTrackLayout}>
            <View style={[styles.track, { backgroundColor: theme.colors.hairline }]}>
              <Animated.View style={[styles.fill, { backgroundColor: activeColor }, fillStyle]} />
            </View>
            <Animated.View
              style={[
                styles.thumb,
                { backgroundColor: activeColor, borderColor: theme.colors.background },
                thumbStyle,
              ]}
            />
          </View>
        </GestureDetector>

        <View style={styles.labels}>
          {steps.map((n) => (
            <ThemedText
              key={n}
              variant="caption"
              style={{
                color: n === current ? activeColor : theme.colors.textTertiary,
                fontWeight: n === current ? "700" : "400",
              }}
            >
              {n}
            </ThemedText>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingTop: 48,
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
    width: "100%",
  },
  value: {
    fontVariant: ["tabular-nums"],
  },
  trackWrap: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    marginTop: 24,
  },
  track: {
    height: 10,
    borderRadius: 999,
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 3,
    top: 11,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 14,
    paddingHorizontal: 2,
  },
});
