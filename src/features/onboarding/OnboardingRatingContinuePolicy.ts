/**
 * Timing for the rating page: request the native review sheet, then unlock Continue.
 * Mirrors common App Store review prompt UX (prompt first, never trap the user).
 */
export class OnboardingRatingContinuePolicy {
  static readonly reviewPromptDelayMs = 1000;
  static readonly continueUnlockDelayMs = 2500;
}
