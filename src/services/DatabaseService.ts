// src/services/DatabaseService.ts — v4.1
// DatalakeOfflineAuth — SQLite service
// RULE 11: getPendingSync MUST filter auth_result='SUCCESS'. Failed records NEVER reach AWS.
// RULE 9:  zero `any` — F2 fix: GestureType and AuthResult casts instead of `as any`

import SQLite from 'react-native-sqlite-storage';
import { AttendanceRecord, Employee, GestureType, AuthResult } from '../types';
import { AUTH_CONFIG } from '../config/constants';

SQLite.DEBUG(__DEV__);
SQLite.enablePromise(true);

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabase({ name: 'datalake.db', location: 'default' });

    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS employees (
        id            TEXT PRIMARY KEY NOT NULL,
        name          TEXT NOT NULL,
        embedding_ref TEXT NOT NULL,
        enrolled_at   TEXT NOT NULL,
        enrolled_by   TEXT NOT NULL,
        site_id       TEXT NOT NULL
      );
    `);

    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS attendance (
        id                TEXT PRIMARY KEY NOT NULL,
        employee_id       TEXT NOT NULL,
        site_id           TEXT NOT NULL,
        timestamp         TEXT NOT NULL,
        latitude          REAL NOT NULL,
        longitude         REAL NOT NULL,
        gps_accuracy      REAL NOT NULL,
        face_score        REAL NOT NULL,
        liveness_score    REAL NOT NULL,
        gesture_challenge TEXT NOT NULL,
        gesture_result    INTEGER NOT NULL,
        auth_result       TEXT NOT NULL,
        photo_path        TEXT,
        synced            INTEGER NOT NULL DEFAULT 0,
        synced_at         TEXT,
        FOREIGN KEY (employee_id) REFERENCES employees(id)
      );
    `);

    await this.db.executeSql(`CREATE INDEX IF NOT EXISTS idx_sync   ON attendance(synced);`);
    await this.db.executeSql(`CREATE INDEX IF NOT EXISTS idx_result ON attendance(auth_result);`);
    await this.db.executeSql(`CREATE INDEX IF NOT EXISTS idx_emp    ON attendance(employee_id);`);
    await this.db.executeSql(`CREATE INDEX IF NOT EXISTS idx_ts     ON attendance(timestamp);`);
    await this.db.executeSql(`CREATE INDEX IF NOT EXISTS idx_site   ON attendance(site_id);`);

    // RULE 3: Verify tables were actually created
    const [check] = await this.db.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table' AND name IN ('employees','attendance')`
    );
    if (check.rows.length !== 2) {
      throw new Error(`[DB] Init failed: only ${check.rows.length}/2 tables created`);
    }

    console.log('[DB] Initialized: employees + attendance (site_id, idx_result confirmed)');
  }

  private assertReady(): void {
    if (!this.db) throw new Error('[DB] Not initialized — call initialize() first');
  }

  async insertAttendance(record: AttendanceRecord): Promise<void> {
    this.assertReady();
    const start = Date.now();
    await this.db!.executeSql(
      `INSERT INTO attendance
       (id,employee_id,site_id,timestamp,latitude,longitude,gps_accuracy,
        face_score,liveness_score,gesture_challenge,gesture_result,
        auth_result,photo_path,synced,synced_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        record.id,
        record.employeeId,
        record.siteId,           // from Employee.siteId — never hardcoded
        record.timestamp,
        record.latitude,
        record.longitude,
        record.accuracy,
        record.faceScore,
        record.livenessScore,
        record.gestureChallenge,
        record.gestureResult ? 1 : 0,
        record.authResult,
        record.photoPath,
        record.synced,
        record.syncedAt,
      ]
    );
    const elapsed = Date.now() - start;
    console.log(`[DB] insertAttendance: ${elapsed}ms (target <30ms)`);
  }

  // RULE 11: SUCCESS filter — failed records NEVER reach AWS
  // Only records with auth_result='SUCCESS' are returned for cloud sync
  async getPendingSync(): Promise<AttendanceRecord[]> {
    this.assertReady();
    const [result] = await this.db!.executeSql(
      `SELECT * FROM attendance
       WHERE synced = 0
         AND auth_result = 'SUCCESS'
       ORDER BY timestamp ASC
       LIMIT ?`,
      [AUTH_CONFIG.SYNC_BATCH_SIZE]
    );
    const records: AttendanceRecord[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i) as Record<string, unknown>;
      records.push({
        id: row.id as string,
        employeeId: row.employee_id as string,
        siteId: row.site_id as string,
        timestamp: row.timestamp as string,
        latitude: row.latitude as number,
        longitude: row.longitude as number,
        accuracy: row.gps_accuracy as number,
        faceScore: row.face_score as number,
        livenessScore: row.liveness_score as number,
        gestureChallenge: row.gesture_challenge as GestureType,  // F2 FIX: was `as any`
        gestureResult: (row.gesture_result as number) === 1,
        authResult: row.auth_result as AuthResult,               // F2 FIX: was `as any`
        photoPath: row.photo_path as string | null,
        synced: row.synced as 0 | 1,
        syncedAt: row.synced_at as string | null,
      });
    }
    return records;
  }

  // RULE 11: Count uses same SUCCESS filter
  async getPendingCount(): Promise<number> {
    this.assertReady();
    const [r] = await this.db!.executeSql(
      `SELECT COUNT(*) as cnt FROM attendance WHERE synced=0 AND auth_result='SUCCESS'`
    );
    return (r.rows.item(0) as Record<string, unknown>).cnt as number;
  }

  async markSynced(id: string, syncedAt: string): Promise<void> {
    this.assertReady();
    await this.db!.executeSql(
      `UPDATE attendance SET synced=1, synced_at=? WHERE id=?`,
      [syncedAt, id]
    );
  }

  async clearPhotoPath(id: string): Promise<void> {
    this.assertReady();
    await this.db!.executeSql(`UPDATE attendance SET photo_path=NULL WHERE id=?`, [id]);
  }

  async insertEmployee(e: Employee): Promise<void> {
    this.assertReady();
    await this.db!.executeSql(
      `INSERT INTO employees (id,name,embedding_ref,enrolled_at,enrolled_by,site_id)
       VALUES (?,?,?,?,?,?)`,
      [e.id, e.name, e.embeddingRef, e.enrolledAt, e.enrolledBy, e.siteId]
    );
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    this.assertReady();
    const [r] = await this.db!.executeSql(`SELECT * FROM employees WHERE id=?`, [id]);
    if (r.rows.length === 0) return null;
    const row = r.rows.item(0) as Record<string, unknown>;
    return {
      id: row.id as string,
      name: row.name as string,
      embeddingRef: row.embedding_ref as string,
      enrolledAt: row.enrolled_at as string,
      enrolledBy: row.enrolled_by as string,
      siteId: row.site_id as string,
    };
  }

  async getAllEmployees(): Promise<Employee[]> {
    this.assertReady();
    const [r] = await this.db!.executeSql(`SELECT * FROM employees ORDER BY name ASC`);
    const out: Employee[] = [];
    for (let i = 0; i < r.rows.length; i++) {
      const row = r.rows.item(i) as Record<string, unknown>;
      out.push({
        id: row.id as string,
        name: row.name as string,
        embeddingRef: row.embedding_ref as string,
        enrolledAt: row.enrolled_at as string,
        enrolledBy: row.enrolled_by as string,
        siteId: row.site_id as string,
      });
    }
    return out;
  }

  async getTodayAttendance(): Promise<AttendanceRecord[]> {
    this.assertReady();
    const today = new Date().toISOString().split('T')[0];
    const [r] = await this.db!.executeSql(
      `SELECT * FROM attendance
       WHERE timestamp LIKE ? AND auth_result='SUCCESS'
       ORDER BY timestamp DESC`,
      [`${today}%`]
    );
    const out: AttendanceRecord[] = [];
    for (let i = 0; i < r.rows.length; i++) {
      const row = r.rows.item(i) as Record<string, unknown>;
      out.push({
        id: row.id as string,
        employeeId: row.employee_id as string,
        siteId: row.site_id as string,
        timestamp: row.timestamp as string,
        latitude: row.latitude as number,
        longitude: row.longitude as number,
        accuracy: row.gps_accuracy as number,
        faceScore: row.face_score as number,
        livenessScore: row.liveness_score as number,
        gestureChallenge: row.gesture_challenge as GestureType,
        gestureResult: (row.gesture_result as number) === 1,
        authResult: row.auth_result as AuthResult,
        photoPath: row.photo_path as string | null,
        synced: row.synced as 0 | 1,
        syncedAt: row.synced_at as string | null,
      });
    }
    return out;
  }
}

export const databaseService = new DatabaseService();
