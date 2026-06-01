// src/store/useAppStore.ts — v4.1
// DatalakeOfflineAuth — Zustand@4 store with AsyncStorage persist middleware
// RULE 9: zero `any` — all types from src/types/index.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppState,
  AuthStage,
  AuthResult,
  Employee,
  GestureType,
  NetworkStatus,
  SiteConfig,
} from '../types';

// Only non-sensitive fields are persisted (networkStatus, lastSyncAt, pendingSyncCount, activeSite)
// NEVER persist: currentEmployee, authStage, activeChallenge, GPS coords, liveness/face data

type PersistedFields = Pick<AppState,
  'networkStatus' | 'lastSyncAt' | 'pendingSyncCount' | 'activeSite'
>;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth flow
      authStage: 'IDLE' as AuthStage,
      currentEmployee: null as Employee | null,
      lastAuthResult: null as AuthResult | null,
      activeChallenge: null as GestureType | null,

      // Network + sync
      networkStatus: 'UNKNOWN' as NetworkStatus,
      pendingSyncCount: 0,
      isSyncing: false,
      lastSyncAt: null as string | null,

      // GPS
      currentLat: null as number | null,
      currentLng: null as number | null,
      isInsideGeofence: null as boolean | null,
      activeSite: null as SiteConfig | null,

      // Setters
      setAuthStage: (s: AuthStage) => set({ authStage: s }),
      setCurrentEmployee: (e: Employee | null) => set({ currentEmployee: e }),
      setNetworkStatus: (s: NetworkStatus) => set({ networkStatus: s }),
      setPendingSyncCount: (n: number) => set({ pendingSyncCount: n }),
      setIsSyncing: (v: boolean) => set({ isSyncing: v }),
      setActiveChallenge: (g: GestureType | null) => set({ activeChallenge: g }),
      setGpsPosition: (lat: number, lng: number) =>
        set({ currentLat: lat, currentLng: lng }),
      setIsInsideGeofence: (v: boolean) => set({ isInsideGeofence: v }),
      setActiveSite: (s: SiteConfig | null) => set({ activeSite: s }),
      setLastSyncAt: (ts: string) => set({ lastSyncAt: ts }),
    }),
    {
      name: 'datalake-app-state',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist safe, non-sensitive fields
      partialize: (state): PersistedFields => ({
        networkStatus: state.networkStatus,
        lastSyncAt: state.lastSyncAt,
        pendingSyncCount: state.pendingSyncCount,
        activeSite: state.activeSite,
      }),
    }
  )
);
