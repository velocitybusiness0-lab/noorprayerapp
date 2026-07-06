import { Detection } from "./detection/ObjectDetector";
import {
  DETECTION_THRESHOLD,
  ScanPurpose,
  ScanTarget,
  targetsForPurpose,
} from "./scanTargets";

export interface ScanEvaluation {
  matched: boolean;
  target: ScanTarget | null;
  topConfidence: number;
}

/**
 * Decides whether a set of detections satisfies the scan for a given purpose.
 * Pure logic; the camera/session lives in `useScanSession`.
 */
export class ScanManager {
  private readonly targets: ScanTarget[];

  constructor(purpose: ScanPurpose, private readonly threshold = DETECTION_THRESHOLD) {
    this.targets = targetsForPurpose(purpose);
  }

  get acceptedTargets(): ScanTarget[] {
    return this.targets;
  }

  evaluate(detections: Detection[]): ScanEvaluation {
    const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);
    for (const detection of sorted) {
      if (detection.confidence < this.threshold) continue;
      const target = this.matchTarget(detection.label);
      if (target) {
        return { matched: true, target, topConfidence: detection.confidence };
      }
    }
    return {
      matched: false,
      target: null,
      topConfidence: sorted[0]?.confidence ?? 0,
    };
  }

  private matchTarget(label: string): ScanTarget | null {
    const normalized = label.trim().toLowerCase();
    return (
      this.targets.find((target) =>
        target.modelLabels.some((l) => normalized.includes(l.toLowerCase()))
      ) ?? null
    );
  }
}
