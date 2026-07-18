import { DayPrayerTimes, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { PrayerFollowUpScheduler } from "@/features/notifications/PrayerFollowUpScheduler";
import { ReminderScheduler } from "@/features/notifications/ReminderScheduler";
import { AlarmScheduler } from "@/features/alarm/AlarmScheduler";
import { ModeCheckFn } from "./mode.types";
import { arePrayerRemindersEnabled } from "@/features/notifications/reminderPrefsStore";

export interface CoordinatorSyncOptions {
  isAlertEnabled: (prayer: ObligatoryPrayer) => boolean;
  isModeEnabled: ModeCheckFn;
  isLogged: (prayer: ObligatoryPrayer) => boolean;
  soundName?: string;
}

/**
 * Single place that maps the user's chosen mode per prayer to the right
 * side effect at salah time: alarm or reminder. Delegates to the
 * specialised schedulers so each keeps a single responsibility.
 */
export class ModeCoordinator {
  constructor(
    private readonly reminders: ReminderScheduler,
    private readonly followUps: PrayerFollowUpScheduler,
    private readonly alarms: AlarmScheduler
  ) {}

  async sync(days: DayPrayerTimes[], options: CoordinatorSyncOptions): Promise<void> {
    if (arePrayerRemindersEnabled() && days.length) {
      await this.reminders.sync(days, {
        isAlertEnabled: options.isAlertEnabled,
        isModeEnabled: options.isModeEnabled,
      });
    } else {
      await this.reminders.cancelScheduled();
    }

    await this.followUps.sync(days, {
      isAlertEnabled: options.isAlertEnabled,
      isModeEnabled: options.isModeEnabled,
      isLogged: options.isLogged,
    });

    await this.alarms.sync(days, {
      isAlertEnabled: options.isAlertEnabled,
      isModeEnabled: options.isModeEnabled,
      soundName: options.soundName,
    });
  }
}
