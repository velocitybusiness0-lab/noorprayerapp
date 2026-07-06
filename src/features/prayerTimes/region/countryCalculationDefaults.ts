import {
  CalculationMethodKey,
  HighLatitudeRuleKey,
  MadhabKey,
  PrayerCalculationSettings,
} from "../prayerTimes.types";

/** Geographic region used when a country has no explicit override. */
export type PrayerRegion =
  | "europe"
  | "north_america"
  | "south_america"
  | "middle_east"
  | "gulf"
  | "south_asia"
  | "southeast_asia"
  | "east_asia"
  | "central_asia"
  | "africa"
  | "oceania"
  | "default";

/** Per-country overrides (ISO 3166-1 alpha-2). All other countries use their region. */
export const COUNTRY_CALCULATION_OVERRIDES: Partial<
  Record<string, Partial<PrayerCalculationSettings>>
> = {
  // United Kingdom & Ireland — widely used in British mosques
  GB: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  IE: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  IM: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  JE: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  GG: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },

  // North America
  US: { method: "NorthAmerica" },
  CA: { method: "NorthAmerica", highLatitudeRule: "SeventhOfTheNight" },

  // Gulf & Middle East
  SA: { method: "UmmAlQura" },
  AE: { method: "Dubai" },
  QA: { method: "Qatar" },
  KW: { method: "Kuwait" },
  BH: { method: "UmmAlQura" },
  OM: { method: "MuslimWorldLeague" },
  YE: { method: "UmmAlQura" },
  IQ: { method: "MuslimWorldLeague" },
  SY: { method: "MuslimWorldLeague" },
  JO: { method: "MuslimWorldLeague" },
  LB: { method: "MuslimWorldLeague" },
  PS: { method: "MuslimWorldLeague" },
  IL: { method: "MuslimWorldLeague" },
  IR: { method: "Tehran" },
  EG: { method: "Egyptian" },
  LY: { method: "Egyptian" },
  SD: { method: "MuslimWorldLeague" },
  MA: { method: "MuslimWorldLeague" },
  DZ: { method: "MuslimWorldLeague" },
  TN: { method: "MuslimWorldLeague" },

  // South Asia (Hanafi majority)
  PK: { method: "Karachi", madhab: "Hanafi" },
  AF: { method: "Karachi", madhab: "Hanafi" },
  IN: { method: "Karachi", madhab: "Hanafi" },
  BD: { method: "Karachi", madhab: "Hanafi" },
  NP: { method: "Karachi", madhab: "Hanafi" },
  LK: { method: "MuslimWorldLeague" },

  // Southeast Asia
  MY: { method: "Singapore" },
  SG: { method: "Singapore" },
  BN: { method: "Singapore" },
  ID: { method: "Singapore" },
  TH: { method: "MuslimWorldLeague" },
  PH: { method: "MuslimWorldLeague" },

  // East & Central Asia
  CN: { method: "MuslimWorldLeague" },
  JP: { method: "MuslimWorldLeague" },
  KR: { method: "MuslimWorldLeague" },
  TW: { method: "MuslimWorldLeague" },
  HK: { method: "MuslimWorldLeague" },
  MO: { method: "MuslimWorldLeague" },
  KZ: { method: "MuslimWorldLeague" },
  UZ: { method: "MuslimWorldLeague" },
  TM: { method: "MuslimWorldLeague" },
  KG: { method: "MuslimWorldLeague" },
  TJ: { method: "MuslimWorldLeague" },
  AZ: { method: "MuslimWorldLeague" },
  GE: { method: "MuslimWorldLeague" },
  AM: { method: "MuslimWorldLeague" },
  MN: { method: "MuslimWorldLeague" },

  // Europe (non-UK)
  TR: { method: "Turkey" },
  FR: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  DE: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  NL: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  BE: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  SE: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  NO: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  FI: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  DK: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  IS: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  PL: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  CH: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  AT: { method: "MoonsightingCommittee", highLatitudeRule: "SeventhOfTheNight" },
  IT: { method: "MoonsightingCommittee" },
  ES: { method: "MoonsightingCommittee" },
  PT: { method: "MoonsightingCommittee" },
  GR: { method: "MuslimWorldLeague" },
  RU: { method: "MuslimWorldLeague", highLatitudeRule: "SeventhOfTheNight" },
  UA: { method: "MuslimWorldLeague", highLatitudeRule: "SeventhOfTheNight" },

  // Oceania
  AU: { method: "MuslimWorldLeague" },
  NZ: { method: "MuslimWorldLeague" },

  // Africa (general)
  NG: { method: "MuslimWorldLeague" },
  ZA: { method: "MuslimWorldLeague" },
  KE: { method: "MuslimWorldLeague" },
  ET: { method: "MuslimWorldLeague" },
  SO: { method: "MuslimWorldLeague" },

  // Americas
  MX: { method: "NorthAmerica" },
  BR: { method: "MuslimWorldLeague" },
  AR: { method: "MuslimWorldLeague" },
};

/** Default calculation settings per region for countries without an explicit override. */
export const REGION_CALCULATION_DEFAULTS: Record<PrayerRegion, PrayerCalculationSettings> = {
  europe: {
    method: "MoonsightingCommittee",
    madhab: "Shafi",
    highLatitudeRule: "SeventhOfTheNight",
  },
  north_america: {
    method: "NorthAmerica",
    madhab: "Shafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
  south_america: {
    method: "MuslimWorldLeague",
    madhab: "Shafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
  middle_east: {
    method: "MuslimWorldLeague",
    madhab: "Shafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
  gulf: {
    method: "UmmAlQura",
    madhab: "Shafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
  south_asia: {
    method: "Karachi",
    madhab: "Hanafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
  southeast_asia: {
    method: "Singapore",
    madhab: "Shafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
  east_asia: {
    method: "MuslimWorldLeague",
    madhab: "Shafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
  central_asia: {
    method: "MuslimWorldLeague",
    madhab: "Shafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
  africa: {
    method: "MuslimWorldLeague",
    madhab: "Shafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
  oceania: {
    method: "MuslimWorldLeague",
    madhab: "Shafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
  default: {
    method: "MuslimWorldLeague",
    madhab: "Shafi",
    highLatitudeRule: "MiddleOfTheNight",
  },
};

/** Latitude above which Fajr/Isha need a high-latitude adjustment (e.g. UK ~51°N). */
export const HIGH_LATITUDE_THRESHOLD = 48;

export function highLatitudeRuleFor(
  latitude: number,
  preferred?: HighLatitudeRuleKey
): HighLatitudeRuleKey {
  if (Math.abs(latitude) < HIGH_LATITUDE_THRESHOLD) {
    return preferred ?? "MiddleOfTheNight";
  }
  return preferred ?? "SeventhOfTheNight";
}

export function madhabForRegion(region: PrayerRegion): MadhabKey {
  return REGION_CALCULATION_DEFAULTS[region].madhab;
}
