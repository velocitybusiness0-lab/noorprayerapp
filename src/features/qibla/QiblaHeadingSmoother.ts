import { AngularMath } from "./AngularMath";

export interface QiblaHeadingSmootherOptions {
  /**
   * EMA blend toward the latest sample for small jitter.
   * Higher = snappier. Typical responsive range: 0.35–0.5.
   */
  alpha?: number;
  /**
   * Absolute shortest-path delta (degrees) above which the smoother
   * catches up fully so fast phone turns do not lag behind reality.
   */
  catchUpDeltaDegrees?: number;
}

/**
 * Exponential moving average over compass headings with shortest-path
 * interpolation, so 359°→1° eases across 0° instead of swinging the long way.
 * Large turns snap onto the sample; tiny jitter is lightly smoothed.
 */
export class QiblaHeadingSmoother {
  private readonly alpha: number;
  private readonly catchUpDeltaDegrees: number;
  private smoothedDegrees: number | null = null;

  constructor(options: QiblaHeadingSmootherOptions = {}) {
    this.alpha = options.alpha ?? 0.42;
    this.catchUpDeltaDegrees = options.catchUpDeltaDegrees ?? 12;
  }

  /**
   * Ingests a raw device heading and returns a smoothed heading in [0, 360).
   */
  push(rawDegrees: number): number {
    const target = AngularMath.normalizeDegrees(rawDegrees);

    if (this.smoothedDegrees === null) {
      this.smoothedDegrees = target;
      return this.smoothedDegrees;
    }

    const delta = AngularMath.shortestDelta(this.smoothedDegrees, target);
    const blend =
      Math.abs(delta) >= this.catchUpDeltaDegrees ? 1 : this.alpha;

    this.smoothedDegrees = AngularMath.normalizeDegrees(
      this.smoothedDegrees + delta * blend
    );
    return this.smoothedDegrees;
  }

  reset(): void {
    this.smoothedDegrees = null;
  }
}
