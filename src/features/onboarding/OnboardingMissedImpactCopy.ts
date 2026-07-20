/** Impact copy for the missed salah reveal step. */
export class OnboardingMissedImpactCopy {
  static formatCount(value: number): string {
    return value.toLocaleString("en-US");
  }

  /** Caption under the large yearly miss total. */
  static yearlyMissLabel(): string {
    return "Salah missed in the last year";
  }

  /** Dua line shown beneath the bar graph. */
  static missedDuaLine(): string {
    return "Every missed salah is a dua you never made.";
  }
}
