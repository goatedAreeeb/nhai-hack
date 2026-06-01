# Phase Test Logs — v4.1
# DatalakeOfflineAuth — Hackathon 7.0
# Fill in ALL values during testing. RULE 10: record actual runtime outputs.

Device: [model, Android version, RAM]
Tester: [name]
Date:   [YYYY-MM-DD]

---

## Pre-coding Validations (Phase 1 Human Tasks)

### litert_torch API (from PHASE_1_TO_4.md A5 help() output)
```
convert() signature confirmed: [YES/NO]
Actual signature: ___
```

### MiniFASNet Class Order (from A4 Python output) — RULE 10
```
Input shape confirmed (1,3,80,80): [YES/NO]
Output shape confirmed (1,3):      [YES/NO]

Live-ish input softmax:
  index 0 (live):   ___
  index 1 (print):  ___
  index 2 (screen): ___

Attack-like input softmax:
  index 0 (live):   ___
  index 1 (print):  ___
  index 2 (screen): ___

Class order [live=0, print=1, screen=2] confirmed: [YES/NO]
```

### Amplify v6 API Check (from Phase 1 B3 node command)
```
generateClient: [function/undefined] ← MUST be function
uploadData:     [function/undefined] ← MUST be function
```

### Model Sizes (Phase 1 A6)
```
edgeface_xs_int8.tflite: ___ MB
minifasnet_v2.onnx:      ___ MB
TOTAL:                   ___ MB (< 20MB required)
```

---

## Phase 1 — Foundation

| Test | Result | Notes |
|---|---|---|
| App builds: npx expo run:android --device | [ ] | |
| CHECK 1: DB init ✅ | [ ] | |
| CHECK 2: Zustand store ✅ | [ ] | |
| CHECK 3: DB getPendingCount (SUCCESS filter) ✅ | [ ] | |
| CHECK 4: Amplify stub ✅ | [ ] | |
| CHECK 5: Library versions logged ✅ | [ ] | |
| TypeScript: npx tsc --noEmit → zero errors | [ ] | |
| DB browser: attendance.site_id column exists | [ ] | |
| DB browser: idx_result index exists | [ ] | |
| getPendingSync SQL = WHERE synced=0 AND auth_result='SUCCESS' | [ ] | |
| generateClient + uploadData both = 'function' | [ ] | |

**Phase 1: [PASS / FAIL]**

---

## Phase 2 — AI Core

| Test | Result | Measured |
|---|---|---|
| G1: Inside polygon → success=true | [ ] | lat=___ lng=___ acc=___m dur=___ms |
| G2: Outside polygon → success=false | [ ] | failReason=___ |
| G3: Deny permission → FAIL_GPS | [ ] | |
| L1: Real face → isLive=true | [ ] | liveScore=___ |
| L2: Paper photo → isLive=false | [ ] | liveScore=___ printScore=___ |
| L3: Screen video → isLive=false | [ ] | liveScore=___ screenScore=___ |
| GS1: Blink | [ ] | leftEye=___ rightEye=___ |
| GS2: Smile | [ ] | smilingProb=___ |
| GS3: Look left ~20° | [ ] | eulerY=___ |
| GS4: Look right ~20° | [ ] | eulerY=___ |
| GS5: No gesture 10s → FAIL_GESTURE | [ ] | timeout at ___ms |
| F1: Enroll 3 captures | [ ] | embedding[0:5]=___ |
| F2: Auth as yourself | [ ] | distance=___ (same person) |
| F3: Different real person | [ ] | distance=___ (different) |
| THRESHOLD calibrated | N/A | midpoint F2/F3 = ___ |
| Speed: AI processing only | [ ] | Live=___ms Gest=___ms Face=___ms SQLite=___ms TOTAL=___ms |

⚠️ If L2 or L3 pass liveness: print __DEV__ logits, report to human, DO NOT lower threshold.

**Phase 2: [PASS / FAIL]**

---

## Phase 3 — Data Layer

| Test | Result |
|---|---|
| Keychain round-trip: store → retrieve → 128 values match | [ ] |
| employees.embedding_ref = key string (NOT raw numbers) | [ ] |
| attendance.site_id = real site ID (not 'SITE_001' string literal) | [ ] |
| Log 1 SUCCESS + 1 FAIL_GPS → both in DB with correct auth_result | [ ] |
| RULE 11: getPendingSync returns ONLY SUCCESS record (insert 1 SUCCESS + 1 FAIL_GPS → get 1) | [ ] |
| synced=0 for new records | [ ] |
| Keychain hardware-backed behavior documented: ___ | [ ] |

**Phase 3: [PASS / FAIL]**

---

## Phase 4 — Sync Engine

| Test | Result |
|---|---|
| npx amplify push successful (no CloudFormation errors) | [ ] |
| src/graphql/mutations.ts replaced by Amplify codegen | [ ] |
| generateClient().graphql() confirmed functional | [ ] |
| uploadData key+accessLevel test with dummy file | [ ] |
| WiFi off → log 3 SUCCESS records → all synced=0 in SQLite | [ ] |
| WiFi on → auto-sync triggers within 10 seconds | [ ] |
| DynamoDB: records appear with siteId = real site ID | [ ] |
| S3: photos at attendance/[employeeId]/[recordId].jpg | [ ] |
| SQLite after sync: synced=1, synced_at set, photo_path=NULL | [ ] |
| Device: photo files deleted from storage | [ ] |
| RULE 11: insert 1 FAIL_GPS → NOT in DynamoDB after sync | [ ] |
| Batch: 10+ records sync in one WiFi reconnect | [ ] |
| Pending count drops to 0 in Zustand after sync | [ ] |

**Phase 4: [PASS / FAIL]**

---

## Phase 5 — UI

| Test | Result |
|---|---|
| FaceScanRing color changes per authStage | [ ] |
| All animations 60fps (React Native DevTools Performance monitor) | [ ] |
| Zero JS thread animations (useAnimatedStyle only) | [ ] |
| Enrollment: 3 captures, preview shown, siteId from picker written to DB | [ ] |
| Enrollment: Liveness check runs before each capture (F4 fix) | [ ] |
| Enrollment: printed photo REJECTED | [ ] |
| AuthScreen: siteId in logAttendance() = employee.siteId (not hardcoded) | [ ] |
| Admin chart: shows real data from SQLite | [ ] |
| Admin pending count = SUCCESS records only (RULE 11) | [ ] |
| Manual sync button triggers syncAllPending and updates count | [ ] |
| Error states: human-readable messages with specific reasons | [ ] |

**Phase 5: [PASS / FAIL]**

---

## Phase 6 — Integration Test (REAL DEVICE ONLY)

| Scenario | Result | Key Metric |
|---|---|---|
| 1: Happy path | [ ] | AI=___ms Full=___s distance=___ |
| 2: Paper photo blocked at Layer 2 | [ ] | liveScore=___ printScore=___ |
| 3: Video replay blocked at Layer 2 | [ ] | liveScore=___ screenScore=___ |
| 4: GPS outside zone → camera never activates | [ ] | failReason=___ |
| 5: Wrong person → FAIL_FACE | [ ] | distance=___ (≥ threshold) |
| 6: Offline → 5 auths → WiFi on → DynamoDB synced | [ ] | siteId=real value=YES |
| RULE 11: FAIL records NOT in DynamoDB | [ ] | YES |

**Phase 6: [PASS / FAIL]**

---

## FINAL STATUS: [READY / NOT READY]

Submission date: ___
GitHub URL: ___
Model Google Drive link: ___
Device tested on: [model, Android version, RAM]
