/** Categories the user can include in the swipe feed and notifications. */
export type MotivationCategoryId =
  | "quran"
  | "hadith"
  | "motivation"
  | "gratitude"
  | "discipline"
  | "patience"
  | "tawakkul"
  | "family"
  | "morning"
  | "evening"
  | "strength"
  | "mercy"
  | "focus"
  | "hope";

/** A single curated reminder, quote, or hadith. */
export type MotivationReminder = {
  id: string;
  text: string;
  category: MotivationCategoryId;
  /** Optional attribution (e.g. surah, narrator). */
  source?: string;
};

/**
 * Notification delivery window preset.
 * Hours are resolved by MotivationWindowPresetCatalog (Morning 6–12, Afternoon 12–17, Night 17–22).
 */
export type MotivationWindowPreset = "morning" | "afternoon" | "night";

/** Daily notification delivery window and volume. */
export type MotivationNotificationPrefs = {
  enabled: boolean;
  /**
   * Total motivation notifications per day (1–12), spread across selected
   * When windows — not sent together in one go.
   */
  quantityPerDay: number;
  /**
   * When reminders may fire (multi-select). Each preset maps to a fixed
   * hour range; the scheduler spreads quantity across the selected union.
   */
  windowPresets: MotivationWindowPreset[];
};

/** Persisted user preferences for the Reminders experience. */
export type MotivationPrefs = {
  enabledCategories: MotivationCategoryId[];
  notifications: MotivationNotificationPrefs;
};

export const ALL_MOTIVATION_CATEGORIES: MotivationCategoryId[] = [
  "quran",
  "hadith",
  "motivation",
  "gratitude",
  "discipline",
  "patience",
  "tawakkul",
  "family",
  "morning",
  "evening",
  "strength",
  "mercy",
  "focus",
  "hope",
];

export const DEFAULT_MOTIVATION_PREFS: MotivationPrefs = {
  enabledCategories: [...ALL_MOTIVATION_CATEGORIES],
  notifications: {
    enabled: false,
    quantityPerDay: 3,
    windowPresets: ["morning"],
  },
};
