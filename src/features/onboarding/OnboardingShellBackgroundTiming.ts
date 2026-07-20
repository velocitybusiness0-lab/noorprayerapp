import { OnboardingPastelPalette } from "./OnboardingPastelPalette";
import { OnboardingPastelTone } from "./onboarding.types";
import { OnboardingStepFadeTiming } from "./OnboardingStepFadeTiming";

/**
 * Shell background blend duration. Dark red/blue slideshow tones switch
 * instantly so the page color never lags behind the active slide.
 */
export class OnboardingShellBackgroundTiming {
  static durationMs(
    tone: OnboardingPastelTone,
    previousTone?: OnboardingPastelTone
  ): number {
    if (OnboardingPastelPalette.isDarkTone(tone)) {
      return 0;
    }
    if (previousTone && OnboardingPastelPalette.isDarkTone(previousTone)) {
      return 0;
    }
    return OnboardingStepFadeTiming.backgroundMs;
  }
}
