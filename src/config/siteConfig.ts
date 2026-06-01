// src/config/siteConfig.ts — v4.1
// DatalakeOfflineAuth — GPS polygon for SIT Hyderabad Campus
// Coordinates confirmed by human ✅ (geojson.io, [longitude, latitude] format)
// RULE 1: NO HARDCODED DATA — real GPS polygon, real siteId

import { SiteConfig } from '../types';

// Confirmed SITE_POLYGON from geojson.io — SIT Hyderabad area (~17.15°N, 78.21°E)
// Format: [longitude, latitude] — correct for Turf.js booleanPointInPolygon
export const SITE_POLYGON: number[][] = [
  [78.21095232520418, 17.152811199280265],
  [78.20963746511268, 17.148680283319692],
  [78.21090205239074, 17.14830320214253],
  [78.21274637465046, 17.148806502206256],
  [78.21381652089843, 17.149773008024596],
  [78.21297957193639, 17.15110194111506],
  [78.21206776758953, 17.15191277104057],
  [78.21141884344735, 17.15241247306041],
  [78.21095232520418, 17.152811199280265], // closed polygon — first === last
];

// Test cases (validated before Phase 2 GPS implementation):
// INSIDE:  { latitude: 17.1505, longitude: 78.2118 } → isInsideSite() === true
// OUTSIDE: { latitude: 17.1450, longitude: 78.2200 } → isInsideSite() === false

export const TEST_SITE: SiteConfig = {
  siteId: 'SITE_001',
  siteName: 'SIT Hyderabad Campus',
  polygon: SITE_POLYGON,
  radiusMeters: 100,
  centerLat: 17.1505,   // approximate centroid of polygon
  centerLng: 78.2118,
};

export const ALL_SITES: SiteConfig[] = [TEST_SITE];

export function getSiteById(id: string): SiteConfig | undefined {
  return ALL_SITES.find(s => s.siteId === id);
}
