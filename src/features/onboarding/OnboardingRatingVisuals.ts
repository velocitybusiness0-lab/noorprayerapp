import { ImageSourcePropType, Platform, TextStyle } from "react-native";

export type OnboardingRatingLaurelSide = "leading" | "trailing";

/** Bundled transparent laurel PNGs for the rating stars row. */
export class OnboardingRatingLaurelCatalog {
  private static readonly sources: Record<
    OnboardingRatingLaurelSide,
    ImageSourcePropType
  > = {
    leading: require("../../../assets/onboarding/rating-laurel-left.png"),
    trailing: require("../../../assets/onboarding/rating-laurel-right.png"),
  };

  static sourceFor(side: OnboardingRatingLaurelSide): ImageSourcePropType {
    return this.sources[side];
  }
}

/**
 * Rating-step typography: SF Pro via System on iOS, clean sans on Android.
 */
export class OnboardingRatingTypography {
  static readonly fontFamily = Platform.select({
    ios: "System",
    default: "sans-serif",
  });

  static style(overrides: TextStyle = {}): TextStyle {
    return {
      fontFamily: this.fontFamily,
      ...overrides,
    };
  }
}
