import * as StoreReview from "expo-store-review";

/** Requests the native in-app App Store / Play review prompt when available. */
export class OnboardingStoreReviewRequester {
  static async requestIfAvailable(): Promise<void> {
    try {
      const available = await StoreReview.isAvailableAsync();
      if (!available) return;
      await StoreReview.requestReview();
    } catch {
      // Apple/Google may throttle prompts; never block onboarding.
    }
  }
}
