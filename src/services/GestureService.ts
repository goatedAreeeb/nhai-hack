// src/services/GestureService.ts — v4.1 stub
// Phase 2 implementation required (blocked until vision-camera-face-detector validated)
// Interface defined here so imports compile in Phase 1
// Library: react-native-vision-camera-face-detector

import { AUTH_CONFIG } from '../config/constants';
import { GestureType } from '../types';

export interface GestureResult {
  success: boolean;
  gesture: GestureType;
  failReason?: string;
  elapsedMs: number;
}

export interface FaceDetectionData {
  smilingProbability: number;
  leftEyeOpenProbability: number;
  rightEyeOpenProbability: number;
  headEulerAngleX: number;  // pitch (NOD)
  headEulerAngleY: number;  // yaw  (LOOK_LEFT / LOOK_RIGHT)
}

const ALL_GESTURES: GestureType[] = ['BLINK', 'SMILE', 'LOOK_LEFT', 'LOOK_RIGHT', 'NOD'];

// Layer 3: Active Gesture Challenge
// Timeout: AUTH_CONFIG.GESTURE_TIMEOUT_MS (10 seconds)
// NOD limitation: maxAngle change can be triggered by phone movement — documented
class GestureService {
  // Returns a new random challenge each session — never predictable
  getRandomChallenge(): GestureType {
    const idx = Math.floor(Math.random() * ALL_GESTURES.length);
    return ALL_GESTURES[idx];
  }

  evaluateGesture(
    _face: FaceDetectionData,
    _challenge: GestureType,
  ): boolean {
    // Phase 2: implement per-gesture evaluation using AUTH_CONFIG thresholds
    // BLINK:      leftEyeOpenProbability < BLINK_EYE_THRESHOLD AND rightEyeOpenProbability < BLINK_EYE_THRESHOLD
    // SMILE:      smilingProbability > SMILE_THRESHOLD
    // LOOK_LEFT:  headEulerAngleY < -HEAD_TURN_ANGLE
    // LOOK_RIGHT: headEulerAngleY > HEAD_TURN_ANGLE
    // NOD:        headEulerAngleX delta > NOD_ANGLE_DELTA within NOD_WINDOW_MS
    throw new Error('[Gesture] evaluateGesture() not yet implemented — Phase 2 task');
  }
}

export const gestureService = new GestureService();

void AUTH_CONFIG;
