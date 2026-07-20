import type { LocationHeadingObject } from "expo-location";

/**
 * Picks the compass heading sample to drive the qibla UI.
 * Prefers true north when the OS reports a valid reading; otherwise magnetic.
 */
export class QiblaDeviceHeadingResolver {
  resolve(sample: LocationHeadingObject): number {
    if (Number.isFinite(sample.trueHeading) && sample.trueHeading >= 0) {
      return sample.trueHeading;
    }
    return sample.magHeading;
  }

  /**
   * True when heading accuracy is missing/invalid or too coarse to trust.
   * Expo iOS: degrees of error; negative means invalid.
   */
  needsCalibration(accuracy: number | null): boolean {
    if (accuracy === null) return false;
    if (accuracy < 0) return true;
    return accuracy > 35;
  }
}

export const qiblaDeviceHeadingResolver = new QiblaDeviceHeadingResolver();
