import { Href, router } from "expo-router";
import { onboardingCompletionStore } from "./OnboardingCompletionStore";
import { OnboardingPermissionRoutes } from "./OnboardingPermissionRoutes";
import type { OnboardingAnswers } from "./onboarding.types";

/**
 * Navigates the post-paywall permission flow, then completes onboarding.
 */
export class OnboardingPostPaywallNavigator {
  static goToPermissions(): void {
    router.replace(OnboardingPermissionRoutes.permissions as Href);
  }

  static finishOnboarding(answers?: OnboardingAnswers): void {
    if (answers) {
      onboardingCompletionStore.markComplete(answers);
    } else if (!onboardingCompletionStore.isComplete()) {
      onboardingCompletionStore.markComplete(
        onboardingCompletionStore.loadAnswers()
      );
    }
    router.replace("/(tabs)");
  }
}
