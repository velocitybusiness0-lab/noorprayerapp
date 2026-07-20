import { OnboardingPastelTone } from "./onboarding.types";
import { OnboardingStepFadeTiming } from "./OnboardingStepFadeTiming";

/**
 * Shell background blend duration. Urgency/hope slideshow tones switch
 * instantly so the page color never lags behind the active slide.
 */
export class OnboardingShellBackgroundTiming {
  private static isInstantSlideshowTone(tone: OnboardingPastelTone): boolean {
    return tone === "hardRed" || tone === "deepBlue" || tone === "hope";
  }

  static durationMs(
    tone: OnboardingPastelTone,
    previousTone?: OnboardingPastelTone
  ): number {
    if (this.isInstantSlideshowTone(tone)) {
      return 0;
    }
    if (previousTone && this.isInstantSlideshowTone(previousTone)) {
      return 0;
    }
    return OnboardingStepFadeTiming.backgroundMs;
  }
}
