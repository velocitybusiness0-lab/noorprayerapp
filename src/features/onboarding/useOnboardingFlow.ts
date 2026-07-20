import { useCallback, useMemo, useState } from "react";
import { OnboardingStepCatalog } from "./OnboardingStepCatalog";
import { onboardingCompletionStore } from "./OnboardingCompletionStore";
import { OnboardingNameAnswerKeys } from "./OnboardingNameAnswerKeys";
import { OnboardingAnswers } from "./onboarding.types";

interface OnboardingFlowState {
  stepIndex: number;
  totalSteps: number;
  progress: number;
  answers: OnboardingAnswers;
  canContinue: boolean;
  setAnswer: (stepId: string, value: string | string[] | number) => void;
  goNext: () => boolean;
  goBack: () => void;
  goToStepId: (stepId: string) => boolean;
  complete: () => void;
}

export function useOnboardingFlow(): OnboardingFlowState {
  const totalSteps = OnboardingStepCatalog.totalSteps();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});

  const step = OnboardingStepCatalog.stepAt(stepIndex);
  const progress = totalSteps <= 1 ? 1 : stepIndex / (totalSteps - 1);

  const canContinue = useMemo(() => {
    if (!step) return false;
    if (step.type === "name") {
      return OnboardingNameAnswerKeys.canContinue(answers, step.id);
    }
    if (!step.requiresSelection) return true;

    const value = answers[step.id];
    if (step.type === "multi-choice") {
      return Array.isArray(value) && value.length > 0;
    }
    if (step.type === "slider") {
      return true;
    }
    return typeof value === "string" && value.length > 0;
  }, [answers, step]);

  const setAnswer = useCallback((stepId: string, value: string | string[] | number) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (stepIndex >= totalSteps - 1) return false;
    setStepIndex((index) => index + 1);
    return true;
  }, [stepIndex, totalSteps]);

  const goBack = useCallback(() => {
    if (stepIndex <= 0) return;
    setStepIndex((index) => index - 1);
  }, [stepIndex]);

  const goToStepId = useCallback((stepId: string) => {
    const index = OnboardingStepCatalog.indexOfStepId(stepId);
    if (index < 0) return false;
    setStepIndex(index);
    return true;
  }, []);

  const complete = useCallback(() => {
    onboardingCompletionStore.markComplete(answers);
  }, [answers]);

  return {
    stepIndex,
    totalSteps,
    progress,
    answers,
    canContinue,
    setAnswer,
    goNext,
    goBack,
    goToStepId,
    complete,
  };
}
