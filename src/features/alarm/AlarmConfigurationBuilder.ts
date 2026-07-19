import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { sfSymbolForSlot } from "@/features/widgets/widgetSymbols";
import type { AlarmConfiguration } from "react-native-ios-alarmkit";
import { alarmAlertPresentationFactory } from "./AlarmAlertPresentationFactory";

export interface ScheduleAlarmOptions {
  title: string;
  soundName?: string;
  tintColor?: string;
  slot?: ObligatoryPrayer;
}

const WHITE = "#FFFFFF";

/**
 * Builds AlarmKit configs for prayer alarms.
 * Alert-only (no snooze/X cancel) — sound stops only after object hunt.
 * Stop + secondary both open Miraj via native LiveActivityIntent.
 */
export class AlarmConfigurationBuilder {
  build(
    date: Date,
    alarmKitId: string,
    logicalId: string,
    options: ScheduleAlarmOptions
  ): AlarmConfiguration {
    return this.buildAlertOnly(date, alarmKitId, logicalId, options);
  }

  /** Prayer alarms: stop + object hunt open Miraj; no snooze countdown cancel (X). */
  buildAlertOnly(
    date: Date,
    alarmKitId: string,
    logicalId: string,
    options: ScheduleAlarmOptions
  ): AlarmConfiguration {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AlarmConfigurationFactory } = require("react-native-ios-alarmkit");

    return AlarmConfigurationFactory.create({
      countdownDuration: {
        preAlert: 0,
        // No post-alert snooze window — stop/X would otherwise leave a cancel UI.
        postAlert: 0,
      },
      schedule: { type: "fixed", date: date.getTime() },
      attributes: {
        presentation: {
          alert: alarmAlertPresentationFactory.build(options.title),
        },
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
