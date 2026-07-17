import { VisionScan } from "@/modules/vision-scan";
import { Detection, DetectionInput, ObjectDetector } from "./ObjectDetector";

/**
 * On-device detector backed by the vision-scan Expo module.
 * Uses cloud-annotations Core ML object detection when a model is bundled,
 * otherwise Apple Vision image classification.
 */
export class NativeObjectDetector implements ObjectDetector {
  readonly isAutomatic = true;

  get name(): string {
    if (!this.isAvailable || !VisionScan) return "Unavailable";
    if (VisionScan.hasCoreMLModel?.()) return `Core ML (${VisionScan.detectionEngine()})`;
    if (VisionScan.detectionEngine() === "mediapipe") return "MediaPipe (EfficientDet-Lite0)";
    return "Apple Vision";
  }

  get isAvailable(): boolean {
    return !!VisionScan?.isSupported?.();
  }

  get usesCoreML(): boolean {
    return !!VisionScan?.hasCoreMLModel?.();
  }

  async detect(input: DetectionInput): Promise<Detection[]> {
    if (!this.isAvailable || !VisionScan) return [];
    try {
      const result = await VisionScan.detectImage(input.uri);
      return result.detections.map((item) => ({
        label: item.label,
        confidence: item.confidence,
        source: item.source,
      }));
    } catch {
      return [];
    }
  }
}

export const nativeObjectDetector = new NativeObjectDetector();
