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
        // Natural mid/upper stack under the title — avoids footer crush.
        return { justifyContent: "flex-start", paddingTop: 28 };
    }
  }
}
