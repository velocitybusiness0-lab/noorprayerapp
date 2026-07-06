export interface WidgetPrayerItem {
  name: string;
  time: string;
  active: boolean;
  symbol: string;
}

/** Mirrors the Swift `PrayerSnapshot` decoded inside the widget extension. */
export interface WidgetSnapshot {
  currentPrayer: string;
  nextPrayer: string;
  /** Epoch seconds when the next prayer begins. */
  nextPrayerEpoch: number;
  prayers: WidgetPrayerItem[];
}
