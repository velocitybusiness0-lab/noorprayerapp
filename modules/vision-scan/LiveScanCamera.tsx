import React from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";
import { VisionScan } from "./VisionScanModule";

export interface LiveScanDetection {
  label: string;
  confidence: number;
  source?: "coreml" | "vision" | "mediapipe";
}

export interface LiveScanDetectionsEvent {
  engine: string;
  detections: LiveScanDetection[];
}

interface NativeLiveScanCameraProps {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
  onDetections?: (event: { nativeEvent: LiveScanDetectionsEvent }) => void;
}

type LiveScanCameraComponent = React.ComponentType<NativeLiveScanCameraProps>;

let cachedView: LiveScanCameraComponent | null | undefined;

function resolveNativeView(): LiveScanCameraComponent | null {
  if (cachedView !== undefined) return cachedView;
  if (Platform.OS === "web") {
    cachedView = null;
    return null;
  }
  try {
    // Lazy resolve — eager requireNativeViewManager can crash app startup
    // when the view manager is missing from an older binary.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { requireNativeViewManager } = require("expo-modules-core");
    cachedView = requireNativeViewManager("VisionScan") as LiveScanCameraComponent;
  } catch {
    cachedView = null;
  }
  return cachedView;
}

/** True when the native view manager registered successfully. */
export function isLiveScanCameraMounted(): boolean {
  return resolveNativeView() != null;
}

/** True when the native flash-free live camera view is available. */
export function hasLiveScanCamera(): boolean {
  if (Platform.OS === "web") return false;
  if (VisionScan?.hasLiveCamera?.() !== true) return false;
  return resolveNativeView() != null;
}

export function LiveScanCamera(props: NativeLiveScanCameraProps) {
  const NativeView = resolveNativeView();
  if (!NativeView) return null;
  return <NativeView {...props} />;
}
