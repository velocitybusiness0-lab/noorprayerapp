import { useCallback, useState } from "react";
import type { PaywallInfo, PaywallResult } from "expo-superwall";
import { usePlacement } from "expo-superwall";
import { SuperwallPlacements } from "./SuperwallPlacements";
import { subscriptionEntitlementStore } from "./SubscriptionEntitlementStore";

/**
 * Settings Lifetime upgrade via Superwall `upgrade_to_lifetime`.
 * Lazy-require this module only when Superwall native is linked.
 */
export function useLifetimeUpgradePlacement(): {
  presentLifetimeUpgrade: () => Promise<void>;
  isPresenting: boolean;
} {
  const [isPresenting, setIsPresenting] = useState(false);

  const { registerPlacement } = usePlacement({
    onDismiss: (_info: PaywallInfo, result: PaywallResult) => {
      setIsPresenting(false);
      if (result.type === "purchased" || result.type === "restored") {
        subscriptionEntitlementStore.markActive();
      }
    },
    onSkip: () => {
      setIsPresenting(false);
    },
    onError: (error) => {
      setIsPresenting(false);
      if (__DEV__) console.warn("[LifetimeUpgrade] error", error);
    },
  });

  const presentLifetimeUpgrade = useCallback(() => {
    if (isPresenting) return Promise.resolve();
    setIsPresenting(true);
    return registerPlacement({
      placement: SuperwallPlacements.upgradeToLifetime,
      feature: () => {
        setIsPresenting(false);
        subscriptionEntitlementStore.markActive();
      },
    }).catch((error) => {
      setIsPresenting(false);
      if (__DEV__) console.warn("[LifetimeUpgrade] register failed", error);
    });
  }, [isPresenting, registerPlacement]);

  return { presentLifetimeUpgrade, isPresenting };
}
