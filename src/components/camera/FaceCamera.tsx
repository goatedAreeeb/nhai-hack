// src/components/camera/FaceCamera.tsx — v4.1 stub
// Phase 2 implementation required
// Library: react-native-vision-camera@4 + react-native-worklets-core

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FaceCameraProps {
  onLivenessResult?: (isLive: boolean, score: number) => void;
  onFaceDetected?: (faceData: Record<string, unknown>) => void;
  mode?: 'liveness' | 'gesture' | 'enrollment';
}

// Phase 2: implement VisionCamera frame processor worklet
// - runs liveness + gesture detection in worklet thread (zero JS thread)
// - uses NitroModules.box() for TFLite inference in worklet context
export default function FaceCamera({ mode = 'liveness' }: FaceCameraProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>FaceCamera stub — Phase 2 ({mode})</Text>
      <Text style={styles.sub}>Requires: real device + vision camera permissions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  text: { color: '#4ade80', fontFamily: 'monospace', fontSize: 12 },
  sub: { color: '#666', fontFamily: 'monospace', fontSize: 10, marginTop: 4 },
});
