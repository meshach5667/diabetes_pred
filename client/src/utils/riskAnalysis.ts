import { PatientData, RiskFactor } from '@/types/patient';

export function analyzeRiskFactors(patientData: PatientData): {
  riskFactors: RiskFactor[];
  positiveFactors: RiskFactor[];
} {
  const riskFactors: RiskFactor[] = [];
  const positiveFactors: RiskFactor[] = [];

  // Glucose analysis
  if (patientData.glucose > 125) {
    riskFactors.push({
      type: 'risk',
      message: 'High Glucose Level (>125 mg/dL) - Indicates potential diabetes',
      severity: 'high',
    });
  } else if (patientData.glucose < 100) {
    positiveFactors.push({
      type: 'positive',
      message: 'Normal Glucose Level (<100 mg/dL)',
    });
  }

  // BMI analysis
  if (patientData.bmi >= 30) {
    riskFactors.push({
      type: 'risk',
      message: 'Obesity (BMI >= 30) - Significantly increases diabetes risk',
      severity: 'high',
    });
  } else if (patientData.bmi >= 25) {
    riskFactors.push({
      type: 'risk',
      message: 'Overweight (BMI 25-29.9) - Moderate risk factor',
      severity: 'moderate',
    });
  } else if (patientData.bmi >= 18.5 && patientData.bmi <= 24.9) {
    positiveFactors.push({
      type: 'positive',
      message: 'Healthy BMI (18.5-24.9 kg/m²)',
    });
  }

  // Age analysis
  if (patientData.age >= 45) {
    riskFactors.push({
      type: 'risk',
      message: 'Age Factor (>= 45 years) - Increased risk with age',
      severity: 'moderate',
    });
  }

  // Blood pressure analysis
  if (patientData.bloodPressure > 80) {
    riskFactors.push({
      type: 'risk',
      message: 'Elevated Blood Pressure (>80 mm Hg)',
      severity: 'moderate',
    });
  } else if (patientData.bloodPressure >= 60 && patientData.bloodPressure <= 80) {
    positiveFactors.push({
      type: 'positive',
      message: 'Normal Blood Pressure (60-80 mm Hg)',
    });
  }

  // Diabetes Pedigree Function
  if (patientData.diabetesPedigreeFunction > 0.5) {
    riskFactors.push({
      type: 'risk',
      message: 'Genetic Predisposition (DPF >0.5) - Family history indicates higher risk',
      severity: 'high',
    });
  }

  // Insulin analysis
  if (patientData.insulin > 200) {
    riskFactors.push({
      type: 'risk',
      message: 'Elevated Insulin (>200 uU/mL) - May indicate insulin resistance',
      severity: 'moderate',
    });
  }

  return { riskFactors, positiveFactors };
}

export function calculateMockPrediction(patientData: PatientData): {
  probabilityPositive: number;
  probabilityNegative: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  isDiabetic: boolean;
} {
  // Mock calculation based on risk factors (replace with actual API call)
  let riskScore = 0;

  if (patientData.glucose > 125) riskScore += 25;
  else if (patientData.glucose > 100) riskScore += 10;

  if (patientData.bmi >= 30) riskScore += 20;
  else if (patientData.bmi >= 25) riskScore += 10;

  if (patientData.age >= 45) riskScore += 15;
  else if (patientData.age >= 35) riskScore += 5;

  if (patientData.bloodPressure > 80) riskScore += 10;

  if (patientData.diabetesPedigreeFunction > 0.5) riskScore += 15;

  if (patientData.insulin > 200) riskScore += 10;

  // Normalize to percentage
  const probabilityPositive = Math.min(Math.max(riskScore, 5), 95);
  const probabilityNegative = 100 - probabilityPositive;

  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  if (probabilityPositive < 30) {
    riskLevel = 'LOW';
  } else if (probabilityPositive > 70) {
    riskLevel = 'HIGH';
  } else {
    riskLevel = 'MODERATE';
  }

  return {
    probabilityPositive,
    probabilityNegative,
    riskLevel,
    isDiabetic: probabilityPositive >= 50,
  };
}
