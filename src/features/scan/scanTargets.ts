/** What a scan is trying to accomplish. */
export type ScanPurpose = "disarm";

export interface ScanTarget {
  id: string;
  label: string;
  instruction: string;
  /**
   * Class names from a custom SalahObjects Core ML model
   * (cloud-annotations/training). Matched when engine is coreml and
   * labels are not standard COCO classes.
   */
  customLabels: string[];
  icon: string;
}

/**
 * Scan targets for object hunt (sink / bath / toilet) and optional prayer mat.
 * COCO + Vision keyword maps live in DetectorKeywordMaps.ts.
 */
export const SCAN_TARGETS: Record<string, ScanTarget> = {
  sink: {
    id: "sink",
    label: "Sink / tap",
    instruction: "Point the camera at the sink or tap for wudhu",
    customLabels: ["sink", "tap", "faucet", "wudhu", "kitchen_sink", "washbasin", "basin"],
    icon: "water-outline",
  },
  bath: {
    id: "bath",
    label: "Bath / shower",
    instruction: "Point the camera at the bath or shower",
    customLabels: ["bath", "shower", "bathtub", "bathroom"],
    icon: "rainy-outline",
  },
  toilet: {
    id: "toilet",
    label: "Toilet",
    instruction: "Point the camera at the toilet",
    customLabels: ["toilet", "lavatory", "toilet_seat"],
    icon: "medical-outline",
  },
  prayerMat: {
    id: "prayerMat",
    label: "Prayer mat",
    instruction: "Point the camera at your prayer mat",
    customLabels: ["prayer mat", "prayer_mat", "prayer rug", "musalla", "sajjadah"],
    icon: "grid-outline",
  },
};

const HOME_OBJECT_HUNT_IDS = ["sink", "bath", "toilet"] as const;

/** Home objects for object hunt — sink, bath, toilet only. */
export function objectHuntTargets(): ScanTarget[] {
  return HOME_OBJECT_HUNT_IDS.map((id) => SCAN_TARGETS[id]);
}

export function isObjectHuntTarget(target: ScanTarget): boolean {
  return (HOME_OBJECT_HUNT_IDS as readonly string[]).includes(target.id);
}

export function usesObjectHunt(purpose: string): boolean {
  return purpose === "disarm";
}

/** Targets accepted for each purpose (any one satisfies the scan). */
export function targetsForPurpose(_purpose: ScanPurpose): ScanTarget[] {
  return objectHuntTargets();
}

export const DETECTION_THRESHOLD = 0.45;
