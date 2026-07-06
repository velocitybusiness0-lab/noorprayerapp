import { isExpoGo } from "@/core/runtime/isExpoGo";

type AuthorizationState = "notDetermined" | "denied" | "approved";

interface AlarmConfiguration {
  countdownDuration: { preAlert: number; postAlert: number };
  schedule: { type: "fixed"; date: number };
  presentation: {
    alert: {
      title: string;
      stopButton: { text: string; textColor: string; systemImageName: string };
      secondaryButton: { text: string; textColor: string; systemImageName: string };
      secondaryButtonBehavior: "countdown";
    };
  };
  tintColor: string;
  soundName?: string;
  metadata?: Record<string, string>;
}

interface AlarmKitModule {
  isSupported: boolean;
  getAuthorizationState: () => Promise<AuthorizationState>;
  requestAuthorization: () => Promise<boolean>;
  cancel: (id: string) => Promise<void>;
  stop: (id: string) => Promise<void>;
}

interface AlarmKitManagerModule {
  shared: {
    scheduleOrReschedule: (
      id: string,
      configuration: AlarmConfiguration
    ) => Promise<unknown>;
  };
}

let alarmKitModule: AlarmKitModule | null | undefined;
let alarmKitManager: AlarmKitManagerModule | null | undefined;

function getAlarmKit(): AlarmKitModule | null {
  if (isExpoGo()) return null;
  if (alarmKitModule !== undefined) return alarmKitModule ?? null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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

export interface ScheduleAlarmOptions {
  title: string;
  soundName?: string;
  tintColor?: string;
}

/**
 * Wraps `react-native-ios-alarmkit` behind a small domain API. Uses a
 * one-shot `fixed` schedule so each prayer alarm fires at an exact time.
 * All methods are safe no-ops on unsupported platforms (Android / iOS < 26).
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

  /** Schedules (or reschedules) a prominent alarm at an exact date. */
  async scheduleAt(
    id: string,
    date: Date,
    options: ScheduleAlarmOptions
  ): Promise<boolean> {
    const manager = getAlarmKitManager();
    if (!manager || !this.isSupported) return false;
    if (date.getTime() <= Date.now()) return false;

    const configuration: AlarmConfiguration = {
      countdownDuration: { preAlert: 0, postAlert: 0 },
      schedule: { type: "fixed", date: date.getTime() },
      presentation: {
        alert: {
          title: options.title,
          stopButton: {
            text: "Scan to dismiss",
            textColor: "#FFFFFF",
            systemImageName: "camera.viewfinder",
          },
          secondaryButton: {
            text: "Snooze",
            textColor: "#FFFFFF",
            systemImageName: "zzz",
          },
          secondaryButtonBehavior: "countdown",
        },
      },
      tintColor: options.tintColor ?? "#FFFFFF",
      soundName: options.soundName,
      metadata: { source: "prayer" },
    };

    const alarm = await manager.shared.scheduleOrReschedule(id, configuration);
    return alarm !== null;
  }

  async cancel(id: string): Promise<void> {
    const kit = getAlarmKit();
    if (!kit || !this.isSupported) return;
    await kit.cancel(id);
  }

  async stop(id: string): Promise<void> {
    const kit = getAlarmKit();
    if (!kit || !this.isSupported) return;
    await kit.stop(id);
  }
}

export const alarmManager = new AlarmManager();
