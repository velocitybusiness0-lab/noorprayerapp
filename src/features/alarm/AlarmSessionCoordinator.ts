export type AlarmSessionPhase = "idle" | "ringing" | "dismissing" | "done";

/**
 * Owns the active alarm lifecycle. Blocks scheduler resync while ringing or
 * dismissing so AlarmKit is not cancelled mid-flow.
 */
class AlarmSessionCoordinator {
  private phase: AlarmSessionPhase = "idle";
  private alarmId: string | null = null;

  get currentPhase(): AlarmSessionPhase {
    return this.phase;
  }

  get currentAlarmId(): string | null {
    return this.alarmId;
  }

  /** True while an alarm is ringing or the user is dismissing it. */
  blocksScheduling(): boolean {
    return this.phase === "ringing" || this.phase === "dismissing";
  }

  isActive(alarmId?: string): boolean {
    if (this.phase === "idle" || this.phase === "done") return false;
    if (!alarmId) return true;
    return this.alarmId === alarmId;
  }

  onAlarmFired(alarmId: string): void {
    if (this.phase === "dismissing" && this.alarmId === alarmId) return;
    this.alarmId = alarmId;
    this.phase = "ringing";
  }

  onRingOrScanOpen(alarmId: string): void {
    this.alarmId = alarmId;
    this.phase = "dismissing";
  }

  onDismissed(): void {
    this.phase = "done";
    this.alarmId = null;
    this.phase = "idle";
  }
}

export const alarmSessionCoordinator = new AlarmSessionCoordinator();
