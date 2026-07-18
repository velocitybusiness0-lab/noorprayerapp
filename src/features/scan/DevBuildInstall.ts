import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { VisionScan } from "@/modules/vision-scan";
import { isExpoGo } from "@/core/runtime/isExpoGo";

/** Current iPhone dev build (finished 18 Jul 2026). */
export const MIRAJ_DEV_BUILD_URL =
  "https://expo.dev/accounts/spiralwoo/projects/noor-prayer-app/builds/1acd3767-039f-436b-8653-f39ffd23ebda";

export const MIRAJ_DEV_BUILD_ID = "1acd3767";

export type ScanNativeStatus =
  | "ready"
  | "expo_go"
  | "missing_module";

export function scanNativeStatus(): ScanNativeStatus {
  if (isExpoGo()) return "expo_go";
  if (VisionScan?.isSupported?.()) return "ready";
  return "missing_module";
}

export function scanNativeStatusMessage(status: ScanNativeStatus): string {
  switch (status) {
    case "ready":
      return "On-device scan verification is active.";
    case "expo_go":
      return "Expo Go cannot run object hunt. Open the Miraj app from your home screen.";
    case "missing_module":
      return (
        "This Miraj build was compiled without vision-scan. " +
        `Install build ${MIRAJ_DEV_BUILD_ID} (Metro reload cannot add native modules), ` +
        "or tap verify manually to continue."
      );
  }
}

export function scanBuildDiagnostics(): string {
  const status = scanNativeStatus();
  const build = Constants.nativeBuildVersion ?? "unknown";
  const moduleLoaded = VisionScan ? "yes" : "no";
  return `status=${status} build=${build} visionModule=${moduleLoaded}`;
}

export function openDevBuildInstallPage(): void {
  void Linking.openURL(MIRAJ_DEV_BUILD_URL);
}
