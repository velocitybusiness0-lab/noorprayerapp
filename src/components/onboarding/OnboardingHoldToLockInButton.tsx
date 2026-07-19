import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ImpactFeedbackStyle } from "expo-haptics";
import { ThemedText } from "@/components/primitives/ThemedText";
import { haptics } from "@/core/haptics/HapticsManager";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingCommitmentHoldPolicy } from "@/features/onboarding/OnboardingCommitmentHoldPolicy";

interface OnboardingHoldToLockInButtonProps {
  label?: string;
  enabled: boolean;
  fillColor: string;
  trackColor: string;
  textColor?: string;
  onComplete: () => void;
}

/** Press-and-hold CTA that fills then fires onComplete once. */
export function OnboardingHoldToLockInButton({
  label = "Hold to Lock In",
  enabled,
  fillColor,
  trackColor,
  textColor = ONBOARDING_INK,
  onComplete,
}: OnboardingHoldToLockInButtonProps) {
  const progress = useSharedValue(0);
  const holdStartedAtRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const clearHold = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    holdStartedAtRef.current = null;
    if (!completedRef.current) {
      progress.value = withTiming(0, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
      });
    }
  };

  useEffect(() => () => clearHold(), []);

  const tick = () => {
    const startedAt = holdStartedAtRef.current;
    if (startedAt == null || completedRef.current) return;

    const elapsed = Date.now() - startedAt;
    const next = OnboardingCommitmentHoldPolicy.progressForElapsed(elapsed);
    progress.value = next;

    if (OnboardingCommitmentHoldPolicy.isComplete(elapsed)) {
      completedRef.current = true;
      progress.value = 1;
      haptics.success();
      onComplete();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  const beginHold = () => {
    if (!enabled || completedRef.current) return;
    if (!OnboardingCommitmentHoldPolicy.canBeginHold(enabled)) return;

    holdStartedAtRef.current = Date.now();
    progress.value = 0;
    haptics.impact(ImpactFeedbackStyle.Medium);
    rafRef.current = requestAnimationFrame(tick);
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled || completedRef.current}
      onPressIn={beginHold}
      onPressOut={clearHold}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: trackColor,
          opacity: !enabled ? 0.45 : pressed ? 0.96 : 1,
        },
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.fill, { backgroundColor: fillColor }, fillStyle]}
      />
      <View pointerEvents="none" style={styles.labelWrap}>
        <ThemedText variant="bodyStrong" style={{ color: textColor }}>
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "center",
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    width: "0%",
  },
  labelWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
});
