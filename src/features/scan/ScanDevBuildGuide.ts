import { MIRAJ_DEV_BUILD_URL } from "./DevBuildInstall";

export interface ScanDevBuildFeatureRow {
  feature: string;
  needsDevBuild: boolean;
  note?: string;
}

/** Install and troubleshooting copy for the vision-scan native dev build. */
export class ScanDevBuildGuide {
  static readonly buildId = "40150343";
  static readonly buildFingerprint = "08704d85…";
  static readonly buildFinishedAt = "22:05";
  static readonly installUrl = MIRAJ_DEV_BUILD_URL;

  static readonly summary =
    "Automatic camera detection needs a native dev build with vision-scan compiled in. " +
    "iOS uses Core ML + Apple Vision; Android uses MediaPipe EfficientDet-Lite0 (COCO). " +
    "Metro reload only updates JavaScript — it cannot add native modules.";

  static readonly missingModuleExplanation =
    "If logs show status=missing_module visionModule=no, the app on your phone is still " +
    "an older build without vision-scan.";

  static readonly featureMatrix: ScanDevBuildFeatureRow[] = [
    { feature: "Keyword maps / matcher logic", needsDevBuild: false, note: "Metro reload is enough" },
    { feature: "iOS Core ML object detection", needsDevBuild: true },
    { feature: "iOS Apple Vision classification", needsDevBuild: true },
    { feature: "Android MediaPipe object detection", needsDevBuild: true },
  ];

  static readonly installSteps = [
    "Delete the Miraj app (long-press → Remove App / Uninstall).",
    "Open the build link on your phone → Install.",
    "Open Miraj from the home screen (not Expo Go).",
    "Connect to Metro (run npx expo start on your PC, same Wi‑Fi).",
  ];

  static readonly successLogLines = [
    "[Scan] Core ML (MobileNetV2_SSDLite+vision) — COCO + Vision keywords linked",
    "[Scan] MediaPipe (EfficientDet-Lite0) — COCO keywords linked",
    "status=ready visionModule=yes",
  ];

  static buildTitle(): string {
    return `Install build ${this.buildId}`;
  }

  static buildSubtitle(): string {
    return `Latest build (${this.buildFingerprint}, finished ${this.buildFinishedAt})`;
  }
}
