// src/services/GpsService.ts — v4.1 stub
// Phase 2 implementation required (blocked until models validated per RULE 5)
// Interface defined here so imports compile in Phase 1

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
    // Phase 2 implementation — stub returns error until implemented
    throw new Error('[GPS] GpsService.checkGeofence() not yet implemented — Phase 2 task');
  }

  // Test helper — validates polygon coordinates [longitude, latitude] order
  isInsideSite(latitude: number, longitude: number): boolean {
    const point = turf.point([longitude, latitude]);
    const polygon = turf.polygon([SITE_POLYGON]);
    return turf.booleanPointInPolygon(point, polygon);
  }
}

export const gpsService = new GpsService();

// Silence unused import warning until Phase 2
void Location;
void AUTH_CONFIG;
