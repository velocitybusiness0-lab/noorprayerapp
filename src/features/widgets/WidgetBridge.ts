import { LiveActivity } from "../../../modules/live-activity";
import { WidgetSnapshot } from "./widget.types";

/**
 * Publishes the prayer snapshot into the shared app group (via the local
 * native module) so the WidgetKit extension can render it, then reloads the
 * widget timelines. Safe no-op on Android or before the dev build exists.
 */
export class WidgetBridge {
  publish(snapshot: WidgetSnapshot): void {
    if (!LiveActivity) return;
    try {
      LiveActivity.setSnapshot(JSON.stringify(snapshot));
      LiveActivity.reloadWidgets();
    } catch {
      // Native module unavailable (e.g. Expo Go) - ignore.
    }
  }
}

export const widgetBridge = new WidgetBridge();
