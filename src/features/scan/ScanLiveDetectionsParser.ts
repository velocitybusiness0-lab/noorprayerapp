import { LiveScanDetection, LiveScanDetectionsEvent } from "@/modules/vision-scan";

type RawLiveEvent =
  | { nativeEvent?: LiveScanDetectionsEvent }
  | LiveScanDetectionsEvent
  | null
  | undefined;

function isLivePayload(value: unknown): value is LiveScanDetectionsEvent {
  return (
    !!value &&
    typeof value === "object" &&
    "detections" in value &&
    Array.isArray((value as LiveScanDetectionsEvent).detections)
  );
}

/** Normalizes Expo view events (nativeEvent wrapper or flat payload). */
export function parseLiveScanDetectionsEvent(event: RawLiveEvent): LiveScanDetectionsEvent | null {
  if (!event || typeof event !== "object") return null;

  const payload = "nativeEvent" in event ? event.nativeEvent : event;
  if (!isLivePayload(payload)) return null;

  return {
    engine: typeof payload.engine === "string" ? payload.engine : "unknown",
    detections: payload.detections
      .filter((item): item is LiveScanDetection => !!item && typeof item.label === "string")
      .map((item) => ({
        label: item.label,
        confidence: typeof item.confidence === "number" ? item.confidence : 0,
        source: item.source,
      })),
  };
}
