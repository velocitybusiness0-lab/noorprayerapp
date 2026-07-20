import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { OnboardingDevSkipToPlanButton } from "@/components/onboarding/OnboardingDevSkipToPlanButton";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingStepContent } from "@/components/onboarding/OnboardingStepContent";
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

const FIRST_ONBOARDING_STEP_ID = "welcome";
const PERSONALIZED_PLAN_STEP_ID = "personalized-plan";

export default function OnboardingScreen() {
  const theme = useTheme();
  const flow = useOnboardingFlow();
  const step = OnboardingStepCatalog.stepAt(flow.stepIndex);
  const [calcProgress, setCalcProgress] = useState(0);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [stepInteractionReady, setStepInteractionReady] = useState(true);
  const previousStepIndexRef = useRef(flow.stepIndex);
  const transitionDirection = OnboardingStepTransitionPolicy.directionForIndexChange(
    previousStepIndexRef.current,
    flow.stepIndex
  );
  const transitionMode = OnboardingStepTransitionPolicy.modeForIncomingStep(
    step?.type
  );

  useHideTabBar("onboarding");

  useEffect(() => {
    previousStepIndexRef.current = flow.stepIndex;
  }, [flow.stepIndex]);
  useEffect(() => {
    if (step?.type !== "calculation") setCalcProgress(0);
    setSlideshowIndex(0);
    setStepInteractionReady(
      !OnboardingContinueInteractionGate.needsReady(step?.type)
    );
  }, [step?.id, step?.type]);

  const showProgressBar = OnboardingProgressPolicy.shouldShowProgressBar(
    step,
    flow.stepIndex
  );

  const headerProgress = useMemo(
    () =>
      OnboardingProgressPolicy.headerProgress(
        flow.stepIndex,
        calcProgress,
        step?.type === "calculation"
      ),
    [calcProgress, flow.stepIndex, step?.type]
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
      flow.complete();
      router.replace("/(tabs)");
    });
  }, [flow.complete]);

  const advance = useCallback(() => {
    setStepInteractionReady(true);
    const isLast = flow.stepIndex >= flow.totalSteps - 1;
    if (isLast) {
      finish();
      return;
    }
    const moved = flow.goNext();
    if (__DEV__) {
      console.info("[Onboarding] advance", {
        from: flow.stepIndex,
        stepId: step?.id,
        moved,
      });
    }
  }, [finish, flow.goNext, flow.stepIndex, flow.totalSteps, step?.id]);

  const handleContinue = useCallback(() => {
    if (!step) return;

    if (
      step.type === "name" &&
      !OnboardingNameAnswerKeys.canContinue(flow.answers, step.id)
    ) {
      return;
    }

    if (step.type === "slider" && typeof flow.answers[step.id] !== "number") {
      flow.setAnswer(step.id, step.min ?? 0);
    }

    if (step.type === "slideshow") {
      const slideCount = OnboardingSlideshowController.slideCount(step.slides);
      const currentIndex = OnboardingSlideshowController.clampIndex(
        slideshowIndex,
        slideCount
      );
      const nextIndex = OnboardingSlideshowController.nextSlideIndex(
        currentIndex,
        slideCount
      );
      if (nextIndex !== null) {
        setSlideshowIndex(nextIndex);
        return;
      }
      // Reset before leaving so the next slideshow step never mounts mid-pager.
      setSlideshowIndex(0);
      advance();
      return;
    }

    advance();
  }, [advance, flow.answers, flow.setAnswer, slideshowIndex, step]);

  // Temporary/dev convenience: jump from first welcome page to personalized-plan (prepaywall).
  const handleSkipToPersonalizedPlan = useCallback(() => {
    setSlideshowIndex(0);
    setStepInteractionReady(true);
    flow.goToStepId(PERSONALIZED_PLAN_STEP_ID);
  }, [flow.goToStepId]);

  if (!step) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  const hideContinue = OnboardingFooterVisibilityPolicy.shouldHideContinue(
    step.type
  );
  const pinFooterInFlow =
    OnboardingFooterVisibilityPolicy.shouldPinFooterInFlow(step.type);

  const continueDisabled = OnboardingContinueInteractionGate.needsReady(
    step.type
  )
    ? !stepInteractionReady
    : !flow.canContinue;

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

  const showSkipToPlan =
    flow.stepIndex === 0 || step.id === FIRST_ONBOARDING_STEP_ID;

  /**
   * Slideshow keeps a stable step key so the horizontal pager can swipe
   * without remounting; Continue still scrolls via activeSlideIndex sync.
   */
  const contentTransitionKey = step.id;

  return (
    <View style={styles.fill}>
      <OnboardingShell
        stepKey={contentTransitionKey}
        transitionMode={transitionMode}
        transitionDirection={transitionDirection}
        progress={headerProgress}
        progressOpacity={progressOpacity}
        showProgressBar={showProgressBar}
        showBack={OnboardingProgressPolicy.shouldShowBack(step, flow.stepIndex)}
        continueLabel={continueLabel}
        continueDisabled={continueDisabled}
        hideContinue={hideContinue}
        keyboardAvoid={step.type === "name"}
        pinFooterInFlow={pinFooterInFlow}
        centerContent={
          step.type === "missed-graph" ||
          step.type === "personalized-plan" ||
          (step.type === "slideshow" && step.contentPlacement === "center")
        }
        pastel={shellPastel ?? "default"}
        onBack={flow.goBack}
        onContinue={handleContinue}
      >
        <OnboardingStepContent
          step={step}
          answers={flow.answers}
          onAnswer={flow.setAnswer}
          onCalculationComplete={advance}
          onCalculationProgress={setCalcProgress}
          slideshowIndex={slideshowIndex}
          onActiveSlideChange={setSlideshowIndex}
          onComparisonAnimationComplete={handleInteractionReady}
          onTypingComplete={handleInteractionReady}
          onCommitmentLockIn={advance}
          onContinue={handleContinue}
        />
      </OnboardingShell>
      {showSkipToPlan ? (
        <OnboardingDevSkipToPlanButton onPress={handleSkipToPersonalizedPlan} />
      ) : null}
    </View>
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
