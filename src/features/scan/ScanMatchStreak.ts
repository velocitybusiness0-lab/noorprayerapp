/** Requires repeated valid detections of the same target before dismiss. */
export class ScanMatchStreak {
  private count = 0;
  private lastTargetId: string | null = null;

  constructor(private readonly required = 2) {}

  get progress(): { current: number; required: number } {
    return { current: this.count, required: this.required };
  }

  /** Returns true only once the required consecutive same-target matches are reached. */
  registerMatch(matched: boolean, targetId: string | null): boolean {
    if (!matched || !targetId) {
      this.count = 0;
      this.lastTargetId = null;
      return false;
    }

    if (this.lastTargetId && this.lastTargetId !== targetId) {
      this.count = 1;
      this.lastTargetId = targetId;
      return false;
    }

    this.lastTargetId = targetId;
    this.count += 1;
    return this.count >= this.required;
  }

  reset(): void {
    this.count = 0;
    this.lastTargetId = null;
  }
}
