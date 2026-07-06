/**
 * Central registry of persistence keys.
 * Keeping every key in one place prevents typos and collisions.
 */
export const StorageKeys = {
  themeMode: "theme.mode",
  onboardingComplete: "onboarding.complete",
  calculationMethod: "prayer.calculationMethod",
  calculationAutoByCountry: "prayer.calculationAutoByCountry",
  detectedCountryCode: "prayer.detectedCountry",
  madhab: "prayer.madhab",
  highLatitudeRule: "prayer.highLatitudeRule",
  lastKnownLocation: "location.last",
  globalMode: "modes.global",
  perPrayerModes: "modes.perPrayer",
  selectedAlarmSound: "alarm.selectedSound",
  alarmScheduledIds: "alarm.scheduledIds",
  blockedSelectionId: "blocking.selectionId",
  masjidModeEnabled: "masjid.enabled",
  savedMosques: "masjid.saved",
  preDisarmedSlots: "masjid.preDisarmed",
  notificationsEnabled: "notifications.enabled",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
