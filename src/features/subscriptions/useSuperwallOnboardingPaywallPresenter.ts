import { useCallback, useRef, useState } from "react";
import type { PaywallInfo, PaywallResult } from "expo-superwall";
import { usePlacement } from "expo-superwall";
import { SuperwallPlacements } from "./SuperwallPlacements";
import {
  OnboardingPaywallOutcome,
  OnboardingPaywallOutcomePolicy,
} from "./OnboardingPaywallOutcome";
import { applyEntitlement } from "./SoftOnboardingPaywallPresenter";

type ContinueHandler = (outcome: OnboardingPaywallOutcome) => void;

/**
 * Superwall-backed presenter. Only import this module when
 * SuperwallNativeAvailability.isLinked() is true (lazy require).
 */
export function useSuperwallOnboardingPaywallPresenter(
  onContinueToPermissions: ContinueHandler
): {
  presentOnboardingPaywall: () => Promise<void>;
  isPresenting: boolean;
} {
  const [isPresenting, setIsPresenting] = useState(false);
  const pendingRef = useRef<{
    resolve: () => void;
  } | null>(null);

  const finish = useCallback(
    (outcome: OnboardingPaywallOutcome) => {
      setIsPresenting(false);
      const pending = pendingRef.current;
      pendingRef.current = null;
      pending?.resolve();
      if (!OnboardingPaywallOutcomePolicy.shouldContinueToPermissions(outcome)) {
        return;
      }
      applyEntitlement(outcome);
      onContinueToPermissions(outcome);
    },
    [onContinueToPermissions]
  );

  const { registerPlacement } = usePlacement({
    onDismiss: (_info: PaywallInfo, result: PaywallResult) => {
      if (result.type === "purchased") {
        finish("purchased");
        return;
      }
      if (result.type === "restored") {
        finish("restored");
        return;
      }
      finish("declined");
    },
    onSkip: () => finish("feature_unlocked"),
    onError: (error) => {
      if (__DEV__) console.warn("[OnboardingPaywall] error", error);
      finish("unavailable");
    },
  });

  const presentOnboardingPaywall = useCallback(() => {
    if (isPresenting) return Promise.resolve();
    setIsPresenting(true);
    return new Promise<void>((resolve) => {
      pendingRef.current = { resolve };
      void registerPlacement({
        placement: SuperwallPlacements.onboardingPaywall,
        feature: () => finish("feature_unlocked"),
      }).catch((error) => {
        if (__DEV__) console.warn("[OnboardingPaywall] register failed", error);
        finish("unavailable");
      });
    });
  }, [finish, isPresenting, registerPlacement]);

  return {
    presentOnboardingPaywall,
    isPresenting,
  };
}
