import { OnboardingPastelTone } from "./onboarding.types";
import { ONBOARDING_INK } from "./OnboardingPastelPalette";

export interface OnboardingContinueColors {
  backgroundColor: string;
  textColor: string;
}

/** Continue CTA colors keyed to onboarding pastel tone. */
export class OnboardingContinueButtonAppearance {
  private static readonly WHITE = "#FFFFFF";
  private static readonly RED_INK = "#B91C1C";
  private static readonly BLUE_INK = "#1D4ED8";

  static isRedTone(tone: OnboardingPastelTone): boolean {
    return tone === "hardRed" || tone === "urgency";
  }

  static isBlueTone(tone: OnboardingPastelTone): boolean {
    return tone === "deepBlue" || tone === "hope";
  }

  /** White pill on red and blue pastel slides; otherwise theme accent. */
  static colors(
    tone: OnboardingPastelTone,
    themeAccent: string,
    themeOnAccent: string
  ): OnboardingContinueColors {
    if (this.isRedTone(tone)) {
      return {
        backgroundColor: this.WHITE,
        textColor: tone === "hardRed" ? this.RED_INK : ONBOARDING_INK,
      };
    }
    if (this.isBlueTone(tone)) {
      return {
        backgroundColor: this.WHITE,
        textColor: this.BLUE_INK,
      };
    }
    return {
      backgroundColor: themeAccent,
      textColor: themeOnAccent,
    };
  }
}
