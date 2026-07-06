import { PrayerRegion } from "./countryCalculationDefaults";

/** Maps every ISO 3166-1 alpha-2 code to a prayer-calculation region. */
const ISO_TO_REGION: Record<string, PrayerRegion> = {
  // Europe
  AD: "europe", AL: "europe", AT: "europe", BA: "europe", BE: "europe", BG: "europe",
  BY: "europe", CH: "europe", CY: "europe", CZ: "europe", DE: "europe", DK: "europe",
  EE: "europe", ES: "europe", FI: "europe", FR: "europe", GB: "europe", GG: "europe",
  GI: "europe", GR: "europe", HR: "europe", HU: "europe", IE: "europe", IM: "europe",
  IS: "europe", IT: "europe", JE: "europe", LI: "europe", LT: "europe", LU: "europe",
  LV: "europe", MC: "europe", MD: "europe", ME: "europe", MK: "europe", MT: "europe",
  NL: "europe", NO: "europe", PL: "europe", PT: "europe", RO: "europe", RS: "europe",
  RU: "europe", SE: "europe", SI: "europe", SK: "europe", SM: "europe", TR: "europe",
  UA: "europe", VA: "europe", XK: "europe",

  // North America
  AG: "north_america", BB: "north_america", BS: "north_america", BZ: "north_america",
  CA: "north_america", CR: "north_america", CU: "north_america", DM: "north_america",
  DO: "north_america", GD: "north_america", GT: "north_america", HN: "north_america",
  HT: "north_america", JM: "north_america", KN: "north_america", LC: "north_america",
  MX: "north_america", NI: "north_america", PA: "north_america", PR: "north_america",
  SV: "north_america", TT: "north_america", US: "north_america", VC: "north_america",

  // South America
  AR: "south_america", BO: "south_america", BR: "south_america", CL: "south_america",
  CO: "south_america", EC: "south_america", GY: "south_america", PE: "south_america",
  PY: "south_america", SR: "south_america", UY: "south_america", VE: "south_america",

  // Gulf
  AE: "gulf", BH: "gulf", KW: "gulf", OM: "gulf", QA: "gulf", SA: "gulf", YE: "gulf",

  // Middle East (Levant, North Africa, etc.)
  DZ: "middle_east", EG: "middle_east", IL: "middle_east", IQ: "middle_east",
  IR: "middle_east", JO: "middle_east", LB: "middle_east", LY: "middle_east",
  MA: "middle_east", PS: "middle_east", SD: "middle_east", SY: "middle_east",
  TN: "middle_east",

  // South Asia
  AF: "south_asia", BD: "south_asia", BT: "south_asia", IN: "south_asia",
  LK: "south_asia", MV: "south_asia", NP: "south_asia", PK: "south_asia",

  // Southeast Asia
  BN: "southeast_asia", ID: "southeast_asia", KH: "southeast_asia", LA: "southeast_asia",
  MM: "southeast_asia", MY: "southeast_asia", PH: "southeast_asia", SG: "southeast_asia",
  TH: "southeast_asia", TL: "southeast_asia", VN: "southeast_asia",

  // East Asia
  CN: "east_asia", HK: "east_asia", JP: "east_asia", KP: "east_asia", KR: "east_asia",
  MO: "east_asia", MN: "east_asia", TW: "east_asia",

  // Central Asia
  AM: "central_asia", AZ: "central_asia", GE: "central_asia", KG: "central_asia",
  KZ: "central_asia", TJ: "central_asia", TM: "central_asia", UZ: "central_asia",

  // Africa
  AO: "africa", BF: "africa", BI: "africa", BJ: "africa", BW: "africa", CD: "africa",
  CF: "africa", CG: "africa", CI: "africa", CM: "africa", CV: "africa", DJ: "africa",
  ER: "africa", ET: "africa", GA: "africa", GH: "africa", GM: "africa", GN: "africa",
  GQ: "africa", GW: "africa", KE: "africa", KM: "africa", LR: "africa", LS: "africa",
  MG: "africa", ML: "africa", MR: "africa", MU: "africa", MW: "africa", MZ: "africa",
  NA: "africa", NE: "africa", NG: "africa", RW: "africa", SC: "africa", SL: "africa",
  SN: "africa", SO: "africa", SS: "africa", ST: "africa", SZ: "africa", TD: "africa",
  TG: "africa", TZ: "africa", UG: "africa", ZA: "africa", ZM: "africa", ZW: "africa",

  // Oceania
  AU: "oceania", FJ: "oceania", FM: "oceania", KI: "oceania", MH: "oceania",
  NR: "oceania", NC: "oceania", NZ: "oceania", PG: "oceania", PW: "oceania",
  SB: "oceania", TO: "oceania", TV: "oceania", VU: "oceania", WS: "oceania",
};

/** Returns the prayer region for any ISO country code, or the global default. */
export function regionForCountry(countryCode: string | undefined): PrayerRegion {
  if (!countryCode) return "default";
  return ISO_TO_REGION[countryCode.toUpperCase()] ?? "default";
}

/** English display name for an ISO country code (e.g. GB → United Kingdom). */
export function countryDisplayName(countryCode: string | undefined): string | null {
  if (!countryCode) return null;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode.toUpperCase()) ?? null;
  } catch {
    return countryCode.toUpperCase();
  }
}
