// src/services/AttendanceLogger.ts — v4.1 stub
// Phase 3 implementation required
// RULE 1: siteId ALWAYS from employee.siteId — NEVER hardcoded

import { AttendanceRecord, AuthResult, GestureType } from '../types';

export interface LogParams {
  employeeId: string;
  siteId: string;          // RULE 1: passed from employee.siteId — never hardcoded
  latitude: number;
  longitude: number;
  accuracy: number;
  faceScore: number;
  livenessScore: number;
  gestureChallenge: GestureType;
  gestureResult: boolean;
  authResult: AuthResult;
  photoPath: string | null;
}

class AttendanceLogger {
  async logAttendance(_params: LogParams): Promise<AttendanceRecord> {
    // Phase 3: generate UUID, build AttendanceRecord, call databaseService.insertAttendance()
    // siteId = params.siteId (from employee.siteId — never hardcoded)
    throw new Error('[Logger] logAttendance() not yet implemented — Phase 3 task');
  }
}

export const attendanceLogger = new AttendanceLogger();
