import { SunnahTimes } from "adhan";
import { PrayerTimesManager } from "@/features/prayerTimes/PrayerTimesManager";
import { GeoCoordinates } from "@/features/prayerTimes/prayerTimes.types";

export interface NightTimes {
  /** Midpoint between Maghrib and the next Fajr (Qiyam / general night). */
  middleOfNight: Date;
  /** Start of the last third of the night (best time for Tahajjud). */
  lastThirdOfNight: Date;
}

/**
 * Computes voluntary night-prayer windows (Tahajjud / Qiyam) from adhan's
 * SunnahTimes, which spans this day's Maghrib to the following Fajr.
 */
export class NightCalculator {
  constructor(private readonly prayerTimes: PrayerTimesManager) {}

  compute(coords: GeoCoordinates, date: Date = new Date()): NightTimes {
    const times = this.prayerTimes.adhanTimes(coords, date);
    const sunnah = new SunnahTimes(times);
    return {
      middleOfNight: sunnah.middleOfTheNight,
      lastThirdOfNight: sunnah.lastThirdOfTheNight,
    };
  }
}
