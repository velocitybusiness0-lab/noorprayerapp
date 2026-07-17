import { DetectorSource } from "./DetectorSource";

/** A single detected object with a normalized confidence [0,1]. */
export interface Detection {
  label: string;
  confidence: number;
  /** coreml = SSD/Core ML model; vision = VNClassifyImageRequest. */
  source?: DetectorSource;
}

/** A captured still to run detection on (file URI from the camera). */
export interface DetectionInput {
  uri: string;
  width?: number;
  height?: number;
}

/**
 * Pluggable object-detection boundary. Implementations may run a CoreML model
 * on-device, call a remote service, or defer to manual confirmation. The scan
 * flow depends only on this interface, so the model can be swapped freely.
 */
export interface ObjectDetector {
  /** Human-facing name of the detector (shown in diagnostics). */
  readonly name: string;
  /** Whether this detector can actually classify frames (vs. manual only). */
  readonly isAutomatic: boolean;
  detect(input: DetectionInput): Promise<Detection[]>;
}
