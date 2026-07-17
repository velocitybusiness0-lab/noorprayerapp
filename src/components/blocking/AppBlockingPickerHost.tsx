import React from "react";
import { Platform, StyleSheet } from "react-native";
import { AndroidAppPickerModal } from "@/components/settings/AndroidAppPickerModal";
import { BLOCK_SELECTION_ID } from "@/features/blocking/BlockingManager";
import { SUGGESTED_BLOCK_PACKAGES } from "@/features/blocking/AndroidAccessibilityBlocker";
import { InstalledAppInfo } from "@/modules/app-blocker";
import { useAppBlockingSetup } from "@/features/blocking/useAppBlockingSetup";

type SheetPickerComponent = NonNullable<ReturnType<typeof useAppBlockingSetup>["sheetPicker"]>;

interface AppBlockingPickerHostProps {
  pickerVisible: boolean;
  setPickerVisible: (visible: boolean) => void;
  installedApps: InstalledAppInfo[];
  blockedPackages: string[];
  onSaveSelection: (packages: string[]) => void;
  sheetPicker: SheetPickerComponent | null;
  onIosSelectionChange: ReturnType<typeof useAppBlockingSetup>["onIosSelectionChange"];
  refresh: () => void;
}

/** Platform app pickers for the blocking flow. */
export function AppBlockingPickerHost({
  pickerVisible,
  setPickerVisible,
  installedApps,
  blockedPackages,
  onSaveSelection,
  sheetPicker,
  onIosSelectionChange,
  refresh,
}: AppBlockingPickerHostProps) {
  const SheetPicker = sheetPicker;

  return (
    <>
      {Platform.OS === "android" ? (
        <AndroidAppPickerModal
          visible={pickerVisible}
          installedApps={installedApps}
          selectedPackages={blockedPackages}
          suggestedApps={SUGGESTED_BLOCK_PACKAGES}
          onClose={() => setPickerVisible(false)}
          onSave={onSaveSelection}
        />
      ) : null}

      {Platform.OS === "ios" && SheetPicker && pickerVisible ? (
        <SheetPicker
          familyActivitySelectionId={BLOCK_SELECTION_ID}
          includeEntireCategory
          style={styles.sheetAnchor}
          onDismissRequest={() => {
            setPickerVisible(false);
            refresh();
          }}
          onSelectionChange={onIosSelectionChange}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  sheetAnchor: { width: 1, height: 1, position: "absolute", opacity: 0 },
});
