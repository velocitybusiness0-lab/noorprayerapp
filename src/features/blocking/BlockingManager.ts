import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { dayKey } from "@/core/utils/time";
import { DayPrayerTimes, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { SalahMode } from "@/features/modes/mode.types";
import { isExpoGo } from "@/core/runtime/isExpoGo";

type DeviceActivityModule = typeof import("react-native-device-activity");
type DeviceActivityAction = import("react-native-device-activity").Action;

/** Uninitialized sentinel — module is resolved lazily on first use. */
let deviceActivityModule: DeviceActivityModule | null | undefined;

function getDeviceActivity(): DeviceActivityModule | null {
  if (isExpoGo()) return null;
  if (deviceActivityModule !== undefined) return deviceActivityModule ?? null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    deviceActivityModule = require("react-native-device-activity");
  } catch {
    deviceActivityModule = null;
  }
  return deviceActivityModule ?? null;
}

/** How long the shield stays up after a prayer starts if not dismissed. */
const BLOCK_WINDOW_MINUTES = 30;

/** Persisted id under which the user's blocked-app selection is stored. */
export const BLOCK_SELECTION_ID = "noor.blockedApps";

export interface BlockingSyncOptions {
  isAlertEnabled: (prayer: ObligatoryPrayer) => boolean;
  resolveMode: (prayer: ObligatoryPrayer) => SalahMode;
}

/**
 * Wraps `react-native-device-activity` (Screen Time / FamilyControls) to
 * shield apps at prayer time and lift the shield after a scan. All calls are
 * guarded so they are safe no-ops when Screen Time is unavailable.
 */
export class BlockingManager {
  get isAvailable(): boolean {
    const da = getDeviceActivity();
    return !!da && da.isAvailable();
  }

  async requestAuthorization(): Promise<boolean> {
    const da = getDeviceActivity();
    if (!da) return false;
    try {
      await da.requestAuthorization("individual");
      return da.getAuthorizationStatus() === da.AuthorizationStatus.approved;
    } catch {
      return false;
    }
  }

  /** Persisted id of the user's chosen app selection (from the picker). */
  get selectionId(): string | undefined {
    return storage.getString(StorageKeys.blockedSelectionId);
  }

  setSelectionId(id: string): void {
    storage.setString(StorageKeys.blockedSelectionId, id);
  }

  hasSelection(): boolean {
    const da = getDeviceActivity();
    if (!da) return false;
    const id = this.selectionId;
    return !!id && !!da.getFamilyActivitySelectionId(id);
  }

  isShieldActive(): boolean {
    const da = getDeviceActivity();
    return !!da && da.isShieldActive();
  }

  /** Immediately raise the shield (foreground / manual). */
  blockNow(): void {
    if (!getDeviceActivity()) return;
    this.applyBlockAction("manual");
  }

  /** Lift all shields (used by scan-to-unblock). */
  unblockNow(): void {
    const da = getDeviceActivity();
    if (!da) return;
    da.resetBlocks("scan-unblock");
    da.disableBlockAllMode("scan-unblock");
  }

  /**
   * Schedules Screen Time monitoring windows so the shield is applied at each
   * block-mode prayer time (via the monitor extension) and auto-lifts when the
   * window ends if the user never scanned.
   */
  async scheduleForDays(
    days: DayPrayerTimes[],
    options: BlockingSyncOptions
  ): Promise<void> {
    const da = getDeviceActivity();
    if (!da) return;
    da.stopMonitoring();

    for (const day of days) {
      for (const entry of day.entries) {
        if (!entry.isObligatory) continue;
        const prayer = entry.slot as ObligatoryPrayer;
        if (!options.isAlertEnabled(prayer)) continue;
        if (options.resolveMode(prayer) !== "block") continue;
        if (entry.time.getTime() <= Date.now()) continue;

        const activityName = `block-${prayer}-${dayKey(entry.time)}`;
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
          actions: [this.blockAction()],
        });
        da.configureActions({
          activityName,
          callbackName: "intervalDidEnd",
          actions: [{ type: "resetBlocks" }, { type: "disableBlockAllMode" }],
        });
      }
    }
  }

  private applyBlockAction(triggeredBy: string): void {
    const da = getDeviceActivity();
    if (!da) return;
    const id = this.selectionId;
    if (id && da.getFamilyActivitySelectionId(id)) {
      da.blockSelection({ activitySelectionId: id }, triggeredBy);
    } else {
      da.enableBlockAllMode(triggeredBy);
    }
  }

  private blockAction(): DeviceActivityAction {
    const da = getDeviceActivity();
    const id = this.selectionId;
    if (da && id && da.getFamilyActivitySelectionId(id)) {
      return { type: "blockSelection", familyActivitySelectionId: id };
    }
    return { type: "enableBlockAllMode" };
  }
}

export const blockingManager = new BlockingManager();
