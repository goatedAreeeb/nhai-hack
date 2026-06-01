// src/components/camera/FaceScanRing.tsx — v4.1 stub
// Phase 5 implementation required
// Library: react-native-reanimated@4 (SDK 56 ships Reanimated 4)
// All animations via useAnimatedStyle/withRepeat — zero JS thread

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthStage } from '../../types';

interface FaceScanRingProps {
  authStage: AuthStage;
  size?: number;
}

const STAGE_COLORS: Record<AuthStage, string> = {
  IDLE: '#444',
  GPS_CHECK: '#f59e0b',
  SILENT_LIVENESS: '#3b82f6',
  GESTURE: '#8b5cf6',
  FACE_MATCH: '#ec4899',
  LOGGING: '#14b8a6',
  SUCCESS: '#4ade80',
  FAILED: '#ef4444',
};

// Phase 5: replace with animated Reanimated 4 ring
// useAnimatedStyle + withRepeat(withTiming) for pulse
// Color transitions per authStage (STAGE_COLORS above)
export default function FaceScanRing({ authStage, size = 240 }: FaceScanRingProps): React.JSX.Element {
  const color = STAGE_COLORS[authStage];
  return (
    <View
      style={[
        styles.ring,
        { width: size, height: size, borderRadius: size / 2, borderColor: color },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
