import React, { ReactNode, useEffect } from "react";
import { SuperwallProvider } from "expo-superwall";
import { SuperwallApiKeys } from "./SuperwallApiKeyResolver";
import { superwallManager } from "./SuperwallManager";

interface SuperwallProviderBridgeProps {
  apiKeys: SuperwallApiKeys;
  children: ReactNode;
}

/**
 * Mounts only after SuperwallNativeAvailability.isLinked() is true.
 * Kept in a separate module so expo-superwall is not evaluated at app boot
 * when the native module is missing.
 */
export function SuperwallProviderBridge({
  apiKeys,
  children,
}: SuperwallProviderBridgeProps) {
  return (
    <SuperwallProvider
      apiKeys={{ ios: apiKeys.ios, android: apiKeys.android }}
      onConfigurationError={(error) => {
        if (__DEV__) {
          console.warn("[Superwall] configuration failed", error);
        }
      }}
    >
      <SuperwallPreloadBridge />
      {children}
    </SuperwallProvider>
  );
}

function SuperwallPreloadBridge(): null {
  useEffect(() => {
    superwallManager.preloadOnboardingPaywalls();
  }, []);
  return null;
}
