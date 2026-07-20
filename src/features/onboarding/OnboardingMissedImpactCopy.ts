/** Impact copy for the missed salah reveal step. */
export class OnboardingMissedImpactCopy {
  static formatCount(value: number): string {
    return value.toLocaleString("en-US");
  }

  /** Caption under the large yearly miss total. */
  static yearlyMissLabel(): string {
    return "Namaz missed in the last year";
  }
}
