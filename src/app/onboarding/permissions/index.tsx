import { useCallback } from "react";
import { OnboardingPermissionPage } from "@/components/onboarding/OnboardingPermissionPage";
import { OnboardingPostPaywallNavigator } from "@/features/onboarding/OnboardingPostPaywallNavigator";
import { useHideTabBar } from "@/features/navigation/useHideTabBar";

/** Combined post-paywall permissions — notifications + alarms, then tabs. */
export default function OnboardingPermissionsScreen() {
  useHideTabBar("onboarding-permissions");

  const handleContinue = useCallback(() => {
    OnboardingPostPaywallNavigator.finishOnboarding();
  }, []);

  return <OnboardingPermissionPage onContinue={handleContinue} />;
}
