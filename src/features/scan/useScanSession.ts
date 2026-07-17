import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CameraView } from "expo-camera";
import { hasLiveScanCamera, type LiveScanDetectionsEvent } from "@/modules/vision-scan";
import { ScanManager } from "./ScanManager";
import { ScanDetectionEvaluator } from "./ScanDetectionEvaluator";
import { ScanMatchStreak } from "./ScanMatchStreak";
import { scanMissionCoordinator } from "./ScanMissionCoordinator";
import { bootstrapScanDetector, isAutomaticScanEnabled } from "./detection/ScanDetectorBootstrap";
import { getObjectDetector } from "./detection/detectorRegistry";
import { ScanPurpose, ScanTarget } from "./scanTargets";
import { scanNativeStatus, scanNativeStatusMessage } from "./DevBuildInstall";
import { ScanCaptureGate } from "./ScanCaptureGate";
import { parseLiveScanDetectionsEvent } from "./ScanLiveDetectionsParser";

const CAPTURE_INTERVAL_MS = 1_200;

interface UseScanSessionOptions {
  purpose: ScanPurpose;
  alarmId?: string;
  active: boolean;
  onSuccess: (target: ScanTarget | null) => void;
}

interface ScanSession {
  cameraRef: React.RefObject<CameraView | null>;
  active: boolean;
  usesLiveCamera: boolean;
  isAutomatic: boolean;
  scanning: boolean;
  message: string;
  succeeded: boolean;
  missionTarget: ScanTarget | null;
  streakProgress: { current: number; required: number };
  acceptedTargets: ScanTarget[];
  changeMissionTarget: (target: ScanTarget) => void;
  needsDevBuild: boolean;
  confirmManual: () => void;
  onLiveDetections: (event: { nativeEvent: LiveScanDetectionsEvent }) => void;
}

/**
 * Object hunt: live native camera when available, otherwise expo-camera still
 * frames → on-device detector (Core ML / Vision on iOS, MediaPipe on Android).
 */
export function useScanSession({
  purpose,
  alarmId,
  active,
  onSuccess,
}: UseScanSessionOptions): ScanSession {
  const [missionTarget, setMissionTarget] = useState<ScanTarget | null>(() =>
    scanMissionCoordinator.missionFor(alarmId, purpose)
  );
  const [isAutomatic, setIsAutomatic] = useState(isAutomaticScanEnabled());
  const [usesLiveCamera, setUsesLiveCamera] = useState(false);

  const cameraRef = useRef<CameraView | null>(null);
  const manager = useMemo(
    () => new ScanManager(purpose, missionTarget),
    [purpose, missionTarget]
  );
  const streak = useMemo(() => new ScanMatchStreak(1), []);
  const evaluator = useMemo(() => new ScanDetectionEvaluator(manager, streak), [manager, streak]);
  const captureGate = useMemo(() => new ScanCaptureGate(), []);

  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState(
    missionTarget?.instruction ?? "Point the camera at your target."
  );
  const [streakProgress, setStreakProgress] = useState(evaluator.initialStreakProgress);
  const [succeeded, setSucceeded] = useState(false);
  const succeededRef = useRef(false);

  useEffect(() => {
    bootstrapScanDetector();
    setIsAutomatic(isAutomaticScanEnabled());
    try {
      setUsesLiveCamera(hasLiveScanCamera());
    } catch {
      setUsesLiveCamera(false);
    }
  }, []);

  const detector = getObjectDetector();
  const needsDevBuild = !isAutomatic;

  const succeed = useCallback(
    (target: ScanTarget | null) => {
      if (succeededRef.current) return;
      succeededRef.current = true;
      setSucceeded(true);
      scanMissionCoordinator.clear(alarmId, purpose);
      void Promise.resolve(onSuccess(target)).catch((error) => {
        console.warn("[Scan] onSuccess failed", error);
      });
    },
    [alarmId, onSuccess, purpose]
  );

  const applyOutcome = useCallback(
    (outcome: ReturnType<ScanDetectionEvaluator["evaluate"]>) => {
      setStreakProgress(outcome.streakProgress);
      setMessage(outcome.message);
      if (outcome.succeeded) succeed(outcome.matchedTarget);
    },
    [succeed]
  );

  const onLiveDetections = useCallback(
    (event: { nativeEvent: LiveScanDetectionsEvent }) => {
      if (succeededRef.current || !isAutomatic) return;
      const parsed = parseLiveScanDetectionsEvent(event);
      if (!parsed?.detections.length) return;

      if (__DEV__) {
        const top = [...parsed.detections].sort((a, b) => b.confidence - a.confidence)[0];
        console.info(`[Scan] live → ${top.label} (${(top.confidence * 100).toFixed(0)}%)`);
      }

      applyOutcome(evaluator.evaluate(parsed.detections));
    },
    [applyOutcome, evaluator, isAutomatic]
  );

  const captureOnce = useCallback(async () => {
    if (usesLiveCamera || !cameraRef.current || succeededRef.current || !isAutomatic) return;

    await captureGate.run(async () => {
      try {
        const photo = await cameraRef.current!.takePictureAsync({
          quality: 0.25,
          skipProcessing: true,
          shutterSound: false,
        });
        if (!photo?.uri) return;

        const detections = await detector.detect({
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
        });
        if (detections.length === 0) return;

        if (__DEV__) {
          const top = [...detections].sort((a, b) => b.confidence - a.confidence)[0];
          console.info(
            `[Scan] still → ${top.label} (${(top.confidence * 100).toFixed(0)}%)`
          );
        }

        applyOutcome(evaluator.evaluate(detections));
      } catch {
        // Transient capture errors are ignored; the next tick retries.
      }
    });
  }, [applyOutcome, captureGate, detector, evaluator, isAutomatic, usesLiveCamera]);

  useEffect(() => {
    if (!active) return;

    if (!isAutomatic) {
      setMessage(scanNativeStatusMessage(scanNativeStatus()));
      return;
    }

    if (missionTarget) {
      setMessage(missionTarget.instruction);
    }

    evaluator.reset();
    setStreakProgress(evaluator.initialStreakProgress);
    setScanning(true);

    if (usesLiveCamera) {
      return () => {
        setScanning(false);
        evaluator.reset();
      };
    }

    void captureOnce();
    const timer = setInterval(captureOnce, CAPTURE_INTERVAL_MS);
    return () => {
      clearInterval(timer);
      setScanning(false);
      evaluator.reset();
    };
  }, [active, captureOnce, evaluator, isAutomatic, missionTarget, usesLiveCamera]);

  const changeMissionTarget = useCallback(
    (target: ScanTarget) => {
      if (succeededRef.current || !missionTarget || target.id === missionTarget.id) return;
      scanMissionCoordinator.setMission(alarmId, purpose, target);
      setMissionTarget(target);
      evaluator.reset();
      setStreakProgress(evaluator.initialStreakProgress);
      setMessage(target.instruction);
    },
    [alarmId, evaluator, missionTarget, purpose]
  );

  const confirmManual = useCallback(() => {
    if (succeededRef.current) return;
    succeed(null);
  }, [succeed]);

  return {
    cameraRef,
    active,
    usesLiveCamera,
    isAutomatic,
    scanning,
    message,
    succeeded,
    missionTarget,
    streakProgress,
    acceptedTargets: manager.acceptedTargets,
    changeMissionTarget,
    needsDevBuild,
    confirmManual,
    onLiveDetections,
  };
}
