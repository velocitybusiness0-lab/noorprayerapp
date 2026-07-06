import {
  CalculationMethod,
  CalculationParameters,
  HighLatitudeRule,
  Madhab,
} from "adhan";
import {
  CalculationMethodKey,
  HighLatitudeRuleKey,
  MadhabKey,
  PrayerCalculationSettings,
} from "./prayerTimes.types";

/**
 * Translates the app's plain-string calculation settings into an
 * `adhan` `CalculationParameters` object. Keeps all adhan specifics
 * isolated here so the rest of the app never imports adhan enums.
 */
export class CalculationConfig {
  static build(settings: PrayerCalculationSettings): CalculationParameters {
    const params = CalculationConfig.methodFor(settings.method);
    params.madhab = CalculationConfig.madhabFor(settings.madhab);
    params.highLatitudeRule = CalculationConfig.highLatitudeFor(
      settings.highLatitudeRule
    );
    return params;
  }

  private static methodFor(key: CalculationMethodKey): CalculationParameters {
    const map: Record<CalculationMethodKey, () => CalculationParameters> = {
      MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
      Egyptian: CalculationMethod.Egyptian,
      Karachi: CalculationMethod.Karachi,
      UmmAlQura: CalculationMethod.UmmAlQura,
      Dubai: CalculationMethod.Dubai,
      Qatar: CalculationMethod.Qatar,
      Kuwait: CalculationMethod.Kuwait,
      MoonsightingCommittee: CalculationMethod.MoonsightingCommittee,
      Singapore: CalculationMethod.Singapore,
      Turkey: CalculationMethod.Turkey,
      Tehran: CalculationMethod.Tehran,
      NorthAmerica: CalculationMethod.NorthAmerica,
      Other: CalculationMethod.Other,
    };
    return map[key]();
  }

  private static madhabFor(key: MadhabKey) {
    return key === "Hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  }

  private static highLatitudeFor(key: HighLatitudeRuleKey) {
    switch (key) {
      case "SeventhOfTheNight":
        return HighLatitudeRule.SeventhOfTheNight;
      case "TwilightAngle":
        return HighLatitudeRule.TwilightAngle;
      default:
        return HighLatitudeRule.MiddleOfTheNight;
    }
  }
}

export const CALCULATION_METHOD_LABELS: Record<CalculationMethodKey, string> = {
  MuslimWorldLeague: "Muslim World League (worldwide)",
  Egyptian: "Egyptian General Authority",
  Karachi: "University of Karachi (South Asia)",
  UmmAlQura: "Umm al-Qura (Saudi Arabia)",
  Dubai: "Dubai (UAE)",
  Qatar: "Qatar",
  Kuwait: "Kuwait",
  MoonsightingCommittee: "Moonsighting Committee (UK / Europe)",
  Singapore: "Singapore / MUIS",
  Turkey: "Diyanet (Turkey)",
  Tehran: "Tehran (Iran)",
  NorthAmerica: "ISNA (North America)",
  Other: "Custom angles",
};
