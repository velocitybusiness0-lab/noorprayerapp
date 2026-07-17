import { alarmAlertTracker } from "./AlarmAlertTracker";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { devAlarmKeepRegistry } from "./DevAlarmKeepRegistry";

type AlarmKitAlarm = { id: string };

interface AlarmKitModule {
  cancel: (id: string) => Promise<void>;
}

interface AlarmKitManagerModule {
  shared: {
    getAlarms: () => Promise<AlarmKitAlarm[]>;
  };
}

/**
 * Drops native AlarmKit entries that are not part of the next sync window so
 * iOS alarm slots are free before bulk scheduling.
 */
export class AlarmNativeReconciler {
  async cancelStaleAlarms(
    kit: AlarmKitModule,
    manager: AlarmKitManagerModule,
    keepIds: ReadonlySet<string>
  ): Promise<number> {
    const nativeAlarms = await manager.shared.getAlarms();
    let cancelled = 0;

    for (const alarm of nativeAlarms) {
      if (keepIds.has(alarm.id)) continue;
      if (devAlarmKeepRegistry.has(alarm.id)) continue;
      if (alarmSessionCoordinator.isActive(alarm.id)) continue;
      if (alarmAlertTracker.isAlerting(alarm.id)) continue;
      try {
        await kit.cancel(alarm.id);
        cancelled += 1;
      } catch {
        // Best-effort cleanup.
      }
    }

    return cancelled;
  }
}

export const alarmNativeReconciler = new AlarmNativeReconciler();
