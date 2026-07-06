import {
  GeoCoordinates,
  PrayerCalculationSettings,
  ResolvedLocation,
} from "./prayerTimes.types";
import {
  COUNTRY_CALCULATION_OVERRIDES,
  REGION_CALCULATION_DEFAULTS,
  highLatitudeRuleFor,
} from "./region/countryCalculationDefaults";
import {
  countryDisplayName,
  regionForCountry,
} from "./region/countryRegions";

export interface RegionalCalculationResult {
  settings: PrayerCalculationSettings;
  countryCode: string | null;
  countryName: string | null;
  region: string;
}

/**
 * Picks the best prayer calculation method for any country on Earth.
 * Uses explicit country overrides where communities have a standard (e.g. UK),
 * falls back to regional defaults, and applies high-latitude rules from GPS.
 */
export class RegionCalculationResolver {
  resolve(location: GeoCoordinates & { countryCode?: string }): RegionalCalculationResult {
    const countryCode = location.countryCode?.toUpperCase() ?? null;
    const region = regionForCountry(countryCode ?? undefined);
    const override = countryCode ? COUNTRY_CALCULATION_OVERRIDES[countryCode] : undefined;
    const regional = REGION_CALCULATION_DEFAULTS[region];

    const settings: PrayerCalculationSettings = {
      method: override?.method ?? regional.method,
      madhab: override?.madhab ?? regional.madhab,
      highLatitudeRule: highLatitudeRuleFor(
        location.latitude,
        override?.highLatitudeRule ?? regional.highLatitudeRule
      ),
    };

    return {
      settings,
      countryCode,
      countryName: countryDisplayName(countryCode ?? undefined),
      region,
    };
  }

  resolveFromLocation(location: ResolvedLocation): RegionalCalculationResult {
    return this.resolve(location);
  }
}

export const regionCalculationResolver = new RegionCalculationResolver();
