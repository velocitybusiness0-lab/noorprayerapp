import { GeoCoordinates } from "@/features/prayerTimes/prayerTimes.types";

export interface SavedMosque {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  /** Detection radius in metres. */
  radius: number;
}

export interface MosqueProximity {
  mosque: SavedMosque;
  distanceMeters: number;
}

export const DEFAULT_MOSQUE_RADIUS_M = 120;

export type { GeoCoordinates };
