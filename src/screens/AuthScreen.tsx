// src/screens/AuthScreen.tsx — v4.1 stub
// Phase 5 implementation required
// All 9 layers invoked here in sequence
// RULE 1: siteId from employee.siteId — never hardcoded

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Phase 5 implementation requirements (from PHASE_5_TO_7.md Task 5.2):
// 1. Employee picker: from databaseService.getAllEmployees() — no default, no hardcoded ID
// 2. Retrieve embedding: encryptionService.retrieveEmbedding(employee.embeddingRef)
// 3. GPS runs first — camera does NOT activate until Layer 1 passes
// 4. Liveness: 3 consecutive positive frames before passing
// 5. Challenge: gestureService.getRandomChallenge() — new random per session
// 6. Face: faceRecogService.compareEmbeddings(liveEmbedding, storedEmbedding)
// 7. Log: logAttendance({ siteId: employee.siteId, ... }) — siteId from employee, not hardcoded
// 8. Show actual distance on SUCCESS in __DEV__ mode
// 9. Show actual failReason on FAILED screen always
// 10. Every stage updates authStage in Zustand store

export default function AuthScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AuthScreen</Text>
      <Text style={styles.sub}>Phase 5 implementation required</Text>
      <Text style={styles.note}>Layers 1–9 will execute here in sequence</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sub: { color: '#4ade80', fontFamily: 'monospace', fontSize: 12 },
  note: { color: '#666', fontFamily: 'monospace', fontSize: 11 },
});
