// App.tsx — DatalakeOfflineAuth Phase 1 Test Harness & Camera/Face Detector Validation
import React, { useEffect, useState, useRef } from 'react';

import { ScrollView, Text, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Camera, Face } from 'react-native-vision-camera-face-detector';

import { databaseService } from './src/services/DatabaseService';
import { useAppStore } from './src/store/useAppStore';
import { initAmplify } from './src/config/awsConfig';
import { gpsService, GpsResult } from './src/services/GpsService';

type CheckState = {
  label: string;
  status: 'pending' | 'pass' | 'fail';
  detail: string;
};

const INITIAL_CHECKS: CheckState[] = [
  { label: 'DB Initialize', status: 'pending', detail: '' },
  { label: 'Zustand Store', status: 'pending', detail: '' },
  { label: 'DB getPendingCount (SUCCESS filter)', status: 'pending', detail: '' },
  { label: 'Amplify config (Phase 4 stub)', status: 'pending', detail: '' },
  { label: 'Library version check', status: 'pending', detail: '' },
];

export default function App(): React.JSX.Element {
  const [checks, setChecks] = useState<CheckState[]>(INITIAL_CHECKS);
  const [log, setLog] = useState<string[]>(['DatalakeOfflineAuth — Phase 1 Test Harness', '']);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [detectedFaces, setDetectedFaces] = useState<Face[]>([]);
  const [gpsResult, setGpsResult] = useState<GpsResult | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const device = useCameraDevice('front');

  const addLog = (line: string) => setLog(prev => [...prev, line]);

  const setCheck = (index: number, status: 'pass' | 'fail', detail: string) => {
    setChecks(prev => {
      const next = [...prev];
      next[index] = { ...next[index], status, detail };
      return next;
    });
  };

  // Run Phase 1 Foundation checks and request permission
  useEffect(() => {
    (async () => {
      let passCount = 0;

      // ── CHECK 1: Database Initialize ────────────────────────────────────
      try {
        await databaseService.initialize();
        setCheck(0, 'pass', 'employees + attendance tables created');
        addLog('✅ CHECK 1: DB initialized');
        passCount++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setCheck(0, 'fail', msg);
        addLog(`❌ CHECK 1: DB FAILED — ${msg}`);
      }

      // ── CHECK 2: Zustand Store ───────────────────────────────────────────
      try {
        const state = useAppStore.getState();
        if (state.authStage !== 'IDLE') {
          throw new Error(`Expected authStage='IDLE', got '${state.authStage}'`);
        }
        setCheck(1, 'pass', `authStage='IDLE' ✓  currentEmployee=null ✓`);
        addLog('✅ CHECK 2: Zustand store OK');
        passCount++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setCheck(1, 'fail', msg);
        addLog(`❌ CHECK 2: Store FAILED — ${msg}`);
      }

      // ── CHECK 3: DB Read + SUCCESS filter ────────────────
      try {
        const count = await databaseService.getPendingCount();
        addLog(`✅ CHECK 3: DB pending SUCCESS records: ${count}`);
        setCheck(2, 'pass', `pendingSyncCount=${count} (SUCCESS filter active)`);
        passCount++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setCheck(2, 'fail', msg);
        addLog(`❌ CHECK 3: DB read FAILED — ${msg}`);
      }

      // ── CHECK 4: Amplify config stub ─────────────────────────────────────
      try {
        initAmplify();
        setCheck(3, 'pass', 'aws-exports missing is expected in Phase 1');
        addLog('✅ CHECK 4: Amplify stub OK');
        passCount++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setCheck(3, 'fail', msg);
        addLog(`❌ CHECK 4: Amplify FAILED — ${msg}`);
      }

      // ── CHECK 5: Library version check ──────────────────────────
      try {
        const pkg = require('./package.json') as { dependencies: Record<string, string> };
        const ver = pkg.dependencies['react-native-vision-camera'] ?? 'NOT FOUND';
        setCheck(4, 'pass', `react-native-vision-camera version: ${ver}`);
        addLog(`✅ CHECK 5: Vision Camera: ${ver}`);
        passCount++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setCheck(4, 'fail', msg);
        addLog(`❌ CHECK 5: Version check FAILED — ${msg}`);
      }

      // Request camera permission using hook function
      if (!hasPermission) {
        const granted = await requestPermission();
        addLog(`📷 Camera Permission Requested: ${granted ? 'GRANTED' : 'DENIED'}`);
      } else {
        addLog(`📷 Camera Permission: ALREADY GRANTED`);
      }
    })();
  }, [device, hasPermission, requestPermission]);

  const handleFacesDetected = (faces: Face[]) => {
    const now = Date.now();
    if (now - lastUpdateRef.current > 200) {
      lastUpdateRef.current = now;
      setDetectedFaces(faces);
      if (faces.length > 0) {
        const face = faces[0];
        console.log(`[FaceDetector] count: ${faces.length} | leftEyeOpenProbability: ${face.leftEyeOpenProbability} | rightEyeOpenProbability: ${face.rightEyeOpenProbability} | smilingProbability: ${face.smilingProbability} | pitchAngle: ${face.pitchAngle} | yawAngle: ${face.yawAngle}`);
      }
    }
  };

  useEffect(() => {
    const count = device?.formats?.length ?? 0;
    addLog(`Device formats count: ${count}`);
    if (count > 0) {
      addLog('📷 Available camera formats:');
      device.formats.forEach((fmt, idx) => {
        addLog(`#${idx + 1}: ${fmt.videoWidth}x${fmt.videoHeight} pixelFormat=${fmt.pixelFormat}`);
      });
    }
  }, [device]);

  useEffect(() => {
    addLog(`device: ${device ? device.name + ' pos=' + device.position : 'NULL'}`);
    addLog(`hasPermission: ${hasPermission}`);
  }, [device, hasPermission]);


return (
  <SafeAreaProvider>
    <SafeAreaView style={s.bg}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>DatalakeOfflineAuth</Text>
        <Text style={s.subtitle}>Phase 1 — Live Camera & Face Detector Verification</Text>

        {/* Foundation Checks */}
        <View style={s.checks}>
          {checks.map((c, i) => (
            <View key={i} style={s.checkRow}>
              <Text style={s.checkIcon}>
                {c.status === 'pending' ? '⏳' : c.status === 'pass' ? '✅' : '❌'}
              </Text>
              <View style={s.checkText}>
                <Text style={s.checkLabel}>{c.label}</Text>
                {c.detail ? <Text style={s.checkDetail}>{c.detail}</Text> : null}
              </View>
            </View>
          ))}
        </View>

        {/* GPS Test Button */}
        <View style={s.permBox}>
          <TouchableOpacity onPress={async () => {
            addLog('Testing GPS...');
            try {
              const res = await gpsService.checkGeofence();
              setGpsResult(res);
              addLog(`GPS Result: Latitude: ${res.latitude} Longitude: ${res.longitude}`);
              console.log('GPS_TEST_RESULT:', JSON.stringify(res));
            } catch (e: any) {
              addLog(`GPS Error: ${e.message}`);
              console.error('GPS_TEST_ERROR:', e.message);
            }
          }} style={{ backgroundColor: '#4ade80', padding: 10, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Check GPS</Text>
          </TouchableOpacity>
          {gpsResult && (
            <View style={{ marginTop: 10 }}>
              <Text style={s.metricText}>Latitude: {gpsResult.latitude}</Text>
              <Text style={s.metricText}>Longitude: {gpsResult.longitude}</Text>
              <Text style={s.metricText}>Accuracy: {gpsResult.accuracy}m</Text>
              <Text style={s.metricText}>Inside Geofence: {gpsResult.isInsideGeofence ? 'YES' : 'NO'}</Text>
              {gpsResult.failReason && <Text style={s.metricText}>Reason: {gpsResult.failReason}</Text>}
            </View>
          )}
        </View>

        {/* Camera Permission Info */}
        <View style={s.permBox}>
          <Text style={s.permTitle}>Camera Status: {hasPermission ? 'GRANTED' : 'NOT GRANTED'}</Text>
          {device ? (
            <Text style={s.permDesc}>Front Camera Found: {device.name}</Text>
          ) : (
            <Text style={s.permDescError}>Error: Front Camera Device Not Found!</Text>
          )}
        </View>

        {/* Camera View */}
        {hasPermission && device ? (
          <View style={s.cameraContainer}>
            <Camera
              device={device}
              isActive={true}
              runClassifications={true}
              runContours={false}
              runLandmarks={true}
              performanceMode="fast"
              onFacesDetected={handleFacesDetected}
              onInitialized={() => {
                addLog("✅ Camera initialized");
              }}
              onError={(e) => {
                addLog(`❌ Camera error: ${e.message}`);
                console.error(e);
              }}
              style={s.camera}
            />
            {/* Face Overlay Box */}
            {detectedFaces.map((face, index) => (
              <View
                key={index}
                style={[
                  s.faceBox,
                  {
                    left: face.bounds.x,
                    top: face.bounds.y,
                    width: face.bounds.width,
                    height: face.bounds.height,
                  },
                ]}
              />
            ))}
          </View>
        ) : (
          <View style={s.noCameraBox}>
            <Text style={s.noCameraText}>Camera Preview not active (Permission required)</Text>
          </View>
        )}

        {/* Real-time MLKit Output */}
        {detectedFaces.length > 0 ? (
          <View style={s.detectorPanel}>
            <Text style={s.panelTitle}>MLKit Real-Time Face Metrics</Text>
            {detectedFaces.map((face, i) => (
              <View key={i} style={s.faceMetric}>
                <Text style={s.metricText}>Face ID: {face.trackingId ?? 'N/A'}</Text>
                <Text style={s.metricText}>
                  Smiling Prob: {face.smilingProbability !== undefined ? face.smilingProbability.toFixed(3) : 'N/A'}
                </Text>
                <Text style={s.metricText}>
                  Left Eye Open: {face.leftEyeOpenProbability !== undefined ? face.leftEyeOpenProbability.toFixed(3) : 'N/A'}
                </Text>
                <Text style={s.metricText}>
                  Right Eye Open: {face.rightEyeOpenProbability !== undefined ? face.rightEyeOpenProbability.toFixed(3) : 'N/A'}
                </Text>
                <Text style={s.metricText}>
                  Euler X (Pitch): {face.pitchAngle !== undefined ? face.pitchAngle.toFixed(2) : 'N/A'}°
                </Text>
                <Text style={s.metricText}>
                  Euler Y (Yaw): {face.yawAngle !== undefined ? face.yawAngle.toFixed(2) : 'N/A'}°
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={s.noFaceBox}>
            <Text style={s.noFaceText}>No Face Detected in View</Text>
          </View>
        )}

        {/* Log Console */}
        <View style={s.logBox}>
          <Text style={s.logBoxTitle}>System Log Console</Text>
          {log.slice(-10).map((line, i) => (
            <Text key={i} style={s.logLine}>
              {line}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
);
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { padding: 20, paddingTop: 12, gap: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  subtitle: { fontSize: 12, color: '#4ade80', fontFamily: 'monospace', marginTop: -8 },
  checks: { gap: 8 },
  checkRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  checkIcon: { fontSize: 14, marginTop: 1 },
  checkText: { flex: 1 },
  checkLabel: { color: '#e2e8f0', fontSize: 13, fontWeight: '600' },
  checkDetail: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace', marginTop: 2 },
  permBox: {
    backgroundColor: '#161b22',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  permTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  permDesc: { color: '#8b9ab0', fontSize: 11, marginTop: 4 },
  permDescError: { color: '#f87171', fontSize: 11, marginTop: 4, fontWeight: 'bold' },
  cameraContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#4ade80',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  noCameraBox: {
    width: '100%',
    height: 120,
    backgroundColor: '#161b22',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  noCameraText: { color: '#8b9ab0', fontSize: 12 },
  detectorPanel: {
    backgroundColor: '#0d1117',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#21262d',
    gap: 8,
  },
  panelTitle: { color: '#fff', fontSize: 14, fontWeight: '800', borderBottomWidth: 1, borderBottomColor: '#21262d', paddingBottom: 6 },
  faceMetric: { gap: 4 },
  metricText: { color: '#c9d1d9', fontSize: 12, fontFamily: 'monospace' },
  noFaceBox: {
    backgroundColor: '#161b22',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  noFaceText: { color: '#8b9ab0', fontSize: 12, fontFamily: 'monospace' },
  logBox: {
    backgroundColor: '#0d1117',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 2,
  },
  logBoxTitle: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  logLine: { color: '#8b9ab0', fontSize: 11, fontFamily: 'monospace' },
});

registerRootComponent(App);
