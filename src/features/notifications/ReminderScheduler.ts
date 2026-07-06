import { DayPrayerTimes, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { SalahMode } from "@/features/modes/mode.types";
import {
  NotificationCategories,
  NotificationManager,
} from "./NotificationManager";
import { followUpMessage, reminderMessage } from "./reminderMessages";

const FOLLOW_UP_MINUTES = 15;

export interface ReminderSyncOptions {
  isAlertEnabled: (prayer: ObligatoryPrayer) => boolean;
  resolveMode: (prayer: ObligatoryPrayer) => SalahMode;
  /** Slots already logged today are skipped for follow-ups. */
  isLogged?: (prayer: ObligatoryPrayer) => boolean;
}

/**
 * Turns a day's prayer times + user preferences into scheduled notifications:
 * a soft reminder at prayer time (reminder mode) and a "did you pray?"
 * follow-up ~15 minutes later so the user can log even without opening the app.
 */
export class ReminderScheduler {
  constructor(private readonly notifications: NotificationManager) {}

  async syncForDay(day: DayPrayerTimes, options: ReminderSyncOptions): Promise<void> {
    await this.notifications.cancelAll();

    for (const entry of day.entries) {
      if (!entry.isObligatory) continue;
      const prayer = entry.slot as ObligatoryPrayer;
      if (!options.isAlertEnabled(prayer)) continue;

      const mode = options.resolveMode(prayer);

      if (mode === "reminder") {
        await this.notifications.scheduleAt(entry.time, {
          title: entry.label,
          body: reminderMessage(prayer),
          categoryIdentifier: NotificationCategories.prayerReminder,
          data: { slot: prayer },
        });
      }

      if (!options.isLogged?.(prayer)) {
        const followUp = new Date(entry.time.getTime() + FOLLOW_UP_MINUTES * 60_000);
        await this.notifications.scheduleAt(followUp, {
          title: "Prayer check-in",
          body: followUpMessage(entry.label),
          categoryIdentifier: NotificationCategories.didYouPray,
          data: { slot: prayer, followUp: true },
        });
      }
    }
  }
}
