/**
 * Circle-aware angle helpers. Degrees are treated mod 360.
 */
export class AngularMath {
  static normalizeDegrees(degrees: number): number {
    const wrapped = degrees % 360;
    return wrapped < 0 ? wrapped + 360 : wrapped;
  }

  /**
   * Shortest signed delta from `fromDegrees` to an angle congruent with
   * `toDegrees` (mod 360). Result is in (-180, 180].
   */
  static shortestDelta(fromDegrees: number, toDegrees: number): number {
    const delta = AngularMath.normalizeDegrees(toDegrees - fromDegrees);
    return delta > 180 ? delta - 360 : delta;
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
