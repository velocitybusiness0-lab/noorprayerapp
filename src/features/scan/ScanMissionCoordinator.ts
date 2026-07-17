import { objectHuntTargets, isObjectHuntTarget } from "./ObjectHuntTargetPool";
import { ScanPurpose, ScanTarget } from "./scanTargets";

/**
 * Picks a single random scan target per hunt session, like Waken "Object Hunt".
 * Used for alarm disarm and app-unblock flows.
 */
export class ScanMissionCoordinator {
  private readonly missions = new Map<string, ScanTarget>();

  missionFor(alarmId: string | undefined, purpose: ScanPurpose): ScanTarget | null {
    if (purpose !== "disarm" && purpose !== "unblock") return null;

    const key = missionKey(alarmId, purpose);
    const cached = this.missions.get(key);
    if (cached && isObjectHuntTarget(cached)) return cached;
    if (cached) this.missions.delete(key);

    const pool = objectHuntTargets();
    if (!pool.length) return null;

    const picked = pool[Math.floor(Math.random() * pool.length)];
    this.missions.set(key, picked);
    return picked;
  }

  setMission(alarmId: string | undefined, purpose: ScanPurpose, target: ScanTarget): void {
    if (!isObjectHuntTarget(target)) return;
    this.missions.set(missionKey(alarmId, purpose), target);
  }

  clear(alarmId: string | undefined, purpose: ScanPurpose): void {
    this.missions.delete(missionKey(alarmId, purpose));
  }
}

function missionKey(alarmId: string | undefined, purpose: ScanPurpose): string {
  if (purpose === "unblock") return alarmId ? `unblock:${alarmId}` : "unblock-scan";
  return alarmId ?? "active-alarm";
}

export const scanMissionCoordinator = new ScanMissionCoordinator();
