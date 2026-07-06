import { DayPrayerTimes, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { ReminderScheduler } from "@/features/notifications/ReminderScheduler";
import { AlarmScheduler } from "@/features/alarm/AlarmScheduler";
import { BlockingManager } from "@/features/blocking/BlockingManager";
import { SalahMode } from "./mode.types";

export interface CoordinatorSyncOptions {
  isAlertEnabled: (prayer: ObligatoryPrayer) => boolean;
  resolveMode: (prayer: ObligatoryPrayer) => SalahMode;
  isLogged: (prayer: ObligatoryPrayer) => boolean;
  soundName?: string;
}

/**
 * Single place that maps the user's chosen mode per prayer to the right
 * side effect at salah time: alarm, app-block, or reminder. Delegates to the
 * specialised schedulers so each keeps a single responsibility.
 */
export class ModeCoordinator {
  constructor(
    private readonly reminders: ReminderScheduler,
    private readonly alarms: AlarmScheduler,
    private readonly blocking: BlockingManager
  ) {}

  async sync(days: DayPrayerTimes[], options: CoordinatorSyncOptions): Promise<void> {
    const [today] = days;
    if (today) {
      await this.reminders.syncForDay(today, {
        isAlertEnabled: options.isAlertEnabled,
        resolveMode: options.resolveMode,
        isLogged: options.isLogged,
      });
    }

    await this.alarms.sync(days, {
      isAlertEnabled: options.isAlertEnabled,
      resolveMode: options.resolveMode,
      soundName: options.soundName,
    });

    await this.blocking.scheduleForDays(days, {
      isAlertEnabled: options.isAlertEnabled,
      resolveMode: options.resolveMode,
    });
  }
}
