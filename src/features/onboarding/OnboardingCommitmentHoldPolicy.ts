import { ImpactFeedbackStyle } from "expo-haptics";

/** Hold-to-confirm rules for the commitment lock-in CTA. */
export class OnboardingCommitmentHoldPolicy {
  static readonly holdDurationMs = 1400;
  /** Fire a tick haptic every 10% of fill progress. */
  static readonly hapticMilestoneFraction = 0.1;

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

  /** 0-based milestone index for progress ticks (every 10%). */
  static hapticMilestoneIndex(progress: number): number {
    return Math.floor(progress / this.hapticMilestoneFraction);
  }

  /** Escalates light → medium → heavy as the fill advances. */
  static impactStyleForProgress(progress: number): ImpactFeedbackStyle {
    if (progress < 0.33) return ImpactFeedbackStyle.Light;
    if (progress < 0.66) return ImpactFeedbackStyle.Medium;
    return ImpactFeedbackStyle.Heavy;
  }
}
