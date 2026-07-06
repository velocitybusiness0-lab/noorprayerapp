import * as Location from "expo-location";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { ResolvedLocation } from "@/features/prayerTimes/prayerTimes.types";

export type LocationPermission = "granted" | "denied" | "undetermined";

/**
 * Owns device location access for prayer times and qibla. Persists the last
 * known fix so the app can compute times offline / before a new fix arrives.
 */
export class LocationManager {
  async requestPermission(): Promise<LocationPermission> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status as LocationPermission;
  }

  async getPermission(): Promise<LocationPermission> {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status as LocationPermission;
  }

  getLastKnown(): ResolvedLocation | undefined {
    return storage.getObject<ResolvedLocation>(StorageKeys.lastKnownLocation);
  }

  /**
   * Returns a fresh fix, falling back to the last known location when a live
   * fix is unavailable. Throws only when there is no fix at all.
   */
  async resolve(): Promise<ResolvedLocation> {
    const permission = await this.getPermission();
    if (permission !== "granted") {
      const requested = await this.requestPermission();
      if (requested !== "granted") {
        const cached = this.getLastKnown();
        if (cached) return cached;
        throw new Error("Location permission is required for prayer times.");
      }
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const resolved: ResolvedLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: Date.now(),
      ...(await this.reverseGeocode(position.coords)),
    };

    storage.setObject(StorageKeys.lastKnownLocation, resolved);
    return resolved;
  }

  private async reverseGeocode(
    coords: Pick<ResolvedLocation, "latitude" | "longitude">
  ): Promise<{ name?: string; countryCode?: string }> {
    try {
      const [place] = await Location.reverseGeocodeAsync(coords);
      if (!place) return {};
      const name = [place.city ?? place.subregion, place.region]
        .filter(Boolean)
        .join(", ");
      return {
        name: name || undefined,
        countryCode: place.isoCountryCode ?? undefined,
      };
    } catch {
      return {};
    }
  }
}

export const locationManager = new LocationManager();
