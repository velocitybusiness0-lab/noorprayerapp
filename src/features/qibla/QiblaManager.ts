import { Coordinates, Qibla } from "adhan";
import { GeoCoordinates } from "@/features/prayerTimes/prayerTimes.types";
import { AngularMath } from "./AngularMath";

/**
 * Pure qibla math. Returns the great-circle bearing (degrees clockwise from
 * true north) from a location toward the Kaaba in Makkah.
 */
export class QiblaManager {
  bearing(coords: GeoCoordinates): number {
    return Qibla(new Coordinates(coords.latitude, coords.longitude));
  }

  /**
   * Screen-space needle angle: `qiblaBearing - deviceHeading`, normalized to
   * [0, 360). 0° means the phone top faces the Kaaba.
   */
  relativeAngle(coords: GeoCoordinates, deviceHeading: number): number {
    return AngularMath.normalizeDegrees(
      this.bearing(coords) - deviceHeading
    );
  }
}

export const qiblaManager = new QiblaManager();
