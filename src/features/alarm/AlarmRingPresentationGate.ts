/**
 * Tracks whether the Continue / ring screen has actually mounted for the
 * active alarm. Prevents treating a failed or backgrounded `router.replace`
 * as a completed presentation while audio keeps playing.
 */
export class AlarmRingPresentationGate {
  private requestedAlarmId: string | null = null;
  private presentedAlarmId: string | null = null;

  markRequested(alarmId: string): void {
    if (this.requestedAlarmId !== alarmId) {
      this.presentedAlarmId = null;
    }
    this.requestedAlarmId = alarmId;
  }

  /** Ring (or hunt) screen mounted — visible alarm UI is on screen. */
  markPresented(alarmId: string): void {
    this.requestedAlarmId = alarmId;
    this.presentedAlarmId = alarmId;
  }

  clear(): void {
    this.requestedAlarmId = null;
    this.presentedAlarmId = null;
  }

  isPresented(alarmId: string): boolean {
    return this.presentedAlarmId === alarmId;
  }

  /** True when ringing was requested but the ring screen has not mounted yet. */
  needsPresentation(alarmId?: string): boolean {
    if (!this.requestedAlarmId) return false;
    if (alarmId && this.requestedAlarmId !== alarmId) return false;
    return this.presentedAlarmId !== this.requestedAlarmId;
  }

  get pendingAlarmId(): string | null {
    if (!this.needsPresentation()) return null;
    return this.requestedAlarmId;
  }
}

export const alarmRingPresentationGate = new AlarmRingPresentationGate();
