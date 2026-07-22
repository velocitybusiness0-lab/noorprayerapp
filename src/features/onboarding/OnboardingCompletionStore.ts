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
    this.saveAnswers(answers);
    storage.setBoolean(StorageKeys.onboardingComplete, true);
    OnboardingGoalsApplier.apply(answers);
  }

  /** Persists answers before post-paywall permissions without finishing onboarding. */
  saveAnswers(answers: OnboardingAnswers): void {
    storage.setObject(StorageKeys.onboardingAnswers, answers);
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
