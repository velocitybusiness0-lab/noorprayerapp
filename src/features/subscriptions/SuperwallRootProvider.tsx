import React, { ReactNode } from "react";
import { SuperwallApiKeyResolver } from "./SuperwallApiKeyResolver";
import { SuperwallNativeAvailability } from "./SuperwallNativeAvailability";

interface SuperwallRootProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with Superwall when the native module is linked and a key exists.
 * Missing native module (Expo Go / stale dev client) skips the provider so the
 * app can soft-fall back to local try-for-free without crashing.
 */
export function SuperwallRootProvider({ children }: SuperwallRootProviderProps) {
  const keys = SuperwallApiKeyResolver.resolve();
  const hasKey = SuperwallApiKeyResolver.hasUsableKey(keys);
  SuperwallNativeAvailability.warnIfRebuildRequired(hasKey);

  const shouldMount = SuperwallNativeAvailability.isLinked() && hasKey;

  if (!shouldMount) {
    return <>{children}</>;
  }

  // Lazy require so expo-superwall (and requireNativeModule) never run when unlinked.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { SuperwallProviderBridge } =
    require("./SuperwallProviderBridge") as typeof import("./SuperwallProviderBridge");

  return (
    <SuperwallProviderBridge apiKeys={keys}>{children}</SuperwallProviderBridge>
  );
}
