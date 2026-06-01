// src/screens/AdminScreen.tsx — v4.1 stub
// Phase 5 implementation required
// RULE 2: All data from real SQLite — no hardcoded numbers, no fake data

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Phase 5 implementation requirements (from PHASE_5_TO_7.md Task 5.4):
// 1. All data from real SQLite — no hardcoded numbers
// 2. Today count: getTodayAttendance().length
// 3. Pending count: useAppStore pendingSyncCount (RULE 11: only SUCCESS count)
// 4. Bar chart: VictoryBar with attendance per hour from getTodayAttendance()
// 5. Zero records today: show "No attendance today" — never fake data
// 6. Site filter: filter by site_id column
// 7. Manual sync: syncService.syncAllPending() on press
// 8. Network dot: green=ONLINE red=OFFLINE from store

export default function AdminScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AdminScreen</Text>
      <Text style={styles.sub}>Phase 5 implementation required</Text>
      <Text style={styles.note}>VictoryBar chart + real SQLite data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sub: { color: '#4ade80', fontFamily: 'monospace', fontSize: 12 },
  note: { color: '#666', fontFamily: 'monospace', fontSize: 11 },
});
