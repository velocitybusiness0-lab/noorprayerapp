import { AngularMath } from "./AngularMath";

/**
 * Tracks a continuous (unwrapped) angle so UI rotation never teleports when
 * the normalized target wraps across 0°/360°.
 */
export class ContinuousAngleTracker {
  private continuousDegrees: number | null = null;

  /**
   * Returns the unwrapped angle nearest the previous value that matches
   * `targetDegrees` modulo 360.
   */
  next(targetDegrees: number): number {
    if (this.continuousDegrees === null) {
      this.continuousDegrees = targetDegrees;
      return this.continuousDegrees;
    }

    this.continuousDegrees += AngularMath.shortestDelta(
      this.continuousDegrees,
      targetDegrees
    );
    return this.continuousDegrees;
  }

  reset(): void {
    this.continuousDegrees = null;
  }
}
