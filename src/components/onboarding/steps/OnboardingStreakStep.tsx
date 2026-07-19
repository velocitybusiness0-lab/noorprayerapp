import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
/** ~25% snappier than the original 420ms day tick. */
const DAY_DELAY_MS = 315;
const FLAME_PULSE_MS = 520;
const DAY_FADE_MS = 200;

interface OnboardingStreakStepProps {
  step: OnboardingStep;
}

/** Motivation screen — streak ticks in day by day with a pulsing flame. */
export function OnboardingStreakStep({ step }: OnboardingStreakStepProps) {
  const theme = useTheme();
  const [filledDays, setFilledDays] = useState(0);
  const flameScale = useSharedValue(1);

  useEffect(() => {
    setFilledDays(0);
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      setFilledDays(index);
      haptics.selection();
      if (index >= DAYS.length) clearInterval(timer);
    }, DAY_DELAY_MS);

    flameScale.value = withRepeat(
      withSequence(
        withTiming(1.12, {
          duration: FLAME_PULSE_MS,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: FLAME_PULSE_MS,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    return () => clearInterval(timer);
  }, [flameScale, step.id]);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  return (
    <View style={styles.center}>
      <View style={styles.streakRow}>
        <Animated.View style={flameStyle}>
          <Ionicons name="flame" size={52} color={theme.colors.warmGlow} />
        </Animated.View>
        <ThemedText variant="display" style={styles.streakNumber}>
          {filledDays}
        </ThemedText>
      </View>

      <ThemedText variant="heading" style={styles.title}>
        {step.title}
      </ThemedText>

      <View
        style={[
          styles.weekRow,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        {DAYS.map((day, index) => {
          const done = index < filledDays;
          return (
            <View key={day} style={styles.dayCell}>
              <ThemedText variant="caption" style={styles.dayLabel}>
                {day}
              </ThemedText>
              <Animated.View
                entering={done ? FadeIn.duration(DAY_FADE_MS) : undefined}
                style={[
                  styles.dayDot,
                  {
                    backgroundColor: done ? theme.colors.warmGlow : "transparent",
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={14} color={theme.colors.textInverse} />
                ) : null}
              </Animated.View>
            </View>
          );
        })}
      </View>

      {step.body ? (
        <ThemedText variant="caption" style={styles.body}>
          {step.body}
        </ThemedText>
      ) : null}
    </View>
  );
}

const ink = { color: ONBOARDING_INK };

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    gap: 18,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakNumber: {
    ...ink,
    fontVariant: ["tabular-nums"],
  },
  title: {
    ...ink,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 320,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 16,
  },
  dayCell: {
    alignItems: "center",
    gap: 8,
  },
  dayLabel: {
    ...ink,
    opacity: 0.65,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    ...ink,
    opacity: 0.65,
    textAlign: "center",
  },
});
