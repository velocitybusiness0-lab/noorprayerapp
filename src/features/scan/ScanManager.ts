import { Detection } from "./detection/ObjectDetector";
import { ScanLabelMatcher } from "./detection/ScanLabelMatcher";
import { ScanPurpose, ScanTarget, targetsForPurpose } from "./scanTargets";

export interface ScanEvaluation {
  matched: boolean;
  target: ScanTarget | null;
  topConfidence: number;
  /** User-facing feedback while scanning. */
  message: string;
}

/**
 * Strict scan gate for salah dismiss missions. Rejects wrong objects so the
 * alarm keeps ringing until the assigned (or any allowed) target is verified.
 */
export class ScanManager {
  private readonly targets: ScanTarget[];
  private readonly matcher: ScanLabelMatcher;
  private readonly missionTarget: ScanTarget | null;
  private readonly pendingHint: string;

  constructor(purpose: ScanPurpose, missionTarget: ScanTarget | null = null) {
    this.targets = targetsForPurpose(purpose);
    this.missionTarget = missionTarget;
    this.matcher = new ScanLabelMatcher(this.targets);
    this.pendingHint =
      purpose === "unblock" ? "Apps stay blocked until you scan." : "Alarm keeps ringing.";
  }

  get acceptedTargets(): ScanTarget[] {
    return this.targets;
  }

  get assignedMission(): ScanTarget | null {
    return this.missionTarget;
  }

  evaluate(detections: Detection[]): ScanEvaluation {
    const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);

    for (const detection of sorted.slice(0, 8)) {
      const target = this.matcher.matchDetection(detection);
      if (!target) continue;
      if (this.missionTarget && target.id !== this.missionTarget.id) {
        return {
          matched: false,
          target: null,
          topConfidence: detection.confidence,
          message: `Wrong item. Find your ${this.missionTarget.label}.`,
        };
      }
      return {
        matched: true,
        target,
        topConfidence: detection.confidence,
        message: `Recognised: ${target.label}`,
      };
    }

    const top = sorted[0];
    const huntHint = this.missionTarget
      ? `Scanning for ${this.missionTarget.label.toLowerCase()}… ${this.pendingHint}`
      : `${this.pendingHint} Point at a sink, bath, or toilet.`;

    if (!top) {
      return { matched: false, target: null, topConfidence: 0, message: huntHint };
    }

    return {
      matched: false,
      target: null,
      topConfidence: top.confidence,
      message: `Not accepted (${top.label}). ${this.missionTarget ? `Need ${this.missionTarget.label}.` : this.pendingHint}`,
    };
  }
}
