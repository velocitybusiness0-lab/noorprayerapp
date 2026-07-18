import { MotivationReminderCatalog } from "./MotivationReminderCatalog";
import { MotivationReminderPicker } from "./MotivationReminderPicker";
import {
  MotivationCategoryId,
  MotivationPrefs,
  MotivationReminder,
} from "./motivation.types";

/** Derives feed and notification copy from prefs + catalog. */
export class MotivationFeedPresenter {
  static feedItems(prefs: Pick<MotivationPrefs, "enabledCategories">): MotivationReminder[] {
    const filtered = MotivationReminderCatalog.forCategories(prefs.enabledCategories);
    return MotivationFeedPresenter.shuffle(filtered);
  }

  static pickForNotification(categories: MotivationCategoryId[]): MotivationReminder {
    return new MotivationReminderPicker(categories).next();
  }

  private static shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
