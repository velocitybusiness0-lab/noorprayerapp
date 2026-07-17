import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { SettingSection } from "./SettingSection";
import { AppBlockingPanel } from "@/components/blocking/AppBlockingPanel";
import { AppBlockingPickerHost } from "@/components/blocking/AppBlockingPickerHost";
import { useAppBlockingSetup } from "@/features/blocking/useAppBlockingSetup";

/** iOS Screen Time blocking — gradient focus shield with step flow. */
export function IosBlockingSection() {
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
          Needs a Miraj dev build on iPhone — not Expo Go.
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
      {setup.authorized && !setup.sheetPicker ? (
        <ThemedText variant="caption" color="textTertiary" style={styles.hint}>
          Rebuild the iOS dev client to pick apps.
        </ThemedText>
      ) : null}
    </SettingSection>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: 10 },
});
