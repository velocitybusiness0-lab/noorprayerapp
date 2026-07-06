import { ObjectDetector } from "./ObjectDetector";
import { manualConfirmDetector } from "./ManualConfirmDetector";

let active: ObjectDetector = manualConfirmDetector;

/**
 * Registers the active object detector. A native-enabled build can call this
 * at startup with a `CoreMLObjectDetector` wrapping the bundled model; until
 * then the app safely falls back to manual confirmation.
 */
export function setObjectDetector(detector: ObjectDetector): void {
  active = detector;
}

export function getObjectDetector(): ObjectDetector {
  return active;
}
