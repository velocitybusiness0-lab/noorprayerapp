import {
  DayPrayerTimes,
  PRAYER_LABELS,
  PrayerEntry,
} from "@/features/prayerTimes/prayerTimes.types";
import { formatClock } from "@/core/utils/time";
import { sfSymbolForSlot } from "./widgetSymbols";
import { WidgetPrayerItem, WidgetSnapshot } from "./widget.types";

/**
 * Converts a computed prayer day into the compact snapshot the widget and
 * Live Activity consume. Only the five obligatory prayers appear in the row.
 */
export class WidgetSnapshotBuilder {
  build(day: DayPrayerTimes): WidgetSnapshot {
    const obligatory = day.entries.filter((e) => e.isObligatory);
    const prayers: WidgetPrayerItem[] = obligatory.map((entry) =>
      this.toItem(entry, day)
    );

    const nextEpoch = day.nextSlotTime
      ? Math.floor(day.nextSlotTime.getTime() / 1000)
      : Math.floor(Date.now() / 1000);

    return {
      currentPrayer: day.currentSlot ? PRAYER_LABELS[day.currentSlot] : "—",
      nextPrayer: day.nextSlot ? PRAYER_LABELS[day.nextSlot] : "—",
      nextPrayerEpoch: nextEpoch,
      prayers,
    };
  }

  private toItem(entry: PrayerEntry, day: DayPrayerTimes): WidgetPrayerItem {
    return {
      name: PRAYER_LABELS[entry.slot],
      time: formatClock(entry.time),
      active: entry.slot === day.currentSlot,
      symbol: sfSymbolForSlot(entry.slot),
    };
  }
}

export const widgetSnapshotBuilder = new WidgetSnapshotBuilder();
