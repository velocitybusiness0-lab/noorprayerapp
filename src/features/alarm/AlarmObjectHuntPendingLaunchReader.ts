import { LiveActivity } from "../../../modules/live-activity";

/**
 * Reads a one-shot AlarmKit → Continue-gate handoff written by
 * MirajOpenAlarmIntent into the shared app group.
 */
export class AlarmObjectHuntPendingLaunchReader {
  consumeAlarmId(): string | null {
    const consume = LiveActivity?.consumePendingObjectHuntAlarmId;
    if (!consume) return null;
    try {
      const alarmId = consume();
      return alarmId && alarmId.length > 0 ? alarmId : null;
    } catch {
      return null;
    }
  }
}

export const alarmObjectHuntPendingLaunchReader =
  new AlarmObjectHuntPendingLaunchReader();
