export type CalculationChecklistStatus = "completed" | "current" | "upcoming";

/**
 * Times checklist row status across the calculation duration.
 * Spreads completions evenly so the final task finishes just before completion.
 */
export class OnboardingCalculationChecklistProgress {
  private readonly taskCount: number;
  private readonly stepMs: number;

  constructor(taskCount: number, durationMs: number) {
    this.taskCount = Math.max(taskCount, 0);
    this.stepMs = this.taskCount > 0 ? durationMs / this.taskCount : durationMs;
  }

  /** Index of the task currently in progress (−1 when all are done). */
  currentIndexAt(elapsedMs: number): number {
    if (this.taskCount === 0) return -1;
    const completed = Math.min(
      Math.floor(elapsedMs / this.stepMs),
      this.taskCount
    );
    if (completed >= this.taskCount) return -1;
    return completed;
  }

  statusAt(elapsedMs: number): CalculationChecklistStatus[] {
    const current = this.currentIndexAt(elapsedMs);
    return Array.from({ length: this.taskCount }, (_, index) => {
      if (current < 0 || index < current) return "completed";
      if (index === current) return "current";
      return "upcoming";
    });
  }

  /** Poll interval for advancing checklist UI during calculation. */
  static readonly tickMs = 80;
}
