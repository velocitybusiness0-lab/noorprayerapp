/**
 * Tracks alarms owned by AlarmKit so in-app audio never steals the
 * native ringtone mid-dismiss / object hunt.
 */
class AlarmKitOwnershipRegistry {
  private ownedIds = new Set<string>();

  mark(alarmKitId: string): void {
    this.ownedIds.add(alarmKitId);
  }

  release(alarmKitId: string): void {
    this.ownedIds.delete(alarmKitId);
  }

  owns(alarmKitId: string): boolean {
    return this.ownedIds.has(alarmKitId);
  }

  clear(): void {
    this.ownedIds.clear();
  }
}

export const alarmKitOwnershipRegistry = new AlarmKitOwnershipRegistry();
