// src/services/EncryptionService.ts — v4.1 stub
// Phase 3 implementation required
// Library: react-native-keychain@8
// Storage: WHEN_UNLOCKED_THIS_DEVICE_ONLY
// NOTE: Emulator may use software keychain — document actual behavior in tests (RULE 8)

export interface KeychainResult {
  success: boolean;
  isHardwareBacked?: boolean; // document actual behavior — do not assume
  errorMessage?: string;
}

class EncryptionService {
  // Store a 128-dim face embedding as JSON string in device keychain
  async storeEmbedding(_key: string, _embedding: number[]): Promise<KeychainResult> {
    // Phase 3: use react-native-keychain setInternetCredentials or setGenericPassword
    // accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE
    // accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
    throw new Error('[Encryption] storeEmbedding() not yet implemented — Phase 3 task');
  }

  // Retrieve and parse a stored embedding
  async retrieveEmbedding(_key: string): Promise<number[] | null> {
    // Phase 3: use react-native-keychain getInternetCredentials or getGenericPassword
    throw new Error('[Encryption] retrieveEmbedding() not yet implemented — Phase 3 task');
  }

  // Delete a stored embedding (used when re-enrolling)
  async deleteEmbedding(_key: string): Promise<void> {
    throw new Error('[Encryption] deleteEmbedding() not yet implemented — Phase 3 task');
  }
}

export const encryptionService = new EncryptionService();
