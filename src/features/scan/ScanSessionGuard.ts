import { ScanPurpose } from "./scanTargets";

export interface ActiveScanSession {
  purpose: ScanPurpose;
  slot: string;
  alarmId?: string;
}

/** Prevents alarm navigation from replacing an in-progress object hunt. */
export class ScanSessionGuard {
  private session: ActiveScanSession | null = null;

  open(session: ActiveScanSession): void {
    this.session = session;
  }

  close(): void {
    this.session = null;
  }

  isOpen(alarmId?: string): boolean {
    if (!this.session) return false;
    if (!alarmId || !this.session.alarmId) return true;
    return this.session.alarmId === alarmId;
  }

  routePath(): string | null {
    if (!this.session) return null;
    const { purpose, slot, alarmId } = this.session;
    const alarmQuery = alarmId ? `&alarmId=${encodeURIComponent(alarmId)}` : "";
    return `/scan/${purpose}?slot=${slot}${alarmQuery}`;
  }
}

export const scanSessionGuard = new ScanSessionGuard();
