import { requireOptionalNativeModule } from "expo-modules-core";

interface LiveActivityNativeModule {
  isSupported: () => boolean;
  setSnapshot: (json: string) => void;
  reloadWidgets: () => void;
  /** Consumes AlarmKit lock-screen → Continue-gate handoff from the app group. */
  consumePendingObjectHuntAlarmId?: () => string | null;
  start: (
    title: string,
    prayerName: string,
    symbol: string,
    endEpoch: number
  ) => Promise<string | null>;
  update: (
    id: string,
    prayerName: string,
    symbol: string,
    endEpoch: number
  ) => Promise<void>;
  endAll: () => Promise<void>;
}

/**
 * Optional so JS keeps working in Expo Go / Android / before the dev build is
 * installed. Callers must handle the module being null.
 */
export const LiveActivity =
  requireOptionalNativeModule<LiveActivityNativeModule>("LiveActivity");
