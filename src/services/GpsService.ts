// src/services/GpsService.ts
// Phase 2 implementation

import * as Location from 'expo-location';
import * as turf from '@turf/turf';
import { AUTH_CONFIG } from '../config/constants';
import { SITE_POLYGON } from '../config/siteConfig';

export interface GpsResult {
  isInsideGeofence: boolean;
  latitude: number;
  longitude: number;
  accuracy: number;
  failReason?: string;
}

// RULE 1: NO HARDCODED DATA — uses real GPS from device
// RULE 4: Promise.race() for timeout — NOT timeInterval param (confirmed from Architecture)
// Layer 1: GPS Geofence — expo-location@17 + @turf/turf@6
class GpsService {
  async checkGeofence(): Promise<GpsResult> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return {
          isInsideGeofence: false,
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          failReason: 'Location permission denied',
        };
      }

      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('GPS_TIMEOUT')), AUTH_CONFIG.GPS_TIMEOUT_MS);
      });

      const location = await Promise.race([locationPromise, timeoutPromise]);

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const accuracy = location.coords.accuracy || Number.MAX_SAFE_INTEGER;

      if (accuracy > AUTH_CONFIG.GPS_ACCURACY_MAX_METRES) {
        return {
          isInsideGeofence: false,
          latitude,
          longitude,
          accuracy,
          failReason: `Accuracy ${Math.round(accuracy)}m exceeds max ${AUTH_CONFIG.GPS_ACCURACY_MAX_METRES}m`,
        };
      }

      const isInside = this.isInsideSite(latitude, longitude);

      if (!isInside) {
        return {
          isInsideGeofence: false,
          latitude,
          longitude,
          accuracy,
          failReason: 'Outside site geofence',
        };
      }

      return {
        isInsideGeofence: true,
        latitude,
        longitude,
        accuracy,
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        isInsideGeofence: false,
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        failReason: err.message === 'GPS_TIMEOUT'
          ? `GPS timeout after ${AUTH_CONFIG.GPS_TIMEOUT_MS}ms`
          : err.message,
      };
    }
  }

  isInsideSite(latitude: number, longitude: number): boolean {
    const point = turf.point([longitude, latitude]);
    const polygon = turf.polygon([SITE_POLYGON]);
    return turf.booleanPointInPolygon(point, polygon);
  }
}

export const gpsService = new GpsService();
