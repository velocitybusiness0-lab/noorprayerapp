import type { AlarmButton, AlertPresentation } from "react-native-ios-alarmkit";

const WHITE = "#FFFFFF";

/**
 * Builds AlarmKit alert button presentation for prayer alarms.
 * Primary stop (“Open” / swipe) and secondary (“Continue”) both run
 * MirajOpenAlarmIntent → `/alarm/ring`. Object hunt starts only after the
 * in-app Continue button.
 */
export class AlarmAlertPresentationFactory {
  build(title: string): AlertPresentation {
    return {
      title,
      stopButton: this.openButton(),
      secondaryButton: this.continueButton(),
      secondaryButtonBehavior: "custom",
    };
  }

  /** Lock-screen primary swipe / stop control — opens Continue gate. */
  private openButton(): AlarmButton {
    return {
      text: "Open",
      textColor: WHITE,
      systemImageName: "arrow.up.forward.app",
    };
  }

  /** Secondary lock-screen button — same Continue-gate handoff. */
  private continueButton(): AlarmButton {
    return {
      text: "Continue",
      textColor: WHITE,
      systemImageName: "arrow.right.circle",
    };
  }
}

export const alarmAlertPresentationFactory = new AlarmAlertPresentationFactory();
