// src/components/common/ErrorDisplay.tsx — v4.1
// RULE 3: NO SILENT ERRORS — every error must be shown on screen with full message

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorDisplayProps {
  message: string;
  code?: string;
  visible?: boolean;
}

// RULE 3: Always display error message on screen — never swallow silently
export default function ErrorDisplay({ message, code, visible = true }: ErrorDisplayProps): React.JSX.Element | null {
  if (!visible || !message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      {code && <Text style={styles.code}>{code}</Text>}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a0808',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 4,
  },
  icon: { fontSize: 16 },
  code: {
    color: '#ef4444',
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  message: {
    color: '#fca5a5',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
