export type AppBlockingSetupPhase = "allow" | "choose" | "activate" | "active";

/** Maps blocking authorization state to a setup phase for the UI. */
export class AppBlockingSetupPhaseResolver {
  resolve(
    authorized: boolean,
    selectionTotal: number,
    shieldActive: boolean
  ): AppBlockingSetupPhase {
    if (shieldActive) return "active";
    if (!authorized) return "allow";
    if (selectionTotal === 0) return "choose";
    return "activate";
  }

  stepIndex(phase: AppBlockingSetupPhase): number {
    switch (phase) {
      case "allow":
        return 0;
      case "choose":
        return 1;
      case "activate":
        return 2;
      default:
        return 2;
    }
  }
}

export const appBlockingSetupPhaseResolver = new AppBlockingSetupPhaseResolver();
