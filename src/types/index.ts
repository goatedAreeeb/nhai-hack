// src/types/index.ts — v4.1
// DatalakeOfflineAuth — All types, RULE 9: zero `any`

export interface Employee {
  id: string;
  name: string;
  embeddingRef: string;
  enrolledAt: string;
  enrolledBy: string;
  siteId: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  siteId: string;           // from Employee.siteId — never hardcoded
  timestamp: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  faceScore: number;
  livenessScore: number;
  gestureChallenge: GestureType;
  gestureResult: boolean;
  authResult: AuthResult;
  photoPath: string | null;
  synced: 0 | 1;
  syncedAt: string | null;
}

export type GestureType = 'BLINK' | 'SMILE' | 'LOOK_LEFT' | 'LOOK_RIGHT' | 'NOD';

export type AuthResult =
  | 'SUCCESS' | 'FAIL_GPS' | 'FAIL_LIVENESS'
  | 'FAIL_GESTURE' | 'FAIL_FACE' | 'FAIL_TIMEOUT';

export type AuthStage =
  | 'IDLE' | 'GPS_CHECK' | 'SILENT_LIVENESS'
  | 'GESTURE' | 'FACE_MATCH' | 'LOGGING' | 'SUCCESS' | 'FAILED';

export type NetworkStatus = 'ONLINE' | 'OFFLINE' | 'UNKNOWN';

export interface SiteConfig {
  siteId: string;
  siteName: string;
  polygon: number[][];
  radiusMeters: number;
  centerLat: number;
  centerLng: number;
}

export interface AppState {
  authStage: AuthStage;
  currentEmployee: Employee | null;
  lastAuthResult: AuthResult | null;
  activeChallenge: GestureType | null;
  networkStatus: NetworkStatus;
  pendingSyncCount: number;
  isSyncing: boolean;
  lastSyncAt: string | null;
  currentLat: number | null;
  currentLng: number | null;
  isInsideGeofence: boolean | null;
  activeSite: SiteConfig | null;
  setAuthStage: (s: AuthStage) => void;
  setCurrentEmployee: (e: Employee | null) => void;
  setNetworkStatus: (s: NetworkStatus) => void;
  setPendingSyncCount: (n: number) => void;
  setIsSyncing: (v: boolean) => void;
  setActiveChallenge: (g: GestureType | null) => void;
  setGpsPosition: (lat: number, lng: number) => void;
  setIsInsideGeofence: (v: boolean) => void;
  setActiveSite: (s: SiteConfig | null) => void;
  setLastSyncAt: (ts: string) => void;
}
