import { requireOptionalNativeModule } from "expo-modules-core";

export interface VisionClassification {
  label: string;
  confidence: number;
  source?: "coreml" | "vision" | "mediapipe";
}

export interface VisionDetectionResult {
  engine: string;
  detections: VisionClassification[];
}

interface VisionScanNativeModule {
  isSupported: () => boolean;
  hasCoreMLModel: () => boolean;
  hasLiveCamera: () => boolean;
  detectionEngine: () => string;
  classifyImage: (uri: string) => Promise<VisionClassification[]>;
  detectImage: (uri: string) => Promise<VisionDetectionResult>;
}

/** Native scan bridge — Core ML SSD with Vision / MediaPipe fallback. */
export const VisionScan =
  requireOptionalNativeModule<VisionScanNativeModule>("VisionScan");
