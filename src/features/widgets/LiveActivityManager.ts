import { LiveActivity } from "../../../modules/live-activity";
import { WidgetSnapshot } from "./widget.types";

/**
 * Owns the single prayer-countdown Live Activity: starts it for the upcoming
 * prayer, updates it when the target prayer changes, and ends it on demand.
 * Delegates to the optional native ActivityKit module and no-ops without it.
 */
export class LiveActivityManager {
  private activityId: string | null = null;
  private currentKey: string | null = null;

  get isSupported(): boolean {
    return !!LiveActivity && LiveActivity.isSupported();
  }

  async sync(snapshot: WidgetSnapshot): Promise<void> {
    if (!this.isSupported || !LiveActivity) return;

    const key = `${snapshot.nextPrayer}:${snapshot.nextPrayerEpoch}`;
    if (key === this.currentKey && this.activityId) return;

    const symbol =
      snapshot.prayers.find((p) => p.name === snapshot.nextPrayer)?.symbol ??
      "moon.stars";

    if (!this.activityId) {
      this.activityId = await LiveActivity.start(
        "Next prayer",
        snapshot.nextPrayer,
        symbol,
        snapshot.nextPrayerEpoch
      );
    } else {
      await LiveActivity.update(
        this.activityId,
        snapshot.nextPrayer,
        symbol,
        snapshot.nextPrayerEpoch
      );
    }
    this.currentKey = key;
  }

  async stop(): Promise<void> {
    if (!LiveActivity) return;
    await LiveActivity.endAll();
    this.activityId = null;
    this.currentKey = null;
  }
}

export const liveActivityManager = new LiveActivityManager();
