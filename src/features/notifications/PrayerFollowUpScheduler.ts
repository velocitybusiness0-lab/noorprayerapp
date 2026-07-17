import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { DayPrayerTimes, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { ModeCheckFn } from "@/features/modes/mode.types";
import {
  NotificationCategories,
  NotificationManager,
} from "./NotificationManager";
import { followUpMessage } from "./reminderMessages";

const FOLLOW_UP_MINUTES = 15;

export interface FollowUpSyncOptions {
  isAlertEnabled: (prayer: ObligatoryPrayer) => boolean;
  isModeEnabled: ModeCheckFn;
  isLogged?: (prayer: ObligatoryPrayer) => boolean;
}

/**
 * Smart-alarm check-in: ~15 minutes after each prayer time, asks whether the
 * user prayed so they can log from the notification. Runs for alarm mode only.
 */
export class PrayerFollowUpScheduler {
  constructor(private readonly notifications: NotificationManager) {}

  async sync(days: DayPrayerTimes[], options: FollowUpSyncOptions): Promise<void> {
    await this.cancelTracked();

    for (const day of days) {
      for (const entry of day.entries) {
        if (!entry.isObligatory) continue;
        const prayer = entry.slot as ObligatoryPrayer;
        if (!options.isAlertEnabled(prayer)) continue;
        if (!options.isModeEnabled(prayer, "alarm")) continue;
        if (options.isLogged?.(prayer)) continue;

        const followUp = new Date(entry.time.getTime() + FOLLOW_UP_MINUTES * 60_000);
        const id = await this.notifications.scheduleAt(followUp, {
          title: "Prayer check-in",
          body: followUpMessage(entry.label),
          categoryIdentifier: NotificationCategories.didYouPray,
          data: { slot: prayer, followUp: true },
        });
        if (id) this.trackId(id);
      }
    }
  }

  async cancelScheduled(): Promise<void> {
    await this.cancelTracked();
  }

  private trackId(id: string): void {
    const ids = storage.getObject<string[]>(StorageKeys.prayerFollowUpIds) ?? [];
    storage.setObject(StorageKeys.prayerFollowUpIds, [...ids, id]);
  }

  private async cancelTracked(): Promise<void> {
    const ids = storage.getObject<string[]>(StorageKeys.prayerFollowUpIds) ?? [];
    await this.notifications.cancelScheduled(ids);
    storage.setObject(StorageKeys.prayerFollowUpIds, []);
  }
}
