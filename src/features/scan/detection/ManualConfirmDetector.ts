import { Detection, DetectionInput, ObjectDetector } from "./ObjectDetector";

/**
 * Fallback detector used when no on-device model is available. It never
 * auto-classifies; the scan UI offers a manual "I can see it" confirmation so
 * the flow is never blocked by a missing model.
 */
export class ManualConfirmDetector implements ObjectDetector {
  readonly name = "Manual confirmation";
  readonly isAutomatic = false;

  async detect(_input: DetectionInput): Promise<Detection[]> {
    return [];
  }
}

export const manualConfirmDetector = new ManualConfirmDetector();
