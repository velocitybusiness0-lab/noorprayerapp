import { setObjectDetector } from "./detectorRegistry";
import { manualConfirmDetector } from "./ManualConfirmDetector";
import { nativeObjectDetector } from "./NativeObjectDetector";
import { scanBuildDiagnostics, scanNativeStatus, scanNativeStatusMessage } from "../DevBuildInstall";

/** Registers the best available on-device detector for scan screens. */
export function bootstrapScanDetector(): void {
  const status = scanNativeStatus();

  if (status === "ready") {
    setObjectDetector(nativeObjectDetector);
    if (__DEV__) {
      console.info(`[Scan] ${nativeObjectDetector.name} — object hunt active`);
      console.info(`[Scan] ${scanBuildDiagnostics()}`);
    }
    return;
  }

  setObjectDetector(manualConfirmDetector);
  if (__DEV__) {
    console.info(`[Scan] ${scanNativeStatusMessage(status)} (${scanBuildDiagnostics()})`);
  }
}

export function isAutomaticScanEnabled(): boolean {
  return scanNativeStatus() === "ready";
}

export function scanDetectionEngine(): string | null {
  return scanNativeStatus() === "ready" ? nativeObjectDetector.name : null;
}
