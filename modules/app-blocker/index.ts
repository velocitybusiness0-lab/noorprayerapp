import { requireOptionalNativeModule } from "expo-modules-core";

export interface InstalledAppInfo {
  packageName: string;
  label: string;
}

interface AppBlockerNativeModule {
  isSupported: () => boolean;
  isAccessibilityEnabled: () => boolean;
  openAccessibilitySettings: () => void;
  getInstalledApps: () => Promise<InstalledAppInfo[]>;
  setBlockedPackages: (packages: string[]) => void;
  getBlockedPackages: () => string[];
  setMonitoringEnabled: (enabled: boolean) => void;
  isMonitoringEnabled: () => boolean;
}

/** Android Accessibility Service bridge for foreground app blocking. */
export const AppBlocker =
  requireOptionalNativeModule<AppBlockerNativeModule>("AppBlocker");
