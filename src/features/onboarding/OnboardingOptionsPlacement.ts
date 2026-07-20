import { ViewStyle } from "react-native";

export type OnboardingOptionsPlacementKind = "start" | "center" | "end";

/** Resolves vertical placement of option lists within a question step. */
export class OnboardingOptionsPlacement {
  static resolve(
    placement: OnboardingOptionsPlacementKind | undefined
  ): ViewStyle {
    switch (placement) {
      case "end":
        return { justifyContent: "flex-end" };
      case "center":
        return { justifyContent: "center" };
      case "start":
      default:
        // Slightly lower under the title — keeps Continue / keyboard clear.
        return { justifyContent: "flex-start", paddingTop: 44 };
    }
  }
}
