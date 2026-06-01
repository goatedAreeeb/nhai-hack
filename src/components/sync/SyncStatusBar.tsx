// src/components/sync/SyncStatusBar.tsx — v4.1 stub
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';

export default function SyncStatusBar(): React.JSX.Element {
  const networkStatus = useAppStore(s => s.networkStatus);
  const pendingSyncCount = useAppStore(s => s.pendingSyncCount);
  const isSyncing = useAppStore(s => s.isSyncing);
  const lastSyncAt = useAppStore(s => s.lastSyncAt);

  const isOnline = networkStatus === 'ONLINE';
  const dotColor = isOnline ? '#4ade80' : '#ef4444';

  return (
    <View style={styles.bar}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={styles.text}>
        {isSyncing
          ? 'Syncing...'
          : `${networkStatus} · ${pendingSyncCount} pending`}
      </Text>
      {lastSyncAt && (
        <Text style={styles.sub}>
          Last sync: {new Date(lastSyncAt).toLocaleTimeString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#111',
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { color: '#a0a0c0', fontSize: 11, fontFamily: 'monospace' },
  sub: { color: '#666', fontSize: 10, fontFamily: 'monospace', marginLeft: 'auto' },
});
