/**
 * Keyword maps linking scan targets to detector class identifiers.
 *
 * - Core ML / MediaPipe: COCO classes (cloud-annotations SSD, EfficientDet-Lite0)
 * - Vision: VNClassifyImageRequest taxonomy (Apple Vision framework)
 * - Custom: SalahObjects / Model.mlmodel trained via cloud-annotations/training
 */
export interface DetectorLabelRule {
  targetId: string;
  /** Class identifiers emitted by the detector (case-insensitive). */
  detectorIds: string[];
  minConfidence: number;
}

/**
 * COCO classes from bundled object detectors.
 * @see https://github.com/cloud-annotations/object-detection-ios
 * @see https://developers.google.com/edge/mediapipe/solutions/vision/object_detector
 */
export const COCO_KEYWORD_RULES: DetectorLabelRule[] = [
  {
    targetId: "sink",
    detectorIds: ["sink", "kitchen sink", "washbasin", "basin", "faucet", "tap"],
    minConfidence: 0.22,
  },
  {
    targetId: "toilet",
    detectorIds: ["toilet", "toilet seat", "lavatory", "commode"],
    minConfidence: 0.22,
  },
  {
    targetId: "bath",
    detectorIds: [
      "bathtub",
      "bath tub",
      "bath",
      "shower",
      "hair drier",
      "hair dryer",
      "toothbrush",
      "sink",
    ],
    minConfidence: 0.22,
  },
];

/**
 * Apple Vision image classification identifiers.
 * @see VNClassifyImageRequest / Vision taxonomy
 */
export const VISION_KEYWORD_RULES: DetectorLabelRule[] = [
  {
    targetId: "sink",
    detectorIds: [
      "kitchen_sink",
      "bathroom_faucet",
      "washbasin",
      "faucet",
      "tap",
      "sink",
      "basin",
    ],
    minConfidence: 0.35,
  },
  {
    targetId: "bath",
    detectorIds: ["bath", "shower", "bathtub", "jacuzzi", "bathroom"],
    minConfidence: 0.38,
  },
  {
    targetId: "toilet",
    detectorIds: ["toilet_seat", "toilet"],
    minConfidence: 0.38,
  },
  {
    targetId: "prayerMat",
    detectorIds: ["yoga", "rug", "carpet"],
    minConfidence: 0.48,
  },
  {
    targetId: "mosque",
    detectorIds: ["dome", "belltower", "clock_tower", "minaret", "mosque"],
    minConfidence: 0.45,
  },
];
