import { ImageSourcePropType } from "react-native";

/** Bundled transparent stars + laurels graphic for the pre-paywall struggle beat. */
export class OnboardingPersonalizedPlanStarsLaurelsCatalog {
  static readonly source: ImageSourcePropType = require("../../../assets/onboarding/prepaywall-stars-laurels.png");

  /** Intrinsic aspect from the cropped PNG (width / height). */
  static readonly aspectRatio = 184 / 37;
}
