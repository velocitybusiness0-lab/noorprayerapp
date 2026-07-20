import { Appearance } from "react-native";

/**
 * Session lock that forces React Native's app color scheme to light while
 * onboarding is visible, then restores system-following behavior on release.
 * Does not change the persisted ThemeProvider mode preference.
 */
export class OnboardingColorSchemeLock {
  private static activeCount = 0;

  static engage(): void {
    this.activeCount += 1;
    if (this.activeCount === 1) {
      Appearance.setColorScheme("light");
    }
  }

  static release(): void {
    if (this.activeCount === 0) return;
    this.activeCount -= 1;
    if (this.activeCount === 0) {
      Appearance.setColorScheme(null);
    }
  }
}
