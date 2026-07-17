import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { sfSymbolForSlot } from "@/features/widgets/widgetSymbols";
import type { AlarmConfiguration } from "react-native-ios-alarmkit";

export interface ScheduleAlarmOptions {
  title: string;
  soundName?: string;
  tintColor?: string;
  slot?: ObligatoryPrayer;
}

const WHITE = "#FFFFFF";

/**
 * Builds AlarmKit configs with alert + snooze countdown presentations.
 * Requires the AlarmLiveActivity widget extension (`targets/widget/`).
 */
export class AlarmConfigurationBuilder {
  build(
    date: Date,
    alarmKitId: string,
    logicalId: string,
    options: ScheduleAlarmOptions
  ): AlarmConfiguration {
    return this.buildWithPresentation(date, alarmKitId, logicalId, options, "full");
  }

  /** Simpler config without snooze/countdown — used when full presentation fails. */
  buildAlertOnly(
    date: Date,
    alarmKitId: string,
    logicalId: string,
    options: ScheduleAlarmOptions
  ): AlarmConfiguration {
    return this.buildWithPresentation(date, alarmKitId, logicalId, options, "alertOnly");
  }

  private buildWithPresentation(
    date: Date,
    alarmKitId: string,
    logicalId: string,
    options: ScheduleAlarmOptions,
    variant: "full" | "alertOnly"
  ): AlarmConfiguration {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AlarmConfigurationFactory } = require("react-native-ios-alarmkit");

    const alert = {
      title: options.title,
      stopButton: {
        text: "Open Miraj",
        textColor: WHITE,
        systemImageName: "camera.viewfinder",
      },
      ...(variant === "full"
        ? {
            secondaryButton: {
              text: "Snooze",
              textColor: WHITE,
              systemImageName: "zzz",
            },
            secondaryButtonBehavior: "countdown" as const,
          }
        : {}),
    };

    const presentation =
      variant === "full"
        ? {
            alert,
            countdown: {
              title: options.title,
              pauseButton: {
                text: "Cancel",
                textColor: WHITE,
                systemImageName: "xmark.circle",
              },
            },
            paused: {
              title: "Paused",
              resumeButton: {
                text: "Resume",
                textColor: WHITE,
                systemImageName: "play.circle",
              },
            },
          }
        : { alert };

    return AlarmConfigurationFactory.alarm({
      schedule: { type: "fixed", date: date.getTime() },
      attributes: {
        presentation,
        metadata: this.metadata(alarmKitId, logicalId, options.slot),
        tintColor: options.tintColor ?? WHITE,
      },
      sound: options.soundName,
    });
  }

  private metadata(
    alarmKitId: string,
    logicalId: string,
    slot?: ObligatoryPrayer
  ): Record<string, string> {
    return {
      source: "prayer",
      logicalId,
      alarmId: alarmKitId,
      ...(slot
        ? { slot, symbol: sfSymbolForSlot(slot) }
        : {}),
    };
  }
}

export const alarmConfigurationBuilder = new AlarmConfigurationBuilder();
