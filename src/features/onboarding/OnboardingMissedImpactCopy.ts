/** Impact copy for the missed salah reveal step. */
export class OnboardingMissedImpactCopy {
  static formatCount(value: number): string {
    return value.toLocaleString("en-US");
  }

  /** Primary cost label under the bar chart. */
  static costTitle(): string {
    return "dua chances lost";
  }

  /** Supporting line under the chart tying namaz → lost connection. */
  static costSub(daily: number): string {
    if (daily <= 0) {
      return "every salah is still a chance to talk to Allah";
    }
    return "every missed namaz is a dua you never made";
  }
}
