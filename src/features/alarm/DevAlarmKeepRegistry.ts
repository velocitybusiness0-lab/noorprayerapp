/**
 * Retains dev-only AlarmKit ids during prayer sync so a scheduled test alarm
 * is not cancelled before it fires.
 */
export class DevAlarmKeepRegistry {
  private keepIds = new Set<string>();

  retain(alarmKitId: string): void {
    if (!__DEV__) return;
    this.keepIds.add(alarmKitId);
  }

  release(alarmKitId: string): void {
    this.keepIds.delete(alarmKitId);
  }

  has(alarmKitId: string): boolean {
    return __DEV__ && this.keepIds.has(alarmKitId);
  }
}

export const devAlarmKeepRegistry = new DevAlarmKeepRegistry();
