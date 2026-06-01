// src/services/FaceRecogService.ts — v4.1 stub
// Phase 2 implementation required (blocked until EdgeFace TFLite model validated)
// Interface defined here so imports compile in Phase 1
// Model: EdgeFace-XS INT8 TFLite (~6MB, Idiap/edgeface_xs_gamma_06)
// Library: react-native-fast-tflite + NitroModules.box() + vision-camera-resize-plugin

import { AUTH_CONFIG } from '../config/constants';

export interface FaceEmbedding {
  values: number[];  // 128-dimensional L2-normalized embedding
  capturedAt: string;
}

export interface FaceMatchResult {
  isMatch: boolean;
  distance: number;         // Euclidean distance (lower = more similar)
  threshold: number;        // calibrated FACE_MATCH_THRESHOLD used
}

// Layer 4: Face Recognition
// Input: 112×112 RGB float32, normalized (pixel/255 - 0.5) / 0.5
// Output: (1,128) L2-normalized embedding
// Compare: Euclidean distance < FACE_MATCH_THRESHOLD
class FaceRecogService {
  private modelLoaded = false;

  async initialize(): Promise<void> {
    // Phase 2: load react-native-fast-tflite model from assets/models/edgeface_xs_int8.tflite
    // RULE 4: print input/output tensor shapes at runtime
    // RULE 10: print embedding[0:5] before trusting output
    throw new Error('[FaceRecog] FaceRecogService.initialize() not yet implemented — Phase 2 task');
  }

  async extractEmbedding(_frameData: Float32Array): Promise<FaceEmbedding> {
    if (!this.modelLoaded) {
      throw new Error('[FaceRecog] Model not initialized — call initialize() first');
    }
    throw new Error('[FaceRecog] extractEmbedding() not yet implemented — Phase 2 task');
  }

  // Euclidean distance between two 128-dim L2-normalized vectors
  compareEmbeddings(a: number[], b: number[]): FaceMatchResult {
    if (a.length !== AUTH_CONFIG.FACE_EMBEDDING_DIM || b.length !== AUTH_CONFIG.FACE_EMBEDDING_DIM) {
      throw new Error(
        `[FaceRecog] Embedding dimension mismatch: got ${a.length} and ${b.length}, expected ${AUTH_CONFIG.FACE_EMBEDDING_DIM}`
      );
    }
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const diff = a[i] - b[i];
      sum += diff * diff;
    }
    const distance = Math.sqrt(sum);
    return {
      isMatch: distance < AUTH_CONFIG.FACE_MATCH_THRESHOLD,
      distance,
      threshold: AUTH_CONFIG.FACE_MATCH_THRESHOLD,
    };
  }

  // Average 3 enrollment embeddings into a single representative embedding
  averageEmbeddings(embeddings: number[][]): number[] {
    if (embeddings.length === 0) {
      throw new Error('[FaceRecog] averageEmbeddings: empty input');
    }
    const dim = AUTH_CONFIG.FACE_EMBEDDING_DIM;
    const avg = new Array<number>(dim).fill(0);
    for (const emb of embeddings) {
      if (emb.length !== dim) {
        throw new Error(`[FaceRecog] averageEmbeddings: dimension mismatch ${emb.length} !== ${dim}`);
      }
      for (let i = 0; i < dim; i++) {
        avg[i] += emb[i] / embeddings.length;
      }
    }
    return avg;
  }

  isReady(): boolean {
    return this.modelLoaded;
  }
}

export const faceRecogService = new FaceRecogService();
