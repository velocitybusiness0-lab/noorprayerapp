import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CameraView } from "expo-camera";
import { ScanManager } from "./ScanManager";
import { getObjectDetector } from "./detection/detectorRegistry";
import { ScanPurpose, ScanTarget } from "./scanTargets";

const CAPTURE_INTERVAL_MS = 1500;

interface UseScanSessionOptions {
  purpose: ScanPurpose;
  active: boolean;
  onSuccess: (target: ScanTarget | null) => void;
}

interface ScanSession {
  cameraRef: React.RefObject<CameraView | null>;
  isAutomatic: boolean;
  scanning: boolean;
  confidence: number;
  succeeded: boolean;
  acceptedTargets: ScanTarget[];
  confirmManually: () => void;
}

/**
 * Drives a scan: periodically captures stills from the camera, runs the active
 * ObjectDetector, and reports success when an accepted target is recognised.
 * Falls back to manual confirmation when no automatic detector is registered.
 */
export function useScanSession({
  purpose,
  active,
  onSuccess,
}: UseScanSessionOptions): ScanSession {
  const cameraRef = useRef<CameraView | null>(null);
  const manager = useMemo(() => new ScanManager(purpose), [purpose]);
  const detector = useMemo(() => getObjectDetector(), []);

  const [scanning, setScanning] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [succeeded, setSucceeded] = useState(false);
  const succeededRef = useRef(false);

  const succeed = useCallback(
    (target: ScanTarget | null) => {
      if (succeededRef.current) return;
      succeededRef.current = true;
      setSucceeded(true);
      onSuccess(target);
    },
    [onSuccess]
  );

  const confirmManually = useCallback(() => {
    succeed(manager.acceptedTargets[0] ?? null);
  }, [manager, succeed]);

  const captureOnce = useCallback(async () => {
    if (!cameraRef.current || succeededRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0,
        skipProcessing: true,
        shutterSound: false,
      });
      if (!photo?.uri) return;
      const detections = await detector.detect({
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
      });
      const result = manager.evaluate(detections);
      setConfidence(result.topConfidence);
      if (result.matched) succeed(result.target);
    } catch {
      // Transient capture errors are ignored; the next tick retries.
    }
  }, [detector, manager, succeed]);

  useEffect(() => {
    if (!active || !detector.isAutomatic) return;
    setScanning(true);
    const timer = setInterval(captureOnce, CAPTURE_INTERVAL_MS);
    return () => {
      clearInterval(timer);
      setScanning(false);
    };
  }, [active, detector.isAutomatic, captureOnce]);

  return {
    cameraRef,
    isAutomatic: detector.isAutomatic,
    scanning,
    confidence,
    succeeded,
    acceptedTargets: manager.acceptedTargets,
    confirmManually,
  };
}
