import { useEffect, useMemo, useRef, useState } from "react";
import * as Location from "expo-location";
import { locationManager } from "@/features/location/LocationManager";
import { GeoCoordinates } from "@/features/prayerTimes/prayerTimes.types";
import { qiblaDeviceHeadingResolver } from "./QiblaDeviceHeadingResolver";
import { qiblaManager } from "./QiblaManager";
import { QiblaHeadingSmoother } from "./QiblaHeadingSmoother";

interface QiblaState {
  loading: boolean;
  error: string | null;
  /** Smoothed compass heading of the device (degrees from north). */
  heading: number;
  /** Absolute qibla bearing from the user's location (true north). */
  qiblaBearing: number;
  /** Angle to render the qibla marker relative to the device top. */
  relativeAngle: number;
  /** True when the marker points (roughly) straight up = facing qibla. */
  aligned: boolean;
  accuracy: number | null;
  /** True when the OS reports poor / invalid heading accuracy. */
  needsCalibration: boolean;
}

/**
 * View-model hook: resolves location, computes qibla bearing, and streams the
 * live compass heading via `Location.watchHeadingAsync` (true north when
 * available, else magnetic). Display heading is lightly smoothed; bearing math
 * stays exact.
 *
 * Display model (one source of truth):
 * - dial rotation = -heading (cardinals stay world-aligned)
 * - needle rotation = qiblaBearing - heading (up when facing Kaaba)
 */
export function useQibla(): QiblaState {
  const [coords, setCoords] = useState<GeoCoordinates | null>(
    () => locationManager.getLastKnown() ?? null
  );
  const [heading, setHeading] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const headingSmootherRef = useRef(new QiblaHeadingSmoother());

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let cancelled = false;
    const headingSmoother = headingSmootherRef.current;
    headingSmoother.reset();

    (async () => {
      try {
        const resolved = await locationManager.resolve();
        if (cancelled) return;
        setCoords(resolved);
        subscription = await Location.watchHeadingAsync((data) => {
          const raw = qiblaDeviceHeadingResolver.resolve(data);
          setHeading(headingSmoother.push(raw));
          setAccuracy(data.accuracy ?? null);
        });
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Compass unavailable.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
      headingSmoother.reset();
    };
  }, []);

  const qiblaBearing = useMemo(
    () => (coords ? qiblaManager.bearing(coords) : 0),
    [coords]
  );
  const relativeAngle = useMemo(
    () => (coords ? qiblaManager.relativeAngle(coords, heading) : 0),
    [coords, heading]
  );

  const aligned = relativeAngle < 5 || relativeAngle > 355;
  const needsCalibration =
    qiblaDeviceHeadingResolver.needsCalibration(accuracy);

  return {
    loading,
    error,
    heading,
    qiblaBearing,
    relativeAngle,
    aligned,
    accuracy,
    needsCalibration,
  };
}
