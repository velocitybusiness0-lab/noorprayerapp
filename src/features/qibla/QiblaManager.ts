import { Coordinates, Qibla } from "adhan";
import { GeoCoordinates } from "@/features/prayerTimes/prayerTimes.types";

/**
 * Pure qibla math. Returns the great-circle bearing (degrees clockwise from
 * true north) from a location toward the Kaaba in Makkah.
 */
export class QiblaManager {
  bearing(coords: GeoCoordinates): number {
    return Qibla(new Coordinates(coords.latitude, coords.longitude));
  }

  /**
   * Angle (degrees) the qibla marker should sit at, given the device's current
   * compass heading. Normalised to [0, 360).
   */
  relativeAngle(coords: GeoCoordinates, deviceHeading: number): number {
    const bearing = this.bearing(coords);
    return (bearing - deviceHeading + 360) % 360;
  }
}

export const qiblaManager = new QiblaManager();
