import { Platform } from "react-native";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { dayKey } from "@/core/utils/time";
import { DayPrayerTimes, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { ModeCheckFn } from "@/features/modes/mode.types";
import { isExpoGo } from "@/core/runtime/isExpoGo";
import { blockingShieldConfigurator } from "./BlockingShieldConfigurator";
import { androidAccessibilityBlocker } from "./AndroidAccessibilityBlocker";
import { androidBlockScheduleCoordinator } from "./AndroidBlockScheduleCoordinator";

type DeviceActivityModule = typeof import("react-native-device-activity");
type DeviceActivityAction = import("react-native-device-activity").Action;

const BLOCK_WINDOW_MINUTES = 30;
export const BLOCK_SELECTION_ID = "noor.blockedApps";

export interface BlockingSyncOptions {
  isAlertEnabled: (prayer: ObligatoryPrayer) => boolean;
  isModeEnabled: ModeCheckFn;
}

export interface BlockNowResult {
  success: boolean;
  message: string;
}

let deviceActivityModule: DeviceActivityModule | null | undefined;

function getDeviceActivity(): DeviceActivityModule | null {
  if (Platform.OS !== "ios" || isExpoGo()) return null;
  if (deviceActivityModule !== undefined) return deviceActivityModule ?? null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    deviceActivityModule = require("react-native-device-activity");
  } catch {
    deviceActivityModule = null;
  }
  return deviceActivityModule ?? null;
}

function formatIosBlockingError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("helper application")) {
    return (
      "Screen Time extensions are not running. Install the latest Miraj dev build " +
      "(eas build --profile development --platform ios), then try again."
    );
  }
  if (message.includes("UNAUTHORIZED") || message.includes("authorization")) {
    return "Screen Time permission is required. Open Settings → Miraj and allow Screen Time access.";
  }
  return message || "Could not start app blocking.";
}

/**
 * Platform blocking facade: iOS Screen Time on iPhone, Accessibility Service on Android.
 */
export class BlockingManager {
  get isAvailable(): boolean {
    if (Platform.OS === "android") return androidAccessibilityBlocker.isAvailable;
    const da = getDeviceActivity();
    return !!da && da.isAvailable();
  }

  isAuthorized(): boolean {
    if (Platform.OS === "android") return androidAccessibilityBlocker.isAuthorized();
    const da = getDeviceActivity();
    if (!da) return false;
    return da.getAuthorizationStatus() === da.AuthorizationStatus.approved;
  }

  async requestAuthorization(): Promise<BlockNowResult> {
    if (Platform.OS === "android") return androidAccessibilityBlocker.requestAuthorization();
    return this.requestIosAuthorization();
  }

  get selectionId(): string | undefined {
    return storage.getString(StorageKeys.blockedSelectionId);
  }

  setSelectionId(id: string): void {
    storage.setString(StorageKeys.blockedSelectionId, id);
  }

  selectionSummary(): { apps: number; categories: number; domains: number; total: number } {
    if (Platform.OS === "android") return androidAccessibilityBlocker.selectionSummary();
    return this.iosSelectionSummary();
  }

  hasSelection(): boolean {
    if (Platform.OS === "android") return androidAccessibilityBlocker.hasSelection();
    return this.selectionSummary().total > 0;
  }

  isShieldActive(): boolean {
    if (Platform.OS === "android") return androidAccessibilityBlocker.isShieldActive();
    const da = getDeviceActivity();
    return !!da && da.isShieldActive();
  }

  blockNow(): BlockNowResult {
    if (Platform.OS === "android") return androidAccessibilityBlocker.blockNow();
    return this.blockNowIos();
  }

  unblockNow(): void {
    if (Platform.OS === "android") {
      androidAccessibilityBlocker.unblockNow();
      return;
    }
    this.unblockNowIos();
  }

  async scheduleForDays(days: DayPrayerTimes[], options: BlockingSyncOptions): Promise<void> {
    if (Platform.OS === "android") {
      androidBlockScheduleCoordinator.sync(days, options);
      return;
    }
    await this.scheduleIos(days, options);
  }

  // --- Android helpers exposed for settings UI ---

  getAndroidBlockedPackages(): string[] {
    return androidAccessibilityBlocker.getBlockedPackages();
  }

  setAndroidBlockedPackages(packages: string[]): void {
    androidAccessibilityBlocker.setBlockedPackages(packages);
  }

  listAndroidInstalledApps() {
    return androidAccessibilityBlocker.listInstalledApps();
  }

  // --- iOS Screen Time ---

  private async requestIosAuthorization(): Promise<BlockNowResult> {
    const da = getDeviceActivity();
    if (!da) {
      return { success: false, message: "Screen Time is not available on this device." };
    }
    try {
      await da.requestAuthorization("individual");
      const status = await da.pollAuthorizationStatus({ maxAttempts: 20 });
      if (status !== da.AuthorizationStatus.approved) {
        return {
          success: false,
          message:
            "Screen Time access was not granted. Tap Allow on Apple's popup, or enable it in Settings → Miraj.",
        };
      }
      blockingShieldConfigurator.apply("auth");
      return { success: true, message: "Screen Time allowed. Now choose apps to block." };
    } catch (error) {
      return { success: false, message: formatIosBlockingError(error) };
    }
  }

  private iosSelectionSummary(): { apps: number; categories: number; domains: number; total: number } {
    const da = getDeviceActivity();
    const empty = { apps: 0, categories: 0, domains: 0, total: 0 };
    if (!da) return empty;
    const id = this.selectionId;
    if (!id) return empty;

    try {
      const meta = da.activitySelectionMetadata({ activitySelectionId: id });
      if (!meta) return empty;
      const total = meta.applicationCount + meta.categoryCount + meta.webDomainCount;
      return {
        apps: meta.applicationCount,
        categories: meta.categoryCount,
        domains: meta.webDomainCount,
        total,
      };
    } catch {
      return empty;
    }
  }

  private blockNowIos(): BlockNowResult {
    const da = getDeviceActivity();
    if (!da) {
      return { success: false, message: "Screen Time is not available on this device." };
    }
    if (!this.isAuthorized()) {
      return { success: false, message: "Allow Screen Time first, then choose apps to block." };
    }

    try {
      blockingShieldConfigurator.apply("block-now");

      if (this.hasSelection()) {
        const id = this.selectionId!;
        da.blockSelection({ activitySelectionId: id }, "block-now");
      } else {
        da.enableBlockAllMode("block-now");
      }

      da.refreshManagedSettingsStore?.();

      if (this.isShieldActive()) {
        return {
          success: true,
          message: this.hasSelection()
            ? "Blocking is on."
            : "All apps blocked.",
        };
      }

      return {
        success: false,
        message: formatIosBlockingError(new Error("Couldn't communicate with a helper application.")),
      };
    } catch (error) {
      return { success: false, message: formatIosBlockingError(error) };
    }
  }

  private unblockNowIos(): void {
    const da = getDeviceActivity();
    if (!da) return;
    try {
      da.resetBlocks("scan-unblock");
      da.disableBlockAllMode("scan-unblock");
      da.refreshManagedSettingsStore?.();
    } catch {
      // Best-effort unblock.
    }
  }

  private async scheduleIos(days: DayPrayerTimes[], options: BlockingSyncOptions): Promise<void> {
    const da = getDeviceActivity();
    if (!da || !this.isAuthorized()) return;

    try {
      blockingShieldConfigurator.apply("schedule");
      da.stopMonitoring();

      for (const day of days) {
        for (const entry of day.entries) {
          if (!entry.isObligatory) continue;
          const prayer = entry.slot as ObligatoryPrayer;
          if (!options.isAlertEnabled(prayer)) continue;
          if (!options.isModeEnabled(prayer, "block")) continue;
          if (entry.time.getTime() <= Date.now()) continue;

          const activityName = `${BLOCK_SELECTION_ID}-block-${prayer}-${dayKey(entry.time)}`;
          const end = new Date(entry.time.getTime() + BLOCK_WINDOW_MINUTES * 60_000);

          await da.startMonitoring(
            activityName,
            {
              intervalStart: { hour: entry.time.getHours(), minute: entry.time.getMinutes() },
              intervalEnd: { hour: end.getHours(), minute: end.getMinutes() },
              repeats: false,
            },
            []
          );

          da.configureActions({
            activityName,
            callbackName: "intervalDidStart",
            actions: [this.iosBlockAction()],
          });
          da.configureActions({
            activityName,
            callbackName: "intervalDidEnd",
            actions: [{ type: "resetBlocks" }, { type: "disableBlockAllMode" }],
          });
        }
      }
    } catch (error) {
      if (__DEV__) console.warn("[BlockingManager] scheduleIos failed", error);
    }
  }

  private iosBlockAction(): DeviceActivityAction {
    const da = getDeviceActivity();
    const id = this.selectionId;
    if (da && id && this.hasSelection()) {
      return { type: "blockSelection", familyActivitySelectionId: id };
    }
    return { type: "enableBlockAllMode" };
  }
}

export const blockingManager = new BlockingManager();
