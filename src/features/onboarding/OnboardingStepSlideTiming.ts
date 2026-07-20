import { Easing } from "react-native-reanimated";

/** Timing for question-page horizontal slides (chrome stays fixed). */
export class OnboardingStepSlideTiming {
  static readonly exitMs = 260;
  static readonly enterMs = 300;

  static readonly easing = Easing.bezier(0.22, 1, 0.36, 1);

  /** Soft opacity dip while content travels horizontally. */
  static readonly exitOpacity = 0.12;
  static readonly enterStartOpacity = 0.12;
}
