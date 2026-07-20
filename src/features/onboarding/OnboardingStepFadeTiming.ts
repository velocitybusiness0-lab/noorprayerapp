import { Easing } from "react-native-reanimated";

/** Timing for onboarding page-to-page content fades (chrome stays fixed). */
export class OnboardingStepFadeTiming {
  static readonly fadeOutMs = 170;
  static readonly fadeInMs = 240;

  static readonly easing = Easing.out(Easing.cubic);

  /** Soft shell background blend while content crossfades. */
  static readonly backgroundMs = this.fadeOutMs + this.fadeInMs;
}
