import { useCallback, useEffect, useState, type ComponentType } from "react";
import { AppState, Platform } from "react-native";
import { blockingManager, BLOCK_SELECTION_ID } from "@/features/blocking/BlockingManager";
import { SUGGESTED_BLOCK_PACKAGES } from "@/features/blocking/AndroidAccessibilityBlocker";
import { InstalledAppInfo } from "@/modules/app-blocker";
import { isExpoGo } from "@/core/runtime/isExpoGo";
import { haptics } from "@/core/haptics/HapticsManager";
import { AppBlockingCopy } from "@/features/blocking/AppBlockingCopy";
import { appBlockingSetupPhaseResolver } from "@/components/blocking/AppBlockingSetupPhaseResolver";

type SheetPickerComponent = ComponentType<{
  familyActivitySelectionId: string;
  includeEntireCategory?: boolean;
  style?: object;
  onDismissRequest?: () => void;
  onSelectionChange?: (event: {
    nativeEvent: { applicationCount: number; categoryCount: number; webDomainCount: number };
  }) => void;
}>;

/** Shared blocking setup state for home card and settings. */
export function useAppBlockingSetup() {
  const available = blockingManager.isAvailable && !isExpoGo();
  const [authorized, setAuthorized] = useState(blockingManager.isAuthorized());
  const [selectionTotal, setSelectionTotal] = useState(0);
  const [shieldActive, setShieldActive] = useState(blockingManager.isShieldActive());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [installedApps, setInstalledApps] = useState<InstalledAppInfo[]>(SUGGESTED_BLOCK_PACKAGES);
  const [blockedPackages, setBlockedPackages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [sheetPicker, setSheetPicker] = useState<SheetPickerComponent | null>(null);

  const refresh = useCallback(() => {
    setAuthorized(blockingManager.isAuthorized());
    setSelectionTotal(blockingManager.selectionSummary().total);
    setShieldActive(blockingManager.isShieldActive());
    setBlockedPackages(blockingManager.getAndroidBlockedPackages());
  }, []);

  useEffect(() => {
    if (!available) return;
    if (Platform.OS === "ios") blockingManager.setSelectionId(BLOCK_SELECTION_ID);
    refresh();
    if (Platform.OS === "android") {
      void blockingManager.listAndroidInstalledApps().then((apps) => {
        if (apps.length) setInstalledApps(apps);
      });
    }
    if (Platform.OS === "ios") {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require("react-native-device-activity");
        setSheetPicker(() => mod.DeviceActivitySelectionSheetViewPersisted ?? null);
      } catch {
        setSheetPicker(null);
      }
    }
  }, [available, refresh]);

  useEffect(() => {
    if (!available) return;
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => sub.remove();
  }, [available, refresh]);

  const startBlocking = useCallback(() => {
    const result = blockingManager.blockNow();
    refresh();
    if (!result.success) haptics.warning();
    else haptics.success();
    return result.success;
  }, [refresh]);

  const onPrimaryAction = useCallback(async () => {
    if (!authorized) {
      setBusy(true);
      await blockingManager.requestAuthorization();
      refresh();
      setBusy(false);
      return;
    }
    if (selectionTotal === 0) {
      setPickerVisible(true);
      return;
    }
    if (!shieldActive) {
      setBusy(true);
      startBlocking();
      setBusy(false);
    }
  }, [authorized, refresh, selectionTotal, shieldActive, startBlocking]);

  const onSaveSelection = useCallback(
    (packages: string[]) => {
      blockingManager.setAndroidBlockedPackages(packages);
      setPickerVisible(false);
      refresh();
      if (!packages.length) {
        haptics.warning();
        return;
      }
      if (authorized) startBlocking();
    },
    [authorized, refresh, startBlocking]
  );

  const onIosSelectionChange = useCallback(
    (event: {
      nativeEvent: { applicationCount: number; categoryCount: number; webDomainCount: number };
    }) => {
      const { applicationCount, categoryCount, webDomainCount } = event.nativeEvent;
      setSelectionTotal(applicationCount + categoryCount + webDomainCount);
    },
    []
  );

  const primaryLabel = (() => {
    if (!authorized) {
      return Platform.OS === "android"
        ? busy
          ? "Opening settings…"
          : "Allow Miraj"
        : busy
          ? "Requesting…"
          : "Allow Screen Time";
    }
    if (selectionTotal === 0) return "Choose apps";
    if (!shieldActive) return busy ? "Turning on…" : "Turn on";
    return "On";
  })();

  const subtitle = shieldActive
    ? AppBlockingCopy.activeStatus(selectionTotal)
    : AppBlockingCopy.setupStatus(
        appBlockingSetupPhaseResolver.resolve(authorized, selectionTotal, shieldActive)
      );

  return {
    available,
    authorized,
    selectionTotal,
    shieldActive,
    busy,
    primaryLabel,
    subtitle,
    pickerVisible,
    setPickerVisible,
    onPrimaryAction,
    onSaveSelection,
    installedApps,
    blockedPackages,
    sheetPicker,
    onIosSelectionChange,
    refresh,
  };
}
