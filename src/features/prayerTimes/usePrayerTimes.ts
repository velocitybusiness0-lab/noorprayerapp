import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { locationManager } from "@/features/location/LocationManager";
import { PrayerTimesManager } from "./PrayerTimesManager";
import { usePrayerSettings } from "./prayerSettingsStore";
import { DayPrayerTimes, ResolvedLocation } from "./prayerTimes.types";

interface PrayerTimesState {
  loading: boolean;
  error: string | null;
  location: ResolvedLocation | null;
  today: DayPrayerTimes | null;
  /** Live milliseconds until the next prayer (negative once it has begun). */
  countdownMs: number;
  refresh: () => Promise<void>;
  manager: PrayerTimesManager;
}

/**
 * View-model hook: resolves location, computes today's times from the current
 * settings, and drives a 1s live countdown to the next prayer.
 */
export function usePrayerTimes(): PrayerTimesState {
  const { settings, applyForLocation } = usePrayerSettings();
  const manager = useMemo(() => new PrayerTimesManager(settings), [settings]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<ResolvedLocation | null>(
    () => locationManager.getLastKnown() ?? null
  );
  const [today, setToday] = useState<DayPrayerTimes | null>(null);
  const [countdownMs, setCountdownMs] = useState(0);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const recompute = useCallback(
    (loc: ResolvedLocation) => {
      const day = manager.computeToday(loc);
      setToday(day);
    },
    [manager]
  );

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const loc = await locationManager.resolve();
      applyForLocation(loc);
      setLocation(loc);
      recompute(loc);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to determine location.");
    } finally {
      setLoading(false);
    }
  }, [recompute, applyForLocation]);

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location) recompute(location);
  }, [manager, location, recompute]);

  useEffect(() => {
    if (!today?.nextSlotTime) return;
    const update = () => {
      const remaining = today.nextSlotTime!.getTime() - Date.now();
      setCountdownMs(remaining);
      // When the next prayer arrives, recompute the day roll-over.
      if (remaining <= -1000 && location) recompute(location);
    };
    update();
    tick.current = setInterval(update, 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [today, location, recompute]);

  return { loading, error, location, today, countdownMs, refresh, manager };
}
