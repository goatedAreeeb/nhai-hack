// src/screens/SettingsScreen.tsx — v4.1 stub
// Phase 5 implementation — low priority

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SettingsScreen</Text>
      <Text style={styles.sub}>Phase 5 implementation required</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sub: { color: '#666', fontFamily: 'monospace', fontSize: 12 },
});
