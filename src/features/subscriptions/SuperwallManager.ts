import { Alert } from "react-native";
import { SuperwallApiKeyResolver } from "./SuperwallApiKeyResolver";
import { SuperwallNativeAvailability } from "./SuperwallNativeAvailability";
import { SuperwallPlacements } from "./SuperwallPlacements";
import { subscriptionEntitlementStore } from "./SubscriptionEntitlementStore";

type ExpoSuperwallModule = typeof import("expo-superwall");

/**
 * OOP façade over expo-superwall for restore / availability / preload.
 * Never statically imports expo-superwall — a missing native module would crash
 * at require time on stale development clients.
 */
export class SuperwallManager {
  isNativeAvailable(): boolean {
    return SuperwallNativeAvailability.isLinked();
  }

  hasApiKey(): boolean {
    return SuperwallApiKeyResolver.hasUsableKey();
  }

  /** True when the native module is linked and a real platform API key exists. */
  canPresentPaywalls(): boolean {
    return this.isNativeAvailable() && this.hasApiKey();
  }

  async restorePurchases(): Promise<boolean> {
    if (!this.canPresentPaywalls()) {
      Alert.alert(
        "Restore unavailable",
        "Purchases require a development build that includes Superwall. " +
          "Rebuild with EAS or `npx expo run:ios` / `run:android` after installing expo-superwall."
      );
      return false;
    }

    try {
      const { SuperwallExpoModule, useSuperwallStore } = this.loadExpoSuperwall();
      const store = useSuperwallStore.getState();
      const response = store.isConfigured
        ? await store.restorePurchases()
        : await SuperwallExpoModule.restorePurchases();

      if (response.result === "restored") {
        subscriptionEntitlementStore.markActive();
        Alert.alert("Restored", "Your purchases have been restored.");
        return true;
      }

      Alert.alert(
        "Nothing to restore",
        response.errorMessage ??
          "No previous purchases were found for this Apple ID / Google account."
      );
      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Restore failed.";
      Alert.alert("Restore failed", message);
      return false;
    }
  }

  preloadOnboardingPaywalls(): void {
    if (!this.canPresentPaywalls()) return;
    try {
      const { SuperwallExpoModule, useSuperwallStore } = this.loadExpoSuperwall();
      const store = useSuperwallStore.getState();
      if (store.isConfigured) {
        void store.preloadPaywalls([...SuperwallPlacements.all]);
        return;
      }
      SuperwallExpoModule.preloadPaywalls([...SuperwallPlacements.all]);
    } catch (error) {
      if (__DEV__) {
        console.warn("[SuperwallManager] preload failed", error);
      }
    }
  }

  private loadExpoSuperwall(): ExpoSuperwallModule {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-superwall") as ExpoSuperwallModule;
  }
}

export const superwallManager = new SuperwallManager();
