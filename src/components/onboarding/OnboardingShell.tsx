import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import { OnboardingContentLayout } from "@/features/onboarding/OnboardingContentLayout";
import { OnboardingContinueButtonAppearance } from "@/features/onboarding/OnboardingContinueButtonAppearance";
import {
  ONBOARDING_INK,
  OnboardingPastelPalette,
} from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingShellBackgroundTiming } from "@/features/onboarding/OnboardingShellBackgroundTiming";
import { OnboardingStepFadeTiming } from "@/features/onboarding/OnboardingStepFadeTiming";
import {
  OnboardingStepTransitionDirection,
  OnboardingStepTransitionMode,
} from "@/features/onboarding/OnboardingStepTransitionPolicy";
import { OnboardingPastelTone } from "@/features/onboarding/onboarding.types";
import { OnboardingProgressHeader } from "./OnboardingProgressHeader";
import { OnboardingContinueButton } from "./OnboardingContinueButton";
import { OnboardingStepFadeTransition } from "./OnboardingStepFadeTransition";
import { OnboardingSystemChrome } from "./OnboardingSystemChrome";

interface OnboardingShellProps {
  stepKey: string;
  transitionMode?: OnboardingStepTransitionMode;
  transitionDirection?: OnboardingStepTransitionDirection;
  progress: number;
  progressOpacity?: number;
  showProgressBar?: boolean;
  showBack: boolean;
  continueLabel?: string;
  continueDisabled?: boolean;
  hideContinue?: boolean;
  keyboardAvoid?: boolean;
  /** Keep Continue in document flow (not absolute) so scroll pages cannot cover it. */
  pinFooterInFlow?: boolean;
  /** Vertically center step body; uses a tighter top inset. */
  centerContent?: boolean;
  pastel?: OnboardingPastelTone;
  onBack: () => void;
  onContinue: () => void;
  children: ReactNode;
}

const FOOTER_CONTENT_HEIGHT = 54 + 12;

/** Shared onboarding frame with matched safe-area colors. */
export function OnboardingShell({
  stepKey,
  transitionMode = "fade",
  transitionDirection = "forward",
  progress,
  progressOpacity = 1,
  showProgressBar = true,
  showBack,
  continueLabel,
  continueDisabled,
  hideContinue = false,
  keyboardAvoid = false,
  pinFooterInFlow = false,
  centerContent = false,
  pastel = "default",
  onBack,
  onContinue,
  children,
}: OnboardingShellProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pastelColors = OnboardingPastelPalette.forTone(pastel, theme.isDark);
  const continueColors = OnboardingContinueButtonAppearance.colors(
    pastel,
    theme.colors.accent,
    theme.colors.onAccent
  );
  const trackColor = "rgba(61,56,50,0.12)";
  const footerPad = insets.bottom + theme.spacing.lg;
  const footerInFlow =
    !hideContinue && (keyboardAvoid || pinFooterInFlow);
  const footerBlock =
    hideContinue || footerInFlow ? 0 : FOOTER_CONTENT_HEIGHT + footerPad;
  const contentTopPadding = centerContent
    ? OnboardingContentLayout.centeredContentTopPadding
    : OnboardingContentLayout.contentTopPadding;
  const [contentBusy, setContentBusy] = useState(false);
  const backgroundColor = useSharedValue(pastelColors.bg);
  const previousPastelRef = useRef(pastel);

  useEffect(() => {
    const previousPastel = previousPastelRef.current;
    previousPastelRef.current = pastel;
    const durationMs = OnboardingShellBackgroundTiming.durationMs(
      pastel,
      previousPastel
    );
    if (durationMs <= 0) {
      backgroundColor.value = pastelColors.bg;
      return;
    }
    backgroundColor.value = withTiming(pastelColors.bg, {
      duration: durationMs,
      easing: OnboardingStepFadeTiming.easing,
    });
  }, [backgroundColor, pastel, pastelColors.bg]);

  const rootStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  const safeTopStyle = useAnimatedStyle(() => ({
    height: insets.top,
    backgroundColor: backgroundColor.value,
  }));

  const footerBgStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  const gatedBack = () => {
    if (contentBusy) return;
    onBack();
  };

  const gatedContinue = () => {
    if (contentBusy) return;
    onContinue();
  };

  const body = (
    <View style={styles.fill}>
      {showProgressBar ? (
        <OnboardingProgressHeader
          progress={progress}
          opacity={progressOpacity}
          showBack={showBack}
          onBack={gatedBack}
          foregroundColor={ONBOARDING_INK}
          trackColor={trackColor}
        />
      ) : showBack ? (
        <OnboardingProgressHeader
          progress={0}
          opacity={1}
          hideTrack
          showBack
          onBack={gatedBack}
          foregroundColor={ONBOARDING_INK}
          trackColor={trackColor}
        />
      ) : (
        <View style={{ height: theme.spacing.sm }} />
      )}

      <View
        style={[
          styles.content,
          {
            paddingTop: contentTopPadding,
            paddingBottom: footerBlock,
          },
        ]}
        pointerEvents="box-none"
      >
        <OnboardingStepFadeTransition
          stepKey={stepKey}
          mode={transitionMode}
          direction={transitionDirection}
          onTransitionChange={setContentBusy}
        >
          {children}
        </OnboardingStepFadeTransition>
      </View>

      {!hideContinue ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            footerInFlow ? styles.footerInFlow : styles.footer,
            {
              paddingBottom: footerPad,
            },
            footerBgStyle,
          ]}
        >
          <OnboardingContinueButton
            label={continueLabel}
            disabled={continueDisabled || contentBusy}
            backgroundColor={continueColors.backgroundColor}
            textColor={continueColors.textColor}
            onPress={gatedContinue}
          />
        </Animated.View>
      ) : null}
    </View>
  );

  return (
    <Animated.View style={[styles.fill, rootStyle]}>
      <Animated.View style={safeTopStyle} />
      <OnboardingSystemChrome pastel={pastel} />
      {keyboardAvoid ? (
        <KeyboardAvoidingView
          style={styles.fill}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={insets.top + 8}
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    zIndex: 100,
    elevation: 100,
  },
  /** In-flow footer so KeyboardAvoidingView can lift Continue above the keyboard. */
  footerInFlow: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
