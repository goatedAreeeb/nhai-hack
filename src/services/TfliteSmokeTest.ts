import { loadTensorflowModel } from 'react-native-fast-tflite';
import { Asset } from 'expo-asset';

export async function runTfliteSmokeTest(): Promise<boolean> {
  const prefix = 'TFLITE_SMOKE';
  console.log(`[${prefix}] Starting load test...`);
  try {
    const asset = Asset.fromModule(require('../../assets/models/test_model.tflite'));
    await asset.downloadAsync();
    
    if (!asset.localUri) {
      throw new Error('Asset downloadAsync succeeded but localUri is null!');
    }
    
    console.log(`[${prefix}] asset.localUri: ${asset.localUri}`);
    
    const model = await loadTensorflowModel({ url: asset.localUri });
    console.log(`[${prefix}] Model loaded successfully!`);
    
    console.log(`[${prefix}] Inputs:`);
    model.inputs.forEach(t => console.log(`[${prefix}]  - ${t.name}: ${t.dataType} [${t.shape.join(', ')}]`));
    
    console.log(`[${prefix}] Outputs:`);
    model.outputs.forEach(t => console.log(`[${prefix}]  - ${t.name}: ${t.dataType} [${t.shape.join(', ')}]`));
    
    return true;
  } catch (error: any) {
    console.error(`[${prefix}] Smoke test failed:`, error.message);
    return false;
  }
}
