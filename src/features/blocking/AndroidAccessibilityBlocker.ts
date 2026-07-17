import { AppBlocker, InstalledAppInfo } from "@/modules/app-blocker";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { BlockNowResult } from "./BlockingManager";

export type { InstalledAppInfo };

/** Suggested distraction apps — user can add more from the installed-apps list. */
export const SUGGESTED_BLOCK_PACKAGES: InstalledAppInfo[] = [
  { packageName: "com.zhiliaoapp.musically", label: "TikTok" },
  { packageName: "com.instagram.android", label: "Instagram" },
  { packageName: "com.google.android.youtube", label: "YouTube" },
  { packageName: "com.facebook.katana", label: "Facebook" },
  { packageName: "com.snapchat.android", label: "Snapchat" },
  { packageName: "com.twitter.android", label: "X (Twitter)" },
  { packageName: "com.reddit.frontpage", label: "Reddit" },
];

/**
 * Android Accessibility Service blocking — monitors foreground apps and
 * intercepts a user-selected package list during focus/prayer time.
 */
export class AndroidAccessibilityBlocker {
  get isAvailable(): boolean {
    return !!AppBlocker?.isSupported?.();
  }

  isAuthorized(): boolean {
    return !!AppBlocker?.isAccessibilityEnabled?.();
  }

  async requestAuthorization(): Promise<BlockNowResult> {
    if (!this.isAvailable) {
      return { success: false, message: "App blocking is not available on this device." };
    }
    AppBlocker?.openAccessibilitySettings?.();
    return {
      success: true,
      message: "Turn on Miraj in Accessibility, then come back.",
    };
  }

  getBlockedPackages(): string[] {
    const stored = storage.getObject<string[]>(StorageKeys.androidBlockedPackages);
    if (stored?.length) return stored;
    return AppBlocker?.getBlockedPackages?.() ?? [];
  }

  setBlockedPackages(packages: string[]): void {
    storage.setObject(StorageKeys.androidBlockedPackages, packages);
    AppBlocker?.setBlockedPackages?.(packages);
  }

  hasSelection(): boolean {
    return this.getBlockedPackages().length > 0;
  }

  selectionSummary(): { apps: number; categories: number; domains: number; total: number } {
    const count = this.getBlockedPackages().length;
    return { apps: count, categories: 0, domains: 0, total: count };
  }

  isShieldActive(): boolean {
    return !!AppBlocker?.isMonitoringEnabled?.();
  }

  blockNow(): BlockNowResult {
    if (!this.isAvailable) {
      return { success: false, message: "App blocking is not available on this device." };
    }
    if (!this.isAuthorized()) {
      return { success: false, message: "Allow Miraj in Accessibility first." };
    }
    if (!this.hasSelection()) {
      return { success: false, message: "Choose at least one app." };
    }

    AppBlocker?.setMonitoringEnabled?.(true);
    if (!this.isShieldActive()) {
      return { success: false, message: "Could not start blocking." };
    }

    return {
      success: true,
      message: "Blocking is on.",
    };
  }

  unblockNow(): void {
    AppBlocker?.setMonitoringEnabled?.(false);
  }

  async listInstalledApps(): Promise<InstalledAppInfo[]> {
    if (!this.isAvailable) return [];
    try {
      return (await AppBlocker?.getInstalledApps?.()) ?? [];
    } catch {
      return [];
    }
  }

  syncBlockedPackagesToNative(): void {
    const packages = this.getBlockedPackages();
    AppBlocker?.setBlockedPackages?.(packages);
  }
}

export const androidAccessibilityBlocker = new AndroidAccessibilityBlocker();
