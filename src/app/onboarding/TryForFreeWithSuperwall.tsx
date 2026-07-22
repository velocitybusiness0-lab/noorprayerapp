import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { usePlacement } from "expo-superwall";
import { OnboardingLightAppearance } from "@/components/onboarding/OnboardingLightAppearance";
import { OnboardingPostPaywallNavigator } from "@/features/onboarding/OnboardingPostPaywallNavigator";
import { SuperwallPlacements } from "@/features/subscriptions/SuperwallPlacements";
import { subscriptionEntitlementStore } from "@/features/subscriptions/SubscriptionEntitlementStore";

function continueAsTrial(): void {
  subscriptionEntitlementStore.markTrial();
  OnboardingPostPaywallNavigator.goToPermissions();
}

function continueAsActive(): void {
  subscriptionEntitlementStore.markActive();
  OnboardingPostPaywallNavigator.goToPermissions();
}

/**
 * Registers Superwall `try_for_free`. Lazy-required only when native module is linked.
 */
export function TryForFreeWithSuperwall() {
  const { registerPlacement } = usePlacement({
    onDismiss: (_info, result) => {
      if (result.type === "purchased" || result.type === "restored") {
        continueAsActive();
        return;
      }
      continueAsTrial();
    },
    onSkip: () => continueAsTrial(),
    onError: () => continueAsTrial(),
  });

  useEffect(() => {
    void registerPlacement({
      placement: SuperwallPlacements.tryForFree,
      feature: () => continueAsTrial(),
    }).catch(() => continueAsTrial());
  }, [registerPlacement]);

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
