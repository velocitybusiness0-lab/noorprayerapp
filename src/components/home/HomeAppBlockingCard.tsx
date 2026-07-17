import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { haptics } from "@/core/haptics/HapticsManager";
import { AppBlockingPanel } from "@/components/blocking/AppBlockingPanel";
import { AppBlockingPickerHost } from "@/components/blocking/AppBlockingPickerHost";
import { useAppBlockingSetup } from "@/features/blocking/useAppBlockingSetup";
import { useModes } from "@/features/modes/modeStore";

/** Focus shield card on the Today tab. */
export function HomeAppBlockingCard() {
  const blockModeEnabled = useModes((s) => s.enabledModes.includes("block"));
  const setup = useAppBlockingSetup();
  const { refresh } = setup;

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (!setup.available) return null;
  if (!blockModeEnabled && !setup.shieldActive) return null;

  return (
    <View style={styles.wrap}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16 },
});
