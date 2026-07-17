import { dayKey } from "@/core/utils/time";
import { DayPrayerTimes, ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";
import { ModeCheckFn } from "@/features/modes/mode.types";
import { androidAccessibilityBlocker } from "./AndroidAccessibilityBlocker";

const BLOCK_WINDOW_MS = 30 * 60_000;

export interface AndroidBlockSyncOptions {
  isAlertEnabled: (prayer: ObligatoryPrayer) => boolean;
  isModeEnabled: ModeCheckFn;
}

/**
 * Enables Android accessibility monitoring at each scheduled block prayer time.
 */
export class AndroidBlockScheduleCoordinator {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  sync(days: DayPrayerTimes[], options: AndroidBlockSyncOptions): void {
    this.clearAll();
    if (!androidAccessibilityBlocker.isAuthorized()) return;
    if (!androidAccessibilityBlocker.hasSelection()) return;

    androidAccessibilityBlocker.syncBlockedPackagesToNative();

    for (const day of days) {
      for (const entry of day.entries) {
        if (!entry.isObligatory) continue;
        const prayer = entry.slot as ObligatoryPrayer;
        if (!options.isAlertEnabled(prayer)) continue;
        if (!options.isModeEnabled(prayer, "block")) continue;

        const startMs = entry.time.getTime() - Date.now();
        if (startMs <= 0) continue;

        const endMs = startMs + BLOCK_WINDOW_MS;
        const key = `${prayer}-${dayKey(entry.time)}`;

        this.scheduleTimer(`${key}-start`, startMs, () => {
          androidAccessibilityBlocker.blockNow();
        });
        this.scheduleTimer(`${key}-end`, endMs, () => {
          androidAccessibilityBlocker.unblockNow();
        });
      }
    }
  }

  clearAll(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
  }

  private scheduleTimer(id: string, delayMs: number, action: () => void): void {
    const timer = setTimeout(() => {
      this.timers.delete(id);
      action();
    }, delayMs);
    this.timers.set(id, timer);
  }
}

export const androidBlockScheduleCoordinator = new AndroidBlockScheduleCoordinator();
