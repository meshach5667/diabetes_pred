import { PatientData } from '@/types/patient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiPredictionResult {
  prediction: number;
  is_diabetic: boolean;
  probability_negative: number;
  probability_positive: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH';
  message: string;
}

export interface ApiPatientInput {
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
}

// Transform frontend PatientData to API format (snake_case)
function transformToApiFormat(data: PatientData): ApiPatientInput {
  return {
    pregnancies: data.gender === 'male' ? 0 : data.pregnancies,
    glucose: data.glucose,
    blood_pressure: data.bloodPressure,
    skin_thickness: data.skinThickness,
    insulin: data.insulin,
    bmi: data.bmi,
    diabetes_pedigree_function: data.diabetesPedigreeFunction,
    age: data.age,
  };
}

// Transform API response to frontend format (camelCase)
function transformFromApiFormat(apiResult: ApiPredictionResult) {
  return {
    prediction: apiResult.prediction as 0 | 1,
    probabilityNegative: apiResult.probability_negative,
    probabilityPositive: apiResult.probability_positive,
    isDiabetic: apiResult.is_diabetic,
    riskLevel: apiResult.risk_level,
    message: apiResult.message,
  };
}

export async function predictDiabetes(patientData: PatientData) {
  const apiInput = transformToApiFormat(patientData);
  
  const response = await fetch(`${API_BASE_URL}/api/diabetes/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiInput),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }

  const apiResult: ApiPredictionResult = await response.json();
  return transformFromApiFormat(apiResult);
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diabetes/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function getModelInfo() {
  const response = await fetch(`${API_BASE_URL}/api/diabetes/info`);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}
