type DeadlineHandler = () => void;

/**
 * Fires a callback at a wall-clock deadline. Re-aligns near the target so
 * long setTimeout drift does not make the alarm late.
 */
export class ExactDeadlineScheduler {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  schedule(id: string, deadlineMs: number, onFire: DeadlineHandler): void {
    this.cancel(id);

    const tick = () => {
      const remaining = deadlineMs - Date.now();
      if (remaining <= 0) {
        this.timers.delete(id);
        onFire();
        return;
      }

      // Long waits: wake 1s early and re-measure. Short waits: sleep exact remainder.
      const delay =
        remaining > 2_000 ? Math.min(remaining - 1_000, 30_000) : remaining;

      const timer = setTimeout(tick, Math.max(0, delay));
      this.timers.set(id, timer);
    };

    tick();
  }

  cancel(id: string): void {
    const timer = this.timers.get(id);
    if (!timer) return;
    clearTimeout(timer);
    this.timers.delete(id);
  }

  cancelAll(): void {
    for (const id of [...this.timers.keys()]) this.cancel(id);
  }
}
