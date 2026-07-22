import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { OnboardingLightAppearance } from "@/components/onboarding/OnboardingLightAppearance";
import { OnboardingPostPaywallNavigator } from "@/features/onboarding/OnboardingPostPaywallNavigator";
import { useHideTabBar } from "@/features/navigation/useHideTabBar";
import { superwallManager } from "@/features/subscriptions/SuperwallManager";
import { subscriptionEntitlementStore } from "@/features/subscriptions/SubscriptionEntitlementStore";

function continueAsTrial(): void {
  subscriptionEntitlementStore.markTrial();
  OnboardingPostPaywallNavigator.goToPermissions();
}

/**
 * Deep-link / quick-action entry for “Try for free”.
 * Registers Superwall `try_for_free` when available, else soft local trial.
 */
export default function OnboardingTryForFreeScreen() {
  useHideTabBar("onboarding-try-for-free");

  if (superwallManager.canPresentPaywalls()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { TryForFreeWithSuperwall } =
      require("./TryForFreeWithSuperwall") as typeof import("./TryForFreeWithSuperwall");
    return <TryForFreeWithSuperwall />;
  }

  return <TryForFreeSoft />;
}

function TryForFreeSoft() {
  useEffect(() => {
    continueAsTrial();
  }, []);

  return (
    <OnboardingLightAppearance>
      <View style={styles.loading}>
        <ActivityIndicator color="#6B9E88" />
      </View>
    </OnboardingLightAppearance>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F4EF",
  },
});
