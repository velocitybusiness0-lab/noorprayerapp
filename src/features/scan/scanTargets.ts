/** What a scan is trying to accomplish. */
export type ScanPurpose = "disarm" | "unblock" | "predisarm";

export interface ScanTarget {
  id: string;
  label: string;
  instruction: string;
  /** Model class labels that satisfy this target. */
  modelLabels: string[];
  icon: string;
}

/**
 * Scan targets are all tied to getting up for salah: the prayer mat, the
 * sink/tap (wudhu), or the masjid itself.
 */
export const SCAN_TARGETS: Record<string, ScanTarget> = {
  prayerMat: {
    id: "prayerMat",
    label: "Prayer mat",
    instruction: "Point the camera at your prayer mat",
    modelLabels: ["prayer mat", "prayer_mat", "musalla", "rug"],
    icon: "grid-outline",
  },
  wudhu: {
    id: "wudhu",
    label: "Sink / wudhu area",
    instruction: "Point the camera at the sink or tap for wudhu",
    modelLabels: ["sink", "tap", "faucet", "wudhu"],
    icon: "water-outline",
  },
  masjid: {
    id: "masjid",
    label: "Masjid",
    instruction: "Point the camera at the masjid",
    modelLabels: ["masjid", "mosque", "minaret", "mihrab"],
    icon: "business-outline",
  },
};

/** Targets accepted for each purpose (any one satisfies the scan). */
export function targetsForPurpose(purpose: ScanPurpose): ScanTarget[] {
  switch (purpose) {
    case "predisarm":
      return [SCAN_TARGETS.masjid, SCAN_TARGETS.wudhu];
    default:
      return [SCAN_TARGETS.prayerMat, SCAN_TARGETS.wudhu, SCAN_TARGETS.masjid];
  }
}

export const DETECTION_THRESHOLD = 0.6;
