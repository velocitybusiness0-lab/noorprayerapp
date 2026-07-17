import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { OnboardingGoalsApplier } from "./OnboardingGoalsApplier";
import { OnboardingAnswers } from "./onboarding.types";

/** Persists onboarding completion and collected answers. */
export class OnboardingCompletionStore {
  isComplete(): boolean {
    return storage.getBoolean(StorageKeys.onboardingComplete) ?? false;
  }

  markComplete(answers: OnboardingAnswers): void {
    storage.setBoolean(StorageKeys.onboardingComplete, true);
    storage.setObject(StorageKeys.onboardingAnswers, answers);
    OnboardingGoalsApplier.apply(answers);
  }

  loadAnswers(): OnboardingAnswers {
    return storage.getObject<OnboardingAnswers>(StorageKeys.onboardingAnswers) ?? {};
  }

  reset(): void {
    storage.delete(StorageKeys.onboardingComplete);
    storage.delete(StorageKeys.onboardingAnswers);
  }
}

export const onboardingCompletionStore = new OnboardingCompletionStore();
