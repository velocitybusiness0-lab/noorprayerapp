import { Detection, DetectionInput, ObjectDetector } from "./ObjectDetector";

/** Signature a native CoreML bridge must satisfy to classify a still image. */
export type NativeClassify = (input: DetectionInput) => Promise<Detection[]>;

/**
 * On-device CoreML detector. The actual model inference is injected as a
 * `NativeClassify` function so the model (trained via cloud-annotations for
 * `prayer mat / sink / bath`) can be wired in a native-enabled build without
 * changing the scan flow. See `assets/models/README.md`.
 */
export class CoreMLObjectDetector implements ObjectDetector {
  readonly name = "CoreML";
  readonly isAutomatic = true;

  constructor(private readonly classify: NativeClassify) {}

  detect(input: DetectionInput): Promise<Detection[]> {
    return this.classify(input);
  }
}
