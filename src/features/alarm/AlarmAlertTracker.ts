/** Tracks AlarmKit ids currently in the alerting state (from native updates). */
class AlarmAlertTracker {
  private alerting = new Set<string>();

  sync(ids: string[]): void {
    this.alerting = new Set(ids);
  }

  isAlerting(alarmId: string): boolean {
    return this.alerting.has(alarmId);
  }

  hasAnyAlerting(): boolean {
    return this.alerting.size > 0;
  }

  clear(alarmId: string): void {
    this.alerting.delete(alarmId);
  }
}

export const alarmAlertTracker = new AlarmAlertTracker();
