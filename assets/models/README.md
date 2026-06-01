# assets/models/README.md
# Model Files — DatalakeOfflineAuth

Place the following AI model files here before Phase 2:

## Required Models

### MiniFASNet V2 (~2.7MB)
- File: `minifasnet_v2.onnx`
- Source: `garciafido/minifasnet-v2-anti-spoofing-onnx` on HuggingFace
- Download: `python Phase 1 Step A4` (from PHASE_1_TO_4.md)
- Used by: Layer 2 — Silent Passive Liveness

### EdgeFace-XS INT8 (~6MB)
- File: `edgeface_xs_int8.tflite`
- Source: `Idiap/edgeface_xs_gamma_06` on HuggingFace, converted via litert-torch
- Download+Convert: `python Phase 1 Step A5` (from PHASE_1_TO_4.md)
- Used by: Layer 4 — Face Recognition

## Combined size MUST be < 20MB

## .gitignore Note
Both model files are in .gitignore:
  assets/models/*.tflite
  assets/models/*.onnx
Upload to Google Drive and link in README.md for submission.
