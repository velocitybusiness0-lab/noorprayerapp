import React, { useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { SettingSection } from "./SettingSection";
import { AppBlockingPanel } from "@/components/blocking/AppBlockingPanel";
import { AppBlockingPickerHost } from "@/components/blocking/AppBlockingPickerHost";
import { useAppBlockingSetup } from "@/features/blocking/useAppBlockingSetup";

/** Android app blocking — gradient focus shield with step flow. */
export function AndroidBlockingSection() {
  const setup = useAppBlockingSetup();
  const { refresh } = setup;

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (!setup.available) {
    return (
      <SettingSection title="App blocking">
        <ThemedText variant="body" color="textSecondary">
          Needs a Miraj dev build — not Expo Go.
        </ThemedText>
      </SettingSection>
    );
  }

  return (
    <SettingSection title="App blocking">
      <AppBlockingPanel
        authorized={setup.authorized}
        selectionTotal={setup.selectionTotal}
        shieldActive={setup.shieldActive}
        busy={setup.busy}
        primaryLabel={setup.primaryLabel}
        onPrimaryAction={setup.onPrimaryAction}
        onOpenPicker={() => {
          haptics.selection();
          setup.setPickerVisible(true);
        }}
        onScanUnblock={() => {
          haptics.selection();
          router.push("/scan/unblock");
        }}
        showHint
      />
      <AppBlockingPickerHost
        pickerVisible={setup.pickerVisible}
        setPickerVisible={setup.setPickerVisible}
        installedApps={setup.installedApps}
        blockedPackages={setup.blockedPackages}
        onSaveSelection={setup.onSaveSelection}
        sheetPicker={setup.sheetPicker}
        onIosSelectionChange={setup.onIosSelectionChange}
        refresh={setup.refresh}
      />
    </SettingSection>
  );
}
