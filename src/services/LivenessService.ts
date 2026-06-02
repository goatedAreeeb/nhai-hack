// src/services/LivenessService.ts
// Phase 2 implementation

// import { InferenceSession, Tensor } from 'onnxruntime-react-native';
type InferenceSession = any;
type Tensor = any;
import { AUTH_CONFIG } from '../config/constants';

export interface LivenessResult {
  isLive: boolean;
  liveScore: number;    // softmax[0] — class LIVE
  printScore: number;   // softmax[1] — class PRINT
  screenScore: number;  // softmax[2] — class SCREEN
  rawLogits: number[];  // RULE 10: always logged in __DEV__
}

class LivenessService {
  private session: InferenceSession | null = null;
  private inputName: string = '';
  private outputName: string = '';

  async initialize(): Promise<void> {
    console.log('[Liveness] initialize entered');
    return;
  }

  private softmax(logits: number[]): number[] {
    const maxLogit = Math.max(...logits);
    const exps = logits.map(l => Math.exp(l - maxLogit));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sumExps);
  }

  async checkLiveness(frameData: Float32Array): Promise<LivenessResult> {
    if (!this.session) {
      throw new Error('[Liveness] Model not initialized — call initialize() first');
    }

    // Input shape for MiniFASNet V2: 1x3x80x80
    const tensor = new Tensor('float32', frameData, [1, 3, 80, 80]);
    const feeds: Record<string, Tensor> = {};
    feeds[this.inputName] = tensor;

    const results = await this.session.run(feeds);
    const outputTensor = results[this.outputName];
    const logits = Array.from(outputTensor.data as Float32Array);

    const probs = this.softmax(logits);
    const liveScore = probs[0];
    const printScore = probs[1];
    const screenScore = probs[2];

    if (__DEV__) {
      console.log(`[Liveness] Raw logits:`, logits);
      console.log(`[Liveness] Softmax: live=${liveScore.toFixed(3)}, print=${printScore.toFixed(3)}, screen=${screenScore.toFixed(3)}`);
    }

    return {
      isLive: liveScore >= AUTH_CONFIG.LIVENESS_LIVE_THRESHOLD,
      liveScore,
      printScore,
      screenScore,
      rawLogits: logits,
    };
  }

  isReady(): boolean {
    return this.session !== null;
  }

  async runModelSelfTest(): Promise<void> {
    const prefix = 'Liveness ONNX MiniFASNet';
    console.log(`[${prefix}] Starting self test...`);
    if (!this.session) {
      await this.initialize();
    }
    
    console.log(`[${prefix}] Session Input Name: ${this.inputName}`);
    console.log(`[${prefix}] Session Output Name: ${this.outputName}`);

    // Create a dummy Float32Array sized for 1x3x80x80 (19200 elements)
    const dummyData = new Float32Array(1 * 3 * 80 * 80);
    for (let i = 0; i < dummyData.length; i++) {
      dummyData[i] = 0.5; // dummy values
    }

    try {
      const tensor = new Tensor('float32', dummyData, [1, 3, 80, 80]);
      const feeds: Record<string, Tensor> = {};
      feeds[this.inputName] = tensor;

      const results = await this.session!.run(feeds);
      const outputTensor = results[this.outputName];
      console.log(`[${prefix}] Output Tensor Dimensions: [${outputTensor.dims.join(', ')}]`);
      
      const logits = Array.from(outputTensor.data as Float32Array);
      console.log(`[${prefix}] Logits: [${logits.map(l => l.toFixed(4)).join(', ')}]`);

      const probs = this.softmax(logits);
      console.log(`[${prefix}] Softmax values: [${probs.map(p => p.toFixed(4)).join(', ')}]`);

      const liveScore = probs[0];
      const printScore = probs[1];
      const screenScore = probs[2];

      const result = {
        isLive: liveScore >= AUTH_CONFIG.LIVENESS_LIVE_THRESHOLD,
        liveScore,
        printScore,
        screenScore,
      };

      console.log(`[${prefix}] SUCCESS: Inference completed successfully. Output: ${JSON.stringify(result)}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[${prefix}] FAILED: ${msg}`);
    }
  }
}

export const livenessService = new LivenessService();
