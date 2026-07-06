import { useEffect, useMemo, useState } from "react";
import * as Location from "expo-location";
import { locationManager } from "@/features/location/LocationManager";
import { GeoCoordinates } from "@/features/prayerTimes/prayerTimes.types";
import { qiblaManager } from "./QiblaManager";

interface QiblaState {
  loading: boolean;
  error: string | null;
  /** Compass heading of the device (degrees from true north). */
  heading: number;
  /** Absolute qibla bearing from the user's location. */
  qiblaBearing: number;
  /** Angle to render the qibla marker relative to the device top. */
  relativeAngle: number;
  /** True when the marker points (roughly) straight up = facing qibla. */
  aligned: boolean;
  accuracy: number | null;
}

/**
 * View-model hook: resolves location, computes qibla bearing, and streams the
 * live compass heading via the OS heading API (uses the magnetometer + GPS).
 */
export function useQibla(): QiblaState {
  const [coords, setCoords] = useState<GeoCoordinates | null>(
    () => locationManager.getLastKnown() ?? null
  );
  const [heading, setHeading] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let cancelled = false;

    (async () => {
      try {
        const resolved = await locationManager.resolve();
        if (cancelled) return;
        setCoords(resolved);
        subscription = await Location.watchHeadingAsync((data) => {
          setHeading(data.trueHeading >= 0 ? data.trueHeading : data.magHeading);
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

  return {
    loading,
    error,
    heading,
    qiblaBearing,
    relativeAngle,
    aligned,
    accuracy,
  };
}
