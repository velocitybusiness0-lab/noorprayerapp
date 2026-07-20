/** Entrance timing for missed-graph bar growth. */
export class OnboardingMissedBarAnimationTiming {
  static readonly barMs = 820;
  static readonly staggerMs = 140;
  static readonly firstDelayMs = 280;
  static readonly heroFadeMs = 380;
  static readonly heroDelayMs = 60;
  static readonly copyRevealDelayMs = 900;

  static delayForIndex(index: number): number {
    return this.firstDelayMs + index * this.staggerMs;
  }
}
