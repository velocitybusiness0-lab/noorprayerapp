import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { OnboardingStepFadeTiming } from "@/features/onboarding/OnboardingStepFadeTiming";
import { OnboardingStepSlideTiming } from "@/features/onboarding/OnboardingStepSlideTiming";
import { OnboardingStepTransitionController } from "@/features/onboarding/OnboardingStepTransitionController";
import {
  OnboardingStepTransitionDirection,
  OnboardingStepTransitionMode,
} from "@/features/onboarding/OnboardingStepTransitionPolicy";

interface OnboardingStepFadeTransitionProps {
  stepKey: string;
  mode?: OnboardingStepTransitionMode;
  direction?: OnboardingStepTransitionDirection;
  children: ReactNode;
  onTransitionChange?: (busy: boolean) => void;
}

interface PendingContent {
  key: string;
  children: ReactNode;
}

/**
 * Animates step body on change. Question pages slide horizontally;
 * other steps fade. Progress / footer chrome stay outside and do not move.
 */
export function OnboardingStepFadeTransition({
  stepKey,
  mode = "fade",
  direction = "forward",
  children,
  onTransitionChange,
}: OnboardingStepFadeTransitionProps) {
  const { width } = useWindowDimensions();
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const controllerRef = useRef(new OnboardingStepTransitionController(stepKey));
  const pendingRef = useRef<PendingContent>({ key: stepKey, children });
  const modeRef = useRef(mode);
  const directionRef = useRef(direction);
  const activeModeRef = useRef<OnboardingStepTransitionMode>(mode);
  const activeDirectionRef = useRef<OnboardingStepTransitionDirection>(direction);
  const [displayed, setDisplayed] = useState<PendingContent>({
    key: stepKey,
    children,
  });
  const [busy, setBusy] = useState(false);

  pendingRef.current = { key: stepKey, children };
  modeRef.current = mode;
  directionRef.current = direction;

  const setTransitionBusy = useCallback(
    (next: boolean) => {
      setBusy(next);
      onTransitionChange?.(next);
    },
    [onTransitionChange]
  );

  const startExitRef = useRef<() => void>(() => undefined);

  const handleEnterComplete = useCallback(() => {
    const needsAnother = controllerRef.current.finishEnter();
    if (!needsAnother) {
      setTransitionBusy(false);
      return;
    }
    setTransitionBusy(true);
    startExitRef.current();
  }, [setTransitionBusy]);

  const enter = useCallback(() => {
    const activeMode = activeModeRef.current;
    const activeDirection = activeDirectionRef.current;

    if (activeMode === "slide") {
      const enterFrom =
        activeDirection === "forward" ? width : -width;
      translateX.value = enterFrom;
      opacity.value = OnboardingStepSlideTiming.enterStartOpacity;
      translateX.value = withTiming(0, {
        duration: OnboardingStepSlideTiming.enterMs,
        easing: OnboardingStepSlideTiming.easing,
      });
      opacity.value = withTiming(
        1,
        {
          duration: OnboardingStepSlideTiming.enterMs,
          easing: OnboardingStepSlideTiming.easing,
        },
        (finished) => {
          if (!finished) return;
          runOnJS(handleEnterComplete)();
        }
      );
      return;
    }

    translateX.value = 0;
    opacity.value = withTiming(
      1,
      {
        duration: OnboardingStepFadeTiming.fadeInMs,
        easing: OnboardingStepFadeTiming.easing,
      },
      (finished) => {
        if (!finished) return;
        runOnJS(handleEnterComplete)();
      }
    );
  }, [handleEnterComplete, opacity, translateX, width]);

  const commitSwap = useCallback(() => {
    const next = pendingRef.current;
    controllerRef.current.commitPendingKey();
    setDisplayed({ key: next.key, children: next.children });
    enter();
  }, [enter]);

  const startExit = useCallback(() => {
    activeModeRef.current = modeRef.current;
    activeDirectionRef.current = directionRef.current;
    setTransitionBusy(true);

    if (activeModeRef.current === "slide") {
      const exitTo =
        activeDirectionRef.current === "forward" ? -width : width;
      translateX.value = withTiming(exitTo, {
        duration: OnboardingStepSlideTiming.exitMs,
        easing: OnboardingStepSlideTiming.easing,
      });
      opacity.value = withTiming(
        OnboardingStepSlideTiming.exitOpacity,
        {
          duration: OnboardingStepSlideTiming.exitMs,
          easing: OnboardingStepSlideTiming.easing,
        },
        (finished) => {
          if (!finished) return;
          runOnJS(commitSwap)();
        }
      );
      return;
    }

    translateX.value = 0;
    opacity.value = withTiming(
      0,
      {
        duration: OnboardingStepFadeTiming.fadeOutMs,
        easing: OnboardingStepFadeTiming.easing,
      },
      (finished) => {
        if (!finished) return;
        runOnJS(commitSwap)();
      }
    );
  }, [commitSwap, opacity, setTransitionBusy, translateX, width]);

  startExitRef.current = startExit;

  useEffect(() => {
    const controller = controllerRef.current;
    if (stepKey === controller.getDisplayedKey() && !controller.isTransitioning()) {
      // Keep a freeze-frame snapshot for exit, but idle UI uses live `children`
      // so slideshow FlatList state is not remounted on Continue.
      setDisplayed({ key: stepKey, children });
      return;
    }
    if (controller.shouldBeginTransition(stepKey)) {
      startExit();
    }
  }, [stepKey, children, startExit]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  // While idle, render the live parent children (stable fibers). During a
  // transition, render the frozen snapshot so exit/enter stay correct.
  const showLiveChildren = !busy && stepKey === displayed.key;

  return (
    <Animated.View
      style={[
        styles.fill,
        mode === "slide" && styles.clip,
        animatedStyle,
      ]}
      pointerEvents={busy ? "none" : "box-none"}
    >
      <View style={styles.fill}>
        {showLiveChildren ? children : displayed.children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  clip: {
    overflow: "hidden",
  },
});
