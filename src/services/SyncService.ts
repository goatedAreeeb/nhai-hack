// src/services/SyncService.ts — v4.1 stub
// Phase 4 implementation required
// RULE 11: Only SUCCESS records go to AWS — getPendingSync() already filters
// B1 FIX: generateClient() from aws-amplify/api (NOT DataStore)
// B3 FIX: uploadData with key + accessLevel (key-based API, confirmed AWS v6 docs)
// F1 FIX: Buffer from @craftzdog/react-native-buffer (NOT global Buffer — not in Hermes)

import { databaseService } from './DatabaseService';
import { useAppStore } from '../store/useAppStore';

class SyncService {
  private unsubscribe: (() => void) | null = null;
  private isSyncing = false;

  startNetworkListener(): void {
    // Phase 4: NetInfo.addEventListener — detect WiFi → trigger sync
    // B1 FIX: use generateClient() + client.graphql() pattern
    // B3 FIX: use uploadData with key + accessLevel
    console.log('[Sync] Network listener stub — Phase 4 implementation required');
  }

  stopNetworkListener(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  async syncAllPending(): Promise<void> {
    if (this.isSyncing) return;
    // Phase 4: full sync implementation
    // RULE 11: getPendingSync() returns SUCCESS-only records
    const pending = await databaseService.getPendingSync();
    console.log(`[Sync] ${pending.length} SUCCESS records pending — Phase 4 sync not yet implemented`);
    const { setPendingSyncCount } = useAppStore.getState();
    const count = await databaseService.getPendingCount();
    setPendingSyncCount(count);
  }
}

export const syncService = new SyncService();
