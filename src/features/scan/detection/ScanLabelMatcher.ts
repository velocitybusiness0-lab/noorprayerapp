import { Detection } from "./ObjectDetector";
import { DetectorSource } from "./DetectorSource";
import {
  COCO_KEYWORD_RULES,
  DetectorLabelRule,
  VISION_KEYWORD_RULES,
} from "./DetectorKeywordMaps";
import { labelMatchesKeyword } from "./LabelNormalizer";
import { DETECTION_THRESHOLD, ScanTarget } from "../scanTargets";

const OBJECT_DETECTION_THRESHOLD = 0.22;

/** Resolves detector labels to an accepted scan target using engine-specific keywords. */
export class ScanLabelMatcher {
  private readonly acceptedIds: Set<string>;

  constructor(
    private readonly acceptedTargets: ScanTarget[],
    private readonly visionRules: DetectorLabelRule[] = VISION_KEYWORD_RULES,
    private readonly cocoRules: DetectorLabelRule[] = COCO_KEYWORD_RULES
  ) {
    this.acceptedIds = new Set(acceptedTargets.map((target) => target.id));
  }

  matchDetection(detection: Detection): ScanTarget | null {
    const source = detection.source ?? "vision";
    const label = detection.label;
    const { confidence } = detection;

    if (source === "vision") {
      return (
        this.matchKeywordRules(label, confidence, this.visionRules) ??
        this.matchCustomLabel(label, confidence, DETECTION_THRESHOLD)
      );
    }

    return (
      this.matchKeywordRules(label, confidence, this.cocoRules) ??
      this.matchCustomLabel(label, confidence, OBJECT_DETECTION_THRESHOLD)
    );
  }

  matchLabel(label: string, confidence: number, source: DetectorSource = "vision"): ScanTarget | null {
    return this.matchDetection({ label, confidence, source });
  }

  private matchKeywordRules(
    label: string,
    confidence: number,
    rules: DetectorLabelRule[]
  ): ScanTarget | null {
    for (const rule of rules) {
      if (!this.acceptedIds.has(rule.targetId)) continue;
      if (confidence < rule.minConfidence) continue;
      if (!rule.detectorIds.some((id) => labelMatchesKeyword(id, label))) continue;
      return this.targetById(rule.targetId);
    }
    return null;
  }

  private matchCustomLabel(
    label: string,
    confidence: number,
    minConfidence: number
  ): ScanTarget | null {
    if (confidence < minConfidence) return null;

    for (const target of this.acceptedTargets) {
      for (const customLabel of target.customLabels) {
        if (labelMatchesKeyword(customLabel, label)) return target;
      }
    }

    return null;
  }

  private targetById(id: string): ScanTarget | null {
    return this.acceptedTargets.find((target) => target.id === id) ?? null;
  }
}
