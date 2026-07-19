import type { AlarmButton, AlertPresentation } from "react-native-ios-alarmkit";

const WHITE = "#FFFFFF";

/**
 * Builds AlarmKit alert button presentation for prayer alarms.
 * Stop + object hunt both open Miraj via native LiveActivityIntent wiring.
 */
export class AlarmAlertPresentationFactory {
  build(title: string): AlertPresentation {
    return {
      title,
      stopButton: this.stopButton(),
      secondaryButton: this.objectHuntButton(),
      secondaryButtonBehavior: "custom",
    };
  }

  private stopButton(): AlarmButton {
    return {
      text: "Open",
      textColor: WHITE,
      systemImageName: "arrow.up.forward.app",
    };
  }

  private objectHuntButton(): AlarmButton {
    return {
      text: "Object hunt",
      textColor: WHITE,
      systemImageName: "camera.viewfinder",
    };
  }
}

export const alarmAlertPresentationFactory = new AlarmAlertPresentationFactory();
