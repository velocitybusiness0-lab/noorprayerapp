import { Redirect } from "expo-router";
import { onboardingCompletionStore } from "@/features/onboarding/OnboardingCompletionStore";

/** First launch → onboarding; otherwise Today tabs. */
export default function IndexRedirect() {
  if (!onboardingCompletionStore.isComplete()) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)" />;
}
