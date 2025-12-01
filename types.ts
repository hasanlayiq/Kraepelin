

export interface UserProfile {
  number: string;
  name: string;
}

export enum AppStage {
  INTRO = 'INTRO',
  INSTRUCTION = 'INSTRUCTION',
  PRACTICE = 'PRACTICE',
  PRACTICE_RESULT = 'PRACTICE_RESULT',
  TEST = 'TEST',
  TEST_RESULT = 'TEST_RESULT',
}

export interface RowResult {
  rowIndex: number;
  totalFilled: number;
  correctCount: number;
}