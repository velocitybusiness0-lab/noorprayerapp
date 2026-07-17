import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { router, Stack } from "expo-router";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingStepContent } from "@/components/onboarding/OnboardingStepContent";
import { OnboardingStepCatalog } from "@/features/onboarding/OnboardingStepCatalog";
import { OnboardingProgressPolicy } from "@/features/onboarding/OnboardingProgressPolicy";
import { onboardingPermissionCoordinator } from "@/features/onboarding/OnboardingPermissionCoordinator";
import { useOnboardingFlow } from "@/features/onboarding/useOnboardingFlow";
import { useTheme } from "@/core/theme";

export default function OnboardingScreen() {
  const theme = useTheme();
  const flow = useOnboardingFlow();
  const step = OnboardingStepCatalog.stepAt(flow.stepIndex);
  const [calcProgress, setCalcProgress] = useState(0);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [stepInteractionReady, setStepInteractionReady] = useState(true);

  useEffect(() => {
    if (step?.type !== "calculation") setCalcProgress(0);
    if (step?.type !== "slideshow") setSlideshowIndex(0);
    setStepInteractionReady(step?.type !== "comparison");
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

  const handleComparisonComplete = useCallback(() => {
    setStepInteractionReady(true);
  }, []);

  const finish = useCallback(() => {
    flow.complete();
    router.replace("/(tabs)");
  }, [flow]);

  const advance = useCallback(() => {
    const isLast = flow.stepIndex >= flow.totalSteps - 1;
    if (isLast) {
      finish();
      return;
    }
    flow.goNext();
  }, [finish, flow]);

  const handleContinue = useCallback(async () => {
    if (!step) return;

    if (step.type === "feature-slideshow") {
      await onboardingPermissionCoordinator.requestAll();
    }

    if (step.type === "name") {
      const name = flow.answers[step.id];
      if (typeof name !== "string" || !name.trim()) return;
    }

    if (step.type === "slider" && typeof flow.answers[step.id] !== "number") {
      flow.setAnswer(step.id, step.min ?? 0);
    }

    advance();
  }, [advance, flow, step]);

  if (!step) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  const hideContinue = step.type === "calculation";

  const continueDisabled =
    step.type === "name"
      ? !String(flow.answers[step.id] ?? "").trim()
      : step.type === "comparison"
        ? !stepInteractionReady
        : !flow.canContinue;

  const stepPastel =
    step.type === "slideshow"
      ? step.slides?.[0]?.pastel ?? step.pastel
      : step.pastel;

  const shellPastel =
    step.type === "slideshow"
      ? step.slides?.[slideshowIndex]?.pastel ?? step.slides?.[0]?.pastel ?? "hardRed"
      : stepPastel;

  return (
    <>
      <Stack.Screen
        options={{
          presentation: "fullScreenModal",
          contentStyle: { flex: 1 },
        }}
      />
      <OnboardingShell
      progress={headerProgress}
      progressOpacity={progressOpacity}
      showProgressBar={showProgressBar}
      showBack={flow.stepIndex > 0 && step.type !== "calculation"}
      continueLabel={step.continueLabel}
      continueDisabled={continueDisabled}
      hideContinue={hideContinue}
      keyboardAvoid={step.type === "name"}
      pastel={shellPastel ?? "default"}
      onBack={flow.goBack}
      onContinue={() => {
        void handleContinue();
      }}
    >
      <OnboardingStepContent
        step={step}
        answers={flow.answers}
        onAnswer={flow.setAnswer}
        onCalculationComplete={advance}
        onCalculationProgress={setCalcProgress}
        onSlideshowSlideChange={setSlideshowIndex}
        onComparisonAnimationComplete={handleComparisonComplete}
      />
    </OnboardingShell>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
