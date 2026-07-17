import { ObjectDetector } from "./ObjectDetector";
import { manualConfirmDetector } from "./ManualConfirmDetector";

let active: ObjectDetector = manualConfirmDetector;

/**
 * Registers the active object detector. `bootstrapScanDetector` wires the
 * native Core ML / Vision module at startup; until then manual confirm is used.
 */
export function setObjectDetector(detector: ObjectDetector): void {
  active = detector;
}

export function getObjectDetector(): ObjectDetector {
  return active;
}
