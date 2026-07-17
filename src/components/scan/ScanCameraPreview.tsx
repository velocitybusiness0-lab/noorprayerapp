import React from "react";
import { StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import { useScanSession } from "@/features/scan/useScanSession";

type ScanSession = ReturnType<typeof useScanSession>;

interface ScanCameraPreviewProps {
  session: ScanSession;
}

/**
 * Prefers flash-free native live scan when available; falls back to expo-camera.
 * LiveScanCamera is required lazily so a missing view manager never crashes boot.
 */
export function ScanCameraPreview({ session }: ScanCameraPreviewProps) {
  if (session.usesLiveCamera) {
    return <LiveScanPreview session={session} />;
  }

  return <StillCameraPreview session={session} />;
}

function LiveScanPreview({ session }: { session: ScanSession }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@/modules/vision-scan") as typeof import("@/modules/vision-scan");
    if (!mod.hasLiveScanCamera()) {
      return <StillCameraPreview session={session} />;
    }
    return (
      <mod.LiveScanCamera
        active={session.active && session.isAutomatic && !session.succeeded}
        style={StyleSheet.absoluteFill}
        onDetections={session.onLiveDetections}
      />
    );
  } catch {
    return <StillCameraPreview session={session} />;
  }
}

function StillCameraPreview({ session }: { session: ScanSession }) {
  return (
    <CameraView
      ref={session.cameraRef}
      style={StyleSheet.absoluteFill}
      facing="back"
      flash="off"
      enableTorch={false}
      animateShutter={false}
    />
  );
}
