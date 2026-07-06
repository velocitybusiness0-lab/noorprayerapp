import { GeoCoordinates } from "@/features/prayerTimes/prayerTimes.types";
import { MosqueProximity, SavedMosque } from "./masjid.types";

const EARTH_RADIUS_M = 6_371_000;

/**
 * Pure geospatial logic for masjid detection: distance maths and finding the
 * nearest saved mosque within its radius. No storage or side effects.
 */
export class MasjidModeManager {
  /** Great-circle distance in metres (haversine). */
  distanceMeters(a: GeoCoordinates, b: GeoCoordinates): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
  }

  /** Nearest saved mosque within its radius, or null if none are in range. */
  nearestInRange(
    coords: GeoCoordinates,
    mosques: SavedMosque[]
  ): MosqueProximity | null {
    let best: MosqueProximity | null = null;
    for (const mosque of mosques) {
      const distanceMeters = this.distanceMeters(coords, mosque);
      if (distanceMeters <= mosque.radius) {
        if (!best || distanceMeters < best.distanceMeters) {
          best = { mosque, distanceMeters };
        }
      }
    }
    return best;
  }
}

export const masjidModeManager = new MasjidModeManager();
