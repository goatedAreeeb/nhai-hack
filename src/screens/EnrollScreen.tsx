// src/screens/EnrollScreen.tsx — v4.1 stub
// Phase 5 implementation required
// F4 FIX: Liveness check MUST run before each of the 3 enrollment captures
// RULE 1: siteId from site picker — never hardcoded

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Phase 5 implementation requirements (from PHASE_5_TO_7.md Task 5.3):
// 1. Name: required text, min 2 chars, no default
// 2. Supervisor ID: required text, no default
// 3. Site: picker from ALL_SITES — user must select, no default
// 4. 3 camera captures with preview between each (ENROLLMENT_INTERVAL_MS gap)
// 5. F4 FIX — LIVENESS DURING ENROLLMENT:
//    Before accepting each capture, run LivenessService.checkLiveness() on that frame.
//    If softmax[0] < LIVENESS_LIVE_THRESHOLD (0.85): reject capture,
//    show "Not a live face — try again", do NOT count toward the 3.
//    All 3 accepted captures MUST have passed liveness.
//    This prevents enrolling a printed photo or video as a valid employee.
// 6. averageEmbeddings → storeEmbedding(key, averaged) → insertEmployee with siteId from picker
// 7. Show generated UUID as employee ID on success

export default function EnrollScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EnrollScreen</Text>
      <Text style={styles.sub}>Phase 5 implementation required</Text>
      <Text style={styles.note}>F4: Liveness check required before each capture</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sub: { color: '#4ade80', fontFamily: 'monospace', fontSize: 12 },
  note: { color: '#f59e0b', fontFamily: 'monospace', fontSize: 11 },
});
