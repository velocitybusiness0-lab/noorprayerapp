import { Platform, TextStyle } from "react-native";

/**
 * Plan-step typography: SF Pro via System on iOS, clean sans on Android.
 * Matches the rating page so onboarding stays visually consistent.
 */
export class OnboardingPersonalizedPlanTypography {
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
