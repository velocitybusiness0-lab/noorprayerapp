import { ImageSourcePropType } from "react-native";
import { OnboardingSlideGraphicType } from "./onboarding.types";

export interface OnboardingSlideGraphicFrameSize {
  width: number;
  height: number;
}

/** Maps slideshow graphic keys to bundled illustration assets and frame sizes. */
export class OnboardingSlideGraphicCatalog {
  private static readonly sources: Record<
    OnboardingSlideGraphicType,
    ImageSourcePropType
  > = {
    domino: require("../../../assets/onboarding/red-slide-1-momentum.png"),
    hourglass: require("../../../assets/onboarding/red-slide-2-door.png"),
    summit: require("../../../assets/onboarding/blue-slide-mountain.png"),
    welcomeMiraj: require("../../../assets/onboarding/welcome-slide-1-miraj.png"),
    welcomeAlarms: require("../../../assets/onboarding/welcome-slide-2-alarms.png"),
    welcomeConsistency: require("../../../assets/onboarding/welcome-slide-3-consistency.png"),
  };

  private static readonly urgencyFrame: OnboardingSlideGraphicFrameSize = {
    width: 280,
    height: 220,
  };

  private static readonly welcomeFrame: OnboardingSlideGraphicFrameSize = {
    width: 300,
    height: 280,
  };

  static sourceFor(type: OnboardingSlideGraphicType): ImageSourcePropType {
    return this.sources[type];
  }

  static frameSizeFor(
    type: OnboardingSlideGraphicType
  ): OnboardingSlideGraphicFrameSize {
    if (
      type === "welcomeMiraj" ||
      type === "welcomeAlarms" ||
      type === "welcomeConsistency"
    ) {
      return this.welcomeFrame;
    }
    return this.urgencyFrame;
  }
}
