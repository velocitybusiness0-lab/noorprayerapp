import { Href } from "expo-router";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

/**
 * Builds the alarm continue / ring gate path shown before object hunt.
 */
export class AlarmRingRouteBuilder {
  build(slot: ObligatoryPrayer, alarmId: string): Href {
    return {
      pathname: "/alarm/ring",
      params: { slot, alarmId },
    } as Href;
  }

  /** Deep-link entry used by AlarmKit open-app intents (lock-screen → Continue). */
  deepLinkPath(alarmId: string): Href {
    return {
      pathname: "/alarm/ring",
      params: { alarmId },
    } as Href;
  }
}

export const alarmRingRouteBuilder = new AlarmRingRouteBuilder();
