import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
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
  const isHolding = useSharedValue(false);
  const holdStartedAtRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const lastHapticMilestoneRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const enabledRef = useRef(enabled);
  const onCompleteRef = useRef(onComplete);
  enabledRef.current = enabled;
  onCompleteRef.current = onComplete;

  const clearHold = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    holdStartedAtRef.current = null;
    lastHapticMilestoneRef.current = -1;
    isHolding.value = false;
    if (!completedRef.current) {
      progress.value = withTiming(0, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isHolding, progress]);

  useEffect(() => () => clearHold(), [clearHold]);

  const tick = useCallback(() => {
    const startedAt = holdStartedAtRef.current;
    if (startedAt == null || completedRef.current) return;

    const elapsed = Date.now() - startedAt;
    const next = OnboardingCommitmentHoldPolicy.progressForElapsed(elapsed);
    progress.value = next;

    const milestone = OnboardingCommitmentHoldPolicy.hapticMilestoneIndex(next);
    if (milestone > lastHapticMilestoneRef.current && milestone > 0 && next < 1) {
      lastHapticMilestoneRef.current = milestone;
      haptics.impact(OnboardingCommitmentHoldPolicy.impactStyleForProgress(next));
    }

    if (OnboardingCommitmentHoldPolicy.isComplete(elapsed)) {
      completedRef.current = true;
      progress.value = 1;
      isHolding.value = false;
      haptics.impact(ImpactFeedbackStyle.Heavy);
      haptics.success();
      onCompleteRef.current();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [isHolding, progress]);

  const beginHold = useCallback(() => {
    if (!enabledRef.current || completedRef.current) return;
    if (!OnboardingCommitmentHoldPolicy.canBeginHold(enabledRef.current)) return;
    if (holdStartedAtRef.current != null) return;

    holdStartedAtRef.current = Date.now();
    lastHapticMilestoneRef.current = -1;
    progress.value = 0;
    isHolding.value = true;
    haptics.impact(ImpactFeedbackStyle.Medium);
    rafRef.current = requestAnimationFrame(tick);
  }, [isHolding, progress, tick]);

  const endHold = useCallback(() => {
    if (completedRef.current) return;
    clearHold();
  }, [clearHold]);

  const beginHoldRef = useRef(beginHold);
  const endHoldRef = useRef(endHold);
  beginHoldRef.current = beginHold;
  endHoldRef.current = endHold;

  const invokeBeginHold = useCallback(() => beginHoldRef.current(), []);
  const invokeEndHold = useCallback(() => endHoldRef.current(), []);

  const holdGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(enabled)
        .minDistance(0)
        .onBegin(() => {
          runOnJS(invokeBeginHold)();
        })
        .onFinalize(() => {
          runOnJS(invokeEndHold)();
        }),
    [enabled, invokeBeginHold, invokeEndHold]
  );

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: isHolding.value ? 0.96 : 1,
  }));

  return (
    <GestureDetector gesture={holdGesture}>
      <Animated.View
        accessibilityRole="button"
        accessibilityState={{ disabled: !enabled }}
        style={[
          styles.button,
          { backgroundColor: trackColor, opacity: !enabled ? 0.45 : 1 },
          enabled ? buttonStyle : null,
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
      </Animated.View>
    </GestureDetector>
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
