/** Hold-to-confirm rules for the commitment lock-in CTA. */
export class OnboardingCommitmentHoldPolicy {
  static readonly holdDurationMs = 1400;

  static canBeginHold(hasSignature: boolean): boolean {
    return hasSignature;
  }

  static progressForElapsed(elapsedMs: number): number {
    if (elapsedMs <= 0) return 0;
    return Math.min(1, elapsedMs / this.holdDurationMs);
  }

  static isComplete(elapsedMs: number): boolean {
    return elapsedMs >= this.holdDurationMs;
  }
}
