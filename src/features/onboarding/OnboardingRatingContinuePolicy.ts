/**
 * Timing for the rating page: unlock Continue after content has settled.
 * Does not trigger a native Store Review sheet.
 */
export class OnboardingRatingContinuePolicy {
  static readonly continueUnlockDelayMs = 1200;
}
