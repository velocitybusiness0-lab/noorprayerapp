import React from "react";
import { Alert } from "react-native";
import { SettingSection } from "@/components/settings/SettingSection";
import { SettingActionRow } from "@/components/settings/SettingActionRow";
import { superwallManager } from "@/features/subscriptions/SuperwallManager";

/**
 * Subscription / Premium settings — Lifetime upgrade via Superwall placement.
 */
export function SubscriptionSettingsSection() {
  return (
    <SettingSection title="Subscription">
      <LifetimeUpgradeRow />
    </SettingSection>
  );
}

function LifetimeUpgradeRow() {
  if (superwallManager.canPresentPaywalls()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { LifetimeUpgradeActionRowWithSuperwall } =
      require("./LifetimeUpgradeActionRowWithSuperwall") as typeof import("./LifetimeUpgradeActionRowWithSuperwall");
    return <LifetimeUpgradeActionRowWithSuperwall />;
  }

  return (
    <SettingActionRow
      label="Lifetime"
      description="Unlock Miraj forever"
      icon="diamond-outline"
      onPress={showSoftUnavailable}
      last
    />
  );
}

function showSoftUnavailable(): void {
  Alert.alert(
    "Lifetime unavailable",
    "Lifetime upgrades require a development build that includes Superwall. " +
      "Rebuild with EAS or `npx expo run:ios` / `run:android` after installing expo-superwall."
  );
}
