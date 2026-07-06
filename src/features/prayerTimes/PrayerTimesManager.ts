import { Coordinates, PrayerTimes as AdhanPrayerTimes } from "adhan";
import { CalculationConfig } from "./CalculationConfig";
import {
  DayPrayerTimes,
  GeoCoordinates,
  PRAYER_LABELS,
  PrayerCalculationSettings,
  PrayerEntry,
  PrayerSlot,
} from "./prayerTimes.types";

const SLOT_ORDER: PrayerSlot[] = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

/**
 * Computes prayer times for a location/date using `adhan`.
 * Pure business logic: no React, no persistence, no side effects.
 */
export class PrayerTimesManager {
  constructor(private settings: PrayerCalculationSettings) {}

  updateSettings(settings: PrayerCalculationSettings): void {
    this.settings = settings;
  }

  /** Raw adhan instance for a given day (used by qibla/night calculators). */
  adhanTimes(coords: GeoCoordinates, date: Date): AdhanPrayerTimes {
    const coordinates = new Coordinates(coords.latitude, coords.longitude);
    const params = CalculationConfig.build(this.settings);
    return new AdhanPrayerTimes(coordinates, date, params);
  }

  computeForDate(coords: GeoCoordinates, date: Date): DayPrayerTimes {
    const times = this.adhanTimes(coords, date);
    const entries = this.buildEntries(times);
    const current = times.currentPrayer(new Date());
    const next = times.nextPrayer(new Date());

    return {
      date,
      location: coords,
      entries,
      currentSlot: current === "none" ? null : (current as PrayerSlot),
      nextSlot: next === "none" ? "fajr" : (next as PrayerSlot),
      nextSlotTime: this.resolveNextTime(coords, times, next),
    };
  }

  computeToday(coords: GeoCoordinates): DayPrayerTimes {
    return this.computeForDate(coords, new Date());
  }

  private buildEntries(times: AdhanPrayerTimes): PrayerEntry[] {
    const dates: Record<PrayerSlot, Date> = {
      fajr: times.fajr,
      sunrise: times.sunrise,
      dhuhr: times.dhuhr,
      asr: times.asr,
      maghrib: times.maghrib,
      isha: times.isha,
    };
    return SLOT_ORDER.map((slot) => ({
      slot,
      label: PRAYER_LABELS[slot],
      time: dates[slot],
      isObligatory: slot !== "sunrise",
    }));
  }

  /** After Isha, the next prayer is tomorrow's Fajr. */
  private resolveNextTime(
    coords: GeoCoordinates,
    times: AdhanPrayerTimes,
    next: ReturnType<AdhanPrayerTimes["nextPrayer"]>
  ): Date {
    if (next !== "none") {
      const dates: Record<PrayerSlot, Date> = {
        fajr: times.fajr,
        sunrise: times.sunrise,
        dhuhr: times.dhuhr,
        asr: times.asr,
        maghrib: times.maghrib,
        isha: times.isha,
      };
      return dates[next as PrayerSlot];
    }
    const tomorrow = new Date(times.date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.adhanTimes(coords, tomorrow).fajr;
  }
}
