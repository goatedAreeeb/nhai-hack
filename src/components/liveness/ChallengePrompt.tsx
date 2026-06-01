// src/components/liveness/ChallengePrompt.tsx — v4.1 stub
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureType } from '../../types';

interface ChallengePromptProps {
  gesture: GestureType;
  timeRemainingMs: number;
}

const GESTURE_LABELS: Record<GestureType, string> = {
  BLINK: '👁  Blink both eyes',
  SMILE: '😊  Smile naturally',
  LOOK_LEFT: '👈  Look left',
  LOOK_RIGHT: '👉  Look right',
  NOD: '⬆⬇  Nod your head',
};

export default function ChallengePrompt({ gesture, timeRemainingMs }: ChallengePromptProps): React.JSX.Element {
  const seconds = Math.ceil(timeRemainingMs / 1000);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{GESTURE_LABELS[gesture]}</Text>
      <Text style={styles.timer}>{seconds}s remaining</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 4 },
  label: { color: '#fff', fontSize: 18, fontWeight: '600' },
  timer: { color: '#a0a0c0', fontSize: 13, fontFamily: 'monospace' },
});
