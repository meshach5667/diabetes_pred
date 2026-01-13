export interface PatientData {
  gender: 'male' | 'female';
  age: number;
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
}

export interface PredictionResult {
  prediction: 0 | 1;
  probabilityNegative: number;
  probabilityPositive: number;
  isDiabetic: boolean;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface RiskFactor {
  type: 'risk' | 'positive';
  message: string;
  severity?: 'low' | 'moderate' | 'high';
}

export const DEFAULT_PATIENT_DATA: PatientData = {
  gender: 'female',
  age: 30,
  pregnancies: 0,
  glucose: 120,
  bloodPressure: 70,
  skinThickness: 20,
  insulin: 80,
  bmi: 25.0,
  diabetesPedigreeFunction: 0.5,
};

export const FEATURE_RANGES = {
  pregnancies: { min: 0, max: 20, step: 1 },
  glucose: { min: 0, max: 200, step: 1 },
  bloodPressure: { min: 0, max: 130, step: 1 },
  skinThickness: { min: 0, max: 100, step: 1 },
  insulin: { min: 0, max: 900, step: 1 },
  bmi: { min: 10, max: 70, step: 0.1 },
  diabetesPedigreeFunction: { min: 0, max: 2.5, step: 0.01 },
  age: { min: 1, max: 100, step: 1 },
};
