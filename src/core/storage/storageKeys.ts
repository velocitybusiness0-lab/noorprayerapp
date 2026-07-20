/**
 * Central registry of persistence keys.
 * Keeping every key in one place prevents typos and collisions.
 */
export const StorageKeys = {
  themeMode: "theme.mode",
  onboardingComplete: "onboarding.complete",
  onboardingAnswers: "onboarding.answers",
  calculationMethod: "prayer.calculationMethod",
  calculationAutoByCountry: "prayer.calculationAutoByCountry",
  detectedCountryCode: "prayer.detectedCountry",
  madhab: "prayer.madhab",
  highLatitudeRule: "prayer.highLatitudeRule",
  lastKnownLocation: "location.last",
  globalMode: "modes.global",
  enabledModes: "modes.enabled",
  perPrayerModes: "modes.perPrayer",
  selectedAlarmSound: "alarm.selectedSound",
  alarmScheduledIds: "alarm.scheduledIds",
  alarmSlotById: "alarm.slotById",
  alarmFireTimes: "alarm.fireTimes",
  notificationsEnabled: "notifications.enabled",
  prayerFollowUpIds: "notifications.followUpIds",
  prayerReminderIds: "notifications.reminderIds",
  dailyGoals: "dailyGoals.snapshot",
  prayerRemindersEnabled: "notifications.remindersEnabled",
  duaLibrary: "duas.library",
  motivationPrefs: "motivation.prefs",
  motivationReminderIds: "notifications.motivationReminderIds",
  purposeEbookCompletion: "purposeEbook.completedChapterIds",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
