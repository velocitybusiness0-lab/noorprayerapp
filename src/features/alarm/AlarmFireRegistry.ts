import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { shouldRetainForActiveAlarm } from "./AlarmRetentionChecks";

type FireTimeMap = Record<string, number>;

/**
 * Tracks when each alarm may open the ring UI. Persisted so dev resync does
 * not wipe fire windows mid-alarm.
 */
class AlarmFireRegistry {
  private fireTimes = new Map<string, number>(Object.entries(this.read()));

  register(alarmId: string, fireTime: Date): void {
    this.fireTimes.set(alarmId, fireTime.getTime());
    this.persist();
  }

  clear(alarmId: string): void {
    this.fireTimes.delete(alarmId);
    this.persist();
  }

  isDue(alarmId: string, now = Date.now()): boolean {
    const fire = this.fireTimes.get(alarmId);
    if (fire === undefined) return false;

    const earlyMs = 30_000;
    const lateMs = alarmSessionCoordinator.blocksScheduling() ? 60 * 60_000 : 20 * 60_000;
    return now >= fire - earlyMs && now <= fire + lateMs;
  }

  forEachDue(callback: (alarmId: string) => void, now = Date.now()): void {
    for (const alarmId of this.fireTimes.keys()) {
      if (this.isDue(alarmId, now)) callback(alarmId);
    }
  }

  prune(validIds: string[]): void {
    const valid = new Set(validIds);
    let changed = false;
    const now = Date.now();
    const retainPastMs = 20 * 60_000;

    for (const [id, fire] of [...this.fireTimes.entries()]) {
      if (shouldRetainForActiveAlarm(id) || this.isDue(id, now)) continue;
      // Keep upcoming (and recently due) fires — e.g. 1-minute test alarms
      // that prayer sync must not wipe before they ring.
      if (now <= fire + retainPastMs) continue;
      if (!valid.has(id)) {
        this.fireTimes.delete(id);
        changed = true;
      }
    }
    if (changed) this.persist();
  }

  private read(): FireTimeMap {
    return storage.getObject<FireTimeMap>(StorageKeys.alarmFireTimes) ?? {};
  }

  private persist(): void {
    const map: FireTimeMap = {};
    for (const [id, time] of this.fireTimes.entries()) {
      map[id] = time;
    }
    storage.setObject(StorageKeys.alarmFireTimes, map);
  }
}

export const alarmFireRegistry = new AlarmFireRegistry();
