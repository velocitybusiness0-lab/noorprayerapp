/** Domain types for prayer time calculation. Framework-agnostic. */

export type ObligatoryPrayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

/** Slots shown in the UI, including the non-prayer sunrise marker. */
export type PrayerSlot = ObligatoryPrayer | "sunrise";

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface ResolvedLocation extends GeoCoordinates {
  /** Human-readable place name, when reverse geocoding succeeds. */
  name?: string;
  /** ISO 3166-1 alpha-2 country code (e.g. GB, US, JP). */
  countryCode?: string;
  /** Epoch ms when this fix was captured. */
  timestamp: number;
}

export interface PrayerEntry {
  slot: PrayerSlot;
  label: string;
  time: Date;
  isObligatory: boolean;
}

export interface DayPrayerTimes {
  date: Date;
  location: GeoCoordinates;
  entries: PrayerEntry[];
  currentSlot: PrayerSlot | null;
  nextSlot: PrayerSlot | null;
  nextSlotTime: Date | null;
}

export type CalculationMethodKey =
  | "MuslimWorldLeague"
  | "Egyptian"
  | "Karachi"
  | "UmmAlQura"
  | "Dubai"
  | "Qatar"
  | "Kuwait"
  | "MoonsightingCommittee"
  | "Singapore"
  | "Turkey"
  | "Tehran"
  | "NorthAmerica"
  | "Other";

export type MadhabKey = "Shafi" | "Hanafi";

export type HighLatitudeRuleKey =
  | "MiddleOfTheNight"
  | "SeventhOfTheNight"
  | "TwilightAngle";

export interface PrayerCalculationSettings {
  method: CalculationMethodKey;
  madhab: MadhabKey;
  highLatitudeRule: HighLatitudeRuleKey;
}

export const DEFAULT_CALCULATION_SETTINGS: PrayerCalculationSettings = {
  method: "MuslimWorldLeague",
  madhab: "Shafi",
  highLatitudeRule: "MiddleOfTheNight",
};

export const PRAYER_LABELS: Record<PrayerSlot, string> = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export const OBLIGATORY_PRAYERS: ObligatoryPrayer[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];
