/**
 * Prayer UI shows HH:MM only. Alarm fire times snap to that minute's first
 * second so AlarmKit / in-app timers ring at HH:MM:00.000 local time.
 */
export class AlarmFireInstant {
  static forPrayerTime(time: Date): Date {
    const fireAt = new Date(time);
    fireAt.setSeconds(0, 0);
    return fireAt;
  }

  static msUntil(time: Date, now = Date.now()): number {
    return this.forPrayerTime(time).getTime() - now;
  }
}
