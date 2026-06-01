// src/services/LivenessService.ts — v4.1 stub
// Phase 2 implementation required (blocked until MiniFASNet ONNX model validated)
// Interface defined here so imports compile in Phase 1
// Model: MiniFASNet V2 (garciafido/minifasnet-v2-anti-spoofing-onnx, ~2.7MB)
// Library: onnxruntime-react-native@1.18

export interface LivenessResult {
  isLive: boolean;
  liveScore: number;    // softmax[0] — class LIVE
  printScore: number;   // softmax[1] — class PRINT
  screenScore: number;  // softmax[2] — class SCREEN
  rawLogits: number[];  // RULE 10: always logged in __DEV__
}

// Layer 2: Silent Passive Liveness
// Input: 80×80 BGR float32 [0,1]
// Output: (1,3) raw logits → softmax → [live=0, print=1, screen=2]
// Pass: softmax[0] >= 0.85 (LIVENESS_LIVE_THRESHOLD)
class LivenessService {
  private sessionLoaded = false;

  async initialize(): Promise<void> {
    // Phase 2: load onnxruntime-react-native InferenceSession from assets/models/minifasnet_v2.onnx
    // RULE 4: print model input/output shapes at runtime before trusting
    // RULE 10: print raw logits in __DEV__ before trusting class indices
    throw new Error('[Liveness] LivenessService.initialize() not yet implemented — Phase 2 task');
  }

  async checkLiveness(_frameData: Float32Array): Promise<LivenessResult> {
    if (!this.sessionLoaded) {
      throw new Error('[Liveness] Model not initialized — call initialize() first');
    }
    throw new Error('[Liveness] checkLiveness() not yet implemented — Phase 2 task');
  }

  isReady(): boolean {
    return this.sessionLoaded;
  }
}

export const livenessService = new LivenessService();
