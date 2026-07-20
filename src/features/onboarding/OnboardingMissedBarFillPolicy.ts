/**
 * Visual bar heights for the missed-prayer chart.
 * Softened scale so day/week stay readable next to the year total.
 */
export class OnboardingMissedBarFillPolicy {
  static readonly trackHeight = 96;
  private static readonly minVisibleRatio = 0.1;
  private static readonly softenExponent = 0.42;

  static fillRatio(value: number, maxValue: number): number {
    if (value <= 0 || maxValue <= 0) return 0;
    const linear = Math.min(1, value / maxValue);
    const softened = Math.pow(linear, this.softenExponent);
    return Math.max(this.minVisibleRatio, softened);
  }

  static fillHeight(value: number, maxValue: number): number {
    return this.fillRatio(value, maxValue) * this.trackHeight;
  }
}
