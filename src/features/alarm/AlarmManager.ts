import { Platform } from "react-native";
import { isExpoGo } from "@/core/runtime/isExpoGo";
import { alarmKitUuidForKey, resolveAlarmKitId } from "./AlarmKitUuid";
import { alarmConfigurationBuilder, type ScheduleAlarmOptions } from "./AlarmConfigurationBuilder";
import { alarmNativeReconciler } from "./AlarmNativeReconciler";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { alarmAlertTracker } from "./AlarmAlertTracker";

export type { ScheduleAlarmOptions };

type AuthorizationState = "notDetermined" | "authorized" | "denied";

interface AlarmKitModule {
  isSupported: boolean;
  getAuthorizationState: () => Promise<AuthorizationState>;
  requestAuthorization: () => Promise<boolean>;
  cancel: (id: string) => Promise<void>;
  stop: (id: string) => Promise<void>;
}

interface AlarmKitManagerModule {
  shared: {
    scheduleOrReschedule: (id: string, configuration: unknown) => Promise<unknown>;
    getAlarms: () => Promise<{ id: string }[]>;
  };
}

let alarmKitModule: AlarmKitModule | null | undefined;
let alarmKitManager: AlarmKitManagerModule | null | undefined;

function getAlarmKit(): AlarmKitModule | null {
  if (isExpoGo() || Platform.OS !== "ios") {
    alarmKitModule = null;
    alarmKitManager = null;
    return null;
  }
  if (alarmKitModule !== undefined) return alarmKitModule ?? null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("react-native-ios-alarmkit");
    alarmKitModule = mod.default ?? mod;
    alarmKitManager = mod.AlarmKitManager ?? null;
  } catch {
    alarmKitModule = null;
    alarmKitManager = null;
  }
  return alarmKitModule ?? null;
}

function getAlarmKitManager(): AlarmKitManagerModule | null {
  if (alarmKitModule === undefined) getAlarmKit();
  return alarmKitManager ?? null;
}

function logScheduleFailure(logicalId: string, error: unknown): void {
  if (!__DEV__) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AlarmKitError } = require("react-native-ios-alarmkit");
    const wrapped = AlarmKitError.fromError(error);
    console.warn(`[AlarmManager] schedule failed for ${logicalId}: ${wrapped.code} — ${wrapped.message}`);
  } catch {
    console.warn(`[AlarmManager] schedule failed for ${logicalId}`, error);
  }
}

/**
 * Wraps `react-native-ios-alarmkit` behind a small domain API.
 */
export class AlarmManager {
  get isSupported(): boolean {
    const kit = getAlarmKit();
    return !!kit && kit.isSupported;
  }

  async getAuthorizationState(): Promise<AuthorizationState> {
    const kit = getAlarmKit();
    if (!kit || !this.isSupported) return "denied";
    return kit.getAuthorizationState();
  }

  async requestAuthorization(): Promise<boolean> {
    const kit = getAlarmKit();
    if (!kit || !this.isSupported) return false;
    return kit.requestAuthorization();
  }

  async isAuthorized(): Promise<boolean> {
    return (await this.getAuthorizationState()) === "authorized";
  }

  /** Cancels native alarms outside the desired sync set (skips active sessions). */
  async reconcileNativeAlarms(keepIds: ReadonlySet<string>): Promise<void> {
    const kit = getAlarmKit();
    const manager = getAlarmKitManager();
    if (!kit || !manager || !this.isSupported) return;

    try {
      const cancelled = await alarmNativeReconciler.cancelStaleAlarms(kit, manager, keepIds);
      if (__DEV__ && cancelled > 0) {
        console.info(`[AlarmManager] cleared ${cancelled} stale AlarmKit alarm(s)`);
      }
    } catch (error) {
      if (__DEV__) console.warn("[AlarmManager] reconcileNativeAlarms failed", error);
    }
  }

  async scheduleAt(
    logicalId: string,
    date: Date,
    options: ScheduleAlarmOptions
  ): Promise<string | null> {
    const manager = getAlarmKitManager();
    if (!manager || !this.isSupported) return null;
    if (date.getTime() <= Date.now()) return null;
    if (!(await this.isAuthorized())) {
      if (__DEV__) console.info("[AlarmManager] AlarmKit authorization not granted");
      return null;
    }

    const alarmKitId = alarmKitUuidForKey(logicalId);
    const configuration = alarmConfigurationBuilder.buildAlertOnly(
      date,
      alarmKitId,
      logicalId,
      options
    );

    try {
      const alarm = await manager.shared.scheduleOrReschedule(alarmKitId, configuration);
      return alarm !== null ? alarmKitId : null;
    } catch (error) {
      logScheduleFailure(logicalId, error);
      return null;
    }
  }

  async cancel(id: string): Promise<void> {
    if (alarmSessionCoordinator.isActive(id)) return;
    if (alarmAlertTracker.isAlerting(id)) return;
    const kit = getAlarmKit();
    const kitId = resolveAlarmKitId(id);
    if (!kit || !this.isSupported || !kitId) return;
    try {
      await kit.cancel(kitId);
    } catch {
      return;
    }
  }

  async stop(id: string): Promise<void> {
    const kit = getAlarmKit();
    const kitId = resolveAlarmKitId(id);
    if (!kit || !this.isSupported || !kitId) return;
    try {
      await kit.stop(kitId);
    } catch {
      return;
    }
  }
}

export const alarmManager = new AlarmManager();
