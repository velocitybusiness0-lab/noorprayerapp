import { AppBlockingSetupPhase } from "@/components/blocking/AppBlockingSetupPhaseResolver";

/** User-facing copy for focus shield / app blocking. */
export class AppBlockingCopy {
  static activeStatus(appCount: number): string {
    const apps = `${appCount} app${appCount === 1 ? "" : "s"} blocked`;
    return `${apps} · scan to unblock`;
  }

  static setupStatus(phase: AppBlockingSetupPhase): string {
    switch (phase) {
      case "allow":
        return "Block distracting apps at prayer time — scan an object to get back in.";
      case "choose":
        return "Choose apps to block when prayer starts. Scan to unblock.";
      case "activate":
        return "Turn on — selected apps stay blocked until you scan.";
      default:
        return "Blocks apps at prayer time. Scan to unblock.";
    }
  }

  static pickerHint(): string {
    return "Blocked at prayer time until you scan to unblock.";
  }
}
