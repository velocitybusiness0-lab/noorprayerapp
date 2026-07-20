import { Href } from "expo-router";
import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

/**
 * Builds the in-app object-hunt (scan disarm) path after Continue on the ring gate.
 */
export class AlarmObjectHuntRouteBuilder {
  build(slot: ObligatoryPrayer, alarmId: string): Href {
    return {
      pathname: "/scan/[purpose]",
      params: { purpose: "disarm", slot, alarmId },
    } as Href;
  }

  /**
   * Legacy deep-link stub — redirects to Continue. Prefer
   * `alarmRingRouteBuilder.deepLinkPath` for new native intents.
   */
  deepLinkPath(alarmId: string): Href {
    return {
      pathname: "/alarm/object-hunt",
      params: { alarmId },
    } as unknown as Href;
  }
}

export const alarmObjectHuntRouteBuilder = new AlarmObjectHuntRouteBuilder();
