import { ViewStyle } from "react-native";

/** Vertical layout for the name step when the keyboard is open vs dismissed. */
export class OnboardingNameKeyboardLayoutPolicy {
  static readonly compactTopPadding = 4;
  static readonly relaxedTopPadding = 8;
  static readonly compactFieldGap = 8;
  static readonly relaxedFieldGap = 12;
  static readonly compactAgeLabelMarginTop = 10;
  static readonly relaxedAgeLabelMarginTop = 20;
  static readonly compactInputMarginTop = 6;
  static readonly relaxedInputMarginTop = 12;

  /** Top-align so fields stay visible above Continue + keyboard. */
  static rootStyle(compact: boolean): ViewStyle {
    return {
      justifyContent: "flex-start",
      paddingTop: compact ? this.compactTopPadding : this.relaxedTopPadding,
    };
  }

  static fieldGap(compact: boolean): number {
    return compact ? this.compactFieldGap : this.relaxedFieldGap;
  }

  static ageLabelMarginTop(compact: boolean): number {
    return compact
      ? this.compactAgeLabelMarginTop
      : this.relaxedAgeLabelMarginTop;
  }

  static inputMarginTop(compact: boolean): number {
    return compact ? this.compactInputMarginTop : this.relaxedInputMarginTop;
  }
}
