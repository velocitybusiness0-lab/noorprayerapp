import { MotivationCategoryId, MotivationReminder } from "./motivation.types";
import { MOTIVATION_ENTRIES_DISCIPLINE } from "./catalog/MotivationEntriesDiscipline";
import { MOTIVATION_ENTRIES_EVENING } from "./catalog/MotivationEntriesEvening";
import { MOTIVATION_ENTRIES_FAMILY } from "./catalog/MotivationEntriesFamily";
import { MOTIVATION_ENTRIES_FOCUS } from "./catalog/MotivationEntriesFocus";
import { MOTIVATION_ENTRIES_GRATITUDE } from "./catalog/MotivationEntriesGratitude";
import { MOTIVATION_ENTRIES_HADITH } from "./catalog/MotivationEntriesHadith";
import { MOTIVATION_ENTRIES_HOPE } from "./catalog/MotivationEntriesHope";
import { MOTIVATION_ENTRIES_MERCY } from "./catalog/MotivationEntriesMercy";
import { MOTIVATION_ENTRIES_MORNING } from "./catalog/MotivationEntriesMorning";
import { MOTIVATION_ENTRIES_MOTIVATION } from "./catalog/MotivationEntriesMotivation";
import { MOTIVATION_ENTRIES_PATIENCE } from "./catalog/MotivationEntriesPatience";
import { MOTIVATION_ENTRIES_QURAN } from "./catalog/MotivationEntriesQuran";
import { MOTIVATION_ENTRIES_STRENGTH } from "./catalog/MotivationEntriesStrength";
import { MOTIVATION_ENTRIES_TAWAKKUL } from "./catalog/MotivationEntriesTawakkul";

/** Curated reminders for the swipe feed and motivation notifications. */
export class MotivationReminderCatalog {
  private static readonly REMINDERS: MotivationReminder[] = [
    ...MOTIVATION_ENTRIES_QURAN,
    ...MOTIVATION_ENTRIES_HADITH,
    ...MOTIVATION_ENTRIES_MOTIVATION,
    ...MOTIVATION_ENTRIES_GRATITUDE,
    ...MOTIVATION_ENTRIES_DISCIPLINE,
    ...MOTIVATION_ENTRIES_PATIENCE,
    ...MOTIVATION_ENTRIES_TAWAKKUL,
    ...MOTIVATION_ENTRIES_FAMILY,
    ...MOTIVATION_ENTRIES_MORNING,
    ...MOTIVATION_ENTRIES_EVENING,
    ...MOTIVATION_ENTRIES_STRENGTH,
    ...MOTIVATION_ENTRIES_MERCY,
    ...MOTIVATION_ENTRIES_FOCUS,
    ...MOTIVATION_ENTRIES_HOPE,
  ];

  static all(): MotivationReminder[] {
    return MotivationReminderCatalog.REMINDERS;
  }

  static forCategories(categories: MotivationCategoryId[]): MotivationReminder[] {
    if (categories.length === 0) return [];
    const allowed = new Set(categories);
    return MotivationReminderCatalog.REMINDERS.filter((item) =>
      allowed.has(item.category)
    );
  }

  static count(): number {
    return MotivationReminderCatalog.REMINDERS.length;
  }
}
