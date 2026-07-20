import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { OnboardingDebugStepChooser } from "@/components/onboarding/OnboardingDebugStepChooser";
import { OnboardingLightAppearance } from "@/components/onboarding/OnboardingLightAppearance";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingStepContent } from "@/components/onboarding/OnboardingStepContent";
import { OnboardingSlideshowStepHandle } from "@/components/onboarding/steps/OnboardingSlideshowStep";
import { OnboardingStepCatalog } from "@/features/onboarding/OnboardingStepCatalog";
import { OnboardingProgressPolicy } from "@/features/onboarding/OnboardingProgressPolicy";
import { OnboardingSlideshowController } from "@/features/onboarding/OnboardingSlideshowController";
import { OnboardingNameAnswerKeys } from "@/features/onboarding/OnboardingNameAnswerKeys";
import { OnboardingContinueInteractionGate } from "@/features/onboarding/OnboardingContinueInteractionGate";
import { OnboardingFooterVisibilityPolicy } from "@/features/onboarding/OnboardingFooterVisibilityPolicy";
import { OnboardingStepTransitionPolicy } from "@/features/onboarding/OnboardingStepTransitionPolicy";
import { onboardingPermissionCoordinator } from "@/features/onboarding/OnboardingPermissionCoordinator";
import { useOnboardingFlow } from "@/features/onboarding/useOnboardingFlow";
import { useHideTabBar } from "@/features/navigation/useHideTabBar";
import { useTheme } from "@/core/theme";

function OnboardingLoadingState() {
  const theme = useTheme();
  return (
    <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator color={theme.colors.accent} />
    </View>
  );
}

export default function OnboardingScreen() {
  const {
    answers,
    canContinue,
    complete,
    goBack,
    goNext,
    goToIndex,
    setAnswer,
    stepIndex,
    totalSteps,
  } = useOnboardingFlow();
  const step = OnboardingStepCatalog.stepAt(stepIndex);
  const slideshowRef = useRef<OnboardingSlideshowStepHandle>(null);
  const [calcProgress, setCalcProgress] = useState(0);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [stepInteractionReady, setStepInteractionReady] = useState(true);
  const previousStepIndexRef = useRef(stepIndex);
  const transitionDirection = OnboardingStepTransitionPolicy.directionForIndexChange(
    previousStepIndexRef.current,
    stepIndex
  );
  const transitionMode = OnboardingStepTransitionPolicy.modeForIncomingStep(
    step?.type
  );

  useHideTabBar("onboarding");

  useEffect(() => {
    previousStepIndexRef.current = stepIndex;
  }, [stepIndex]);

  useEffect(() => {
    if (step?.type !== "calculation") setCalcProgress(0);
    setSlideshowIndex(0);
    setStepInteractionReady(
      !OnboardingContinueInteractionGate.needsReady(step?.type)
    );
  }, [step?.id, step?.type]);

  const showProgressBar = OnboardingProgressPolicy.shouldShowProgressBar(
    step,
    stepIndex
  );

  const headerProgress = useMemo(
    () =>
      OnboardingProgressPolicy.headerProgress(
        stepIndex,
        calcProgress,
        step?.type === "calculation"
      ),
    [calcProgress, stepIndex, step?.type]
  );

  const progressOpacity = useMemo(() => {
    if (step?.type !== "calculation") return 1;
    return OnboardingProgressPolicy.progressOpacityDuringCalculation(calcProgress);
  }, [calcProgress, step?.type]);

  const handleInteractionReady = useCallback(() => {
    setStepInteractionReady(true);
  }, []);

  const finish = useCallback(() => {
    void onboardingPermissionCoordinator.requestAll().finally(() => {
      complete();
      router.replace("/(tabs)");
    });
  }, [complete]);

  const advance = useCallback(() => {
    setStepInteractionReady(true);
    const isLast = stepIndex >= totalSteps - 1;
    if (isLast) {
      finish();
      return;
    }
    goNext();
  }, [finish, goNext, stepIndex, totalSteps]);

  const handleContinue = useCallback(() => {
    if (!step) return;

    if (
      step.type === "name" &&
      !OnboardingNameAnswerKeys.canContinue(answers, step.id)
    ) {
      return;
    }

    if (step.type === "slider" && typeof answers[step.id] !== "number") {
      setAnswer(step.id, step.min ?? 0);
    }

    if (step.type === "slideshow") {
      const slideCount = OnboardingSlideshowController.slideCount(step.slides);
      const scrolled = slideshowRef.current?.scrollToNext() ?? false;
      if (scrolled) return;

      const currentIndex = OnboardingSlideshowController.clampIndex(
        slideshowIndex,
        slideCount
      );
      if (!OnboardingSlideshowController.isLastSlide(currentIndex, slideCount)) {
        return;
      }

      setSlideshowIndex(0);
      advance();
      return;
    }

    advance();
  }, [advance, answers, setAnswer, slideshowIndex, step]);

  const handleDebugJump = useCallback(
    (index: number) => {
      setSlideshowIndex(0);
      setStepInteractionReady(true);
      goToIndex(index);
    },
    [goToIndex]
  );

  if (!step) {
    return (
      <OnboardingLightAppearance>
        <OnboardingLoadingState />
      </OnboardingLightAppearance>
    );
  }

  const hideContinue = OnboardingFooterVisibilityPolicy.shouldHideContinue(
    step.type
  );
  const pinFooterInFlow =
    OnboardingFooterVisibilityPolicy.shouldPinFooterInFlow(step.type) ||
    step.id === "choose-goals";

  const continueDisabled = OnboardingContinueInteractionGate.needsReady(
    step.type
  )
    ? !stepInteractionReady
    : !canContinue;

  const shellPastel =
    step.type === "missed-graph"
      ? "default"
      : step.type === "slideshow"
        ? OnboardingSlideshowController.pastelAt(
            step.slides,
            slideshowIndex,
            step.pastel ?? "hardRed"
          )
        : step.pastel;

  const continueLabel =
    step.type === "slideshow"
      ? OnboardingSlideshowController.continueLabel(
          slideshowIndex,
          OnboardingSlideshowController.slideCount(step.slides),
          step.continueLabel
        )
      : step.continueLabel;

  const contentTransitionKey = step.id;

  // Keep shell top padding stable across holding-back → slider → missed-graph
  // (and the multi-choice after). Flipping centerContent mid-transition jumps
  // paddingTop from 72→16 while the exiting page is still on screen.
  const centerContent =
    step.type === "personalized-plan" ||
    step.type === "streak" ||
    step.type === "name" ||
    step.type === "benefits-graph" ||
    (step.type === "slideshow" && step.contentPlacement === "center");

  return (
    <OnboardingLightAppearance>
      <View style={styles.fill}>
        <OnboardingShell
          stepKey={contentTransitionKey}
          transitionMode={transitionMode}
          transitionDirection={transitionDirection}
          progress={headerProgress}
          progressOpacity={progressOpacity}
          showProgressBar={showProgressBar}
          showBack={OnboardingProgressPolicy.shouldShowBack(step, stepIndex)}
          continueLabel={continueLabel}
          continueDisabled={continueDisabled}
          hideContinue={hideContinue}
          keyboardAvoid={step.type === "name"}
          keyboardVerticalOffset={step.type === "name" ? 0 : undefined}
          pinFooterInFlow={pinFooterInFlow}
          centerContent={centerContent}
          compactTopPadding={step.type === "symptoms"}
          clipContent={step.type !== "personalized-plan"}
          pastel={shellPastel ?? "default"}
          onBack={goBack}
          onContinue={handleContinue}
        >
          <OnboardingStepContent
            step={step}
            answers={answers}
            onAnswer={setAnswer}
            onCalculationComplete={advance}
            onCalculationProgress={setCalcProgress}
            slideshowIndex={slideshowIndex}
            slideshowRef={slideshowRef}
            onActiveSlideChange={setSlideshowIndex}
            onComparisonAnimationComplete={handleInteractionReady}
            onTypingComplete={handleInteractionReady}
            onCommitmentLockIn={advance}
            onPrePaywallTypingComplete={advance}
            onContinue={handleContinue}
          />
        </OnboardingShell>
        <OnboardingDebugStepChooser
          currentIndex={stepIndex}
          onJumpToIndex={handleDebugJump}
        />
      </View>
    </OnboardingLightAppearance>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
