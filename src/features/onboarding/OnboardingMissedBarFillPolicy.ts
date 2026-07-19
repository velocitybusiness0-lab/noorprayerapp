/** Per-period bar fill: each column fills its own track; labels carry scale. */
export class OnboardingMissedBarFillPolicy {
  /** Full height when the period has any missed count; empty when zero. */
  static fillRatio(value: number): number {
    return value > 0 ? 1 : 0;
  }
}
