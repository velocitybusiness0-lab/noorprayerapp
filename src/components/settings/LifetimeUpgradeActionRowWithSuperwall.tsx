import React from "react";
import { Alert } from "react-native";
import { SettingActionRow } from "@/components/settings/SettingActionRow";
import { useLifetimeUpgradePlacement } from "@/features/subscriptions/useLifetimeUpgradePlacement";

/**
 * Superwall-backed Lifetime row. Lazy-required only when native module is linked.
 */
export function LifetimeUpgradeActionRowWithSuperwall() {
  const { presentLifetimeUpgrade, isPresenting } = useLifetimeUpgradePlacement();

  return (
    <SettingActionRow
      label="Lifetime"
      description="Unlock Miraj forever"
      icon="diamond-outline"
      onPress={() => {
        if (isPresenting) return;
        void presentLifetimeUpgrade().catch((error) => {
          Alert.alert(
            "Unable to open upgrade",
            error instanceof Error
              ? error.message
              : "Something went wrong presenting the lifetime offer."
          );
        });
      }}
      last
    />
  );
}
