import { Detection } from "./detection/ObjectDetector";
import { ScanManager } from "./ScanManager";
import { ScanMatchStreak } from "./ScanMatchStreak";
import { ScanTarget } from "./scanTargets";

export interface ScanDetectionOutcome {
  message: string;
  streakProgress: { current: number; required: number };
  succeeded: boolean;
  matchedTarget: ScanTarget | null;
}

/** Applies detector output to the object-hunt streak and mission rules. */
export class ScanDetectionEvaluator {
  constructor(
    private readonly manager: ScanManager,
    private readonly streak: ScanMatchStreak,
  ) {}

  evaluate(rawDetections: Detection[]): ScanDetectionOutcome {
    const result = this.manager.evaluate(rawDetections);

    if (result.matched) {
      const progress = this.streak.progress;
      const done = this.streak.registerMatch(true, result.target?.id ?? null);
      return {
        message: done
          ? `Confirmed: ${result.target?.label}`
          : `Hold steady… ${progress.current + 1}/${progress.required}`,
        streakProgress: this.streak.progress,
        succeeded: done,
        matchedTarget: done ? result.target : null,
      };
    }

    this.streak.registerMatch(false, null);
    return {
      message: result.message,
      streakProgress: this.streak.progress,
      succeeded: false,
      matchedTarget: null,
    };
  }

  reset(): void {
    this.streak.reset();
  }

  get initialStreakProgress(): { current: number; required: number } {
    return this.streak.progress;
  }
}
