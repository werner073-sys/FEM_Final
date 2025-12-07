
export enum AppMode {
  CYCLE = 'CYCLE',
  PREGNANCY = 'PREGNANCY'
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  SAGE = 'SAGE',
  PARTNER = 'PARTNER',
  PROFILE = 'PROFILE',
  SAFETY = 'SAFETY'
}

export interface Symptom {
  id: string;
  name: string;
  icon: string; // Emoji or icon name
  intensity: number; // 1-5
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface DailyInsight {
  hormones: string;
  advice: string;
  mood: string;
}

export interface CyclePhase {
  name: string;
  color: string;
  startDay: number;
  endDay: number;
}

// Safety & Compliance Types
export interface EmergencyContact {
  name: string;
  number: string;
  relation: string;
}

export type SafetyStatus = 'IDLE' | 'TRACKING' | 'SOS_COUNTDOWN' | 'SOS_ACTIVE';
