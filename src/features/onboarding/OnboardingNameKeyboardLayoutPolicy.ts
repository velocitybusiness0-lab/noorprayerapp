import { ViewStyle } from "react-native";

/** Vertical layout for the name step when the keyboard is open vs dismissed. */
export class OnboardingNameKeyboardLayoutPolicy {
  static readonly compactTopPadding = 8;
  static readonly compactFieldGap = 8;
  static readonly relaxedFieldGap = 12;
  static readonly compactAgeLabelMarginTop = 12;
  static readonly relaxedAgeLabelMarginTop = 28;
  static readonly compactInputMarginTop = 8;
  static readonly relaxedInputMarginTop = 16;

  /** Top-align when compact so name + age stay above Continue + keyboard. */
  static rootStyle(compact: boolean): ViewStyle {
    if (compact) {
      return {
        justifyContent: "flex-start",
        paddingTop: this.compactTopPadding,
      };
    }
    return {
      justifyContent: "center",
      paddingTop: 0,
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
