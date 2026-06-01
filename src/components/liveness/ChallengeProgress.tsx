// src/components/liveness/ChallengeProgress.tsx — v4.1 stub
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ChallengeProgressProps {
  progressRatio: number; // 0.0 to 1.0
  color?: string;
}

export default function ChallengeProgress({ progressRatio, color = '#8b5cf6' }: ChallengeProgressProps): React.JSX.Element {
  const clampedRatio = Math.max(0, Math.min(1, progressRatio));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clampedRatio * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
