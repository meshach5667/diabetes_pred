import joblib
import numpy as np
from pathlib import Path
from typing import Optional
from ..schemas.diabetes import PatientInput, PredictionOutput, RiskLevel


class PredictionService:
    """Service for loading ML models and making diabetes predictions"""
    
    LOW_RISK_THRESHOLD = 30.0
    HIGH_RISK_THRESHOLD = 70.0
    
    def __init__(self, model_path: str = "aiModels/diabetes_model_v2.pkl", 
                 scaler_path: str = "aiModels/scaler_rf_v2.pkl"):
        self.model_path = Path(__file__).parent.parent / model_path
        self.scaler_path = Path(__file__).parent.parent / scaler_path
        self.model = None
        self.scaler = None
        self._load_models()
    
    def _load_models(self) -> None:
        """Load the trained model and scaler"""
        try:
            if not self.model_path.exists():
                raise FileNotFoundError(f"Model file not found: {self.model_path}")
            if not self.scaler_path.exists():
                raise FileNotFoundError(f"Scaler file not found: {self.scaler_path}")
            
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            print(f"✓ Model loaded from {self.model_path}")
            print(f"✓ Scaler loaded from {self.scaler_path}")
        except Exception as e:
            print(f"✗ Error loading models: {e}")
            raise
    
    def _prepare_input(self, patient_data: PatientInput) -> np.ndarray:
        """Convert patient data to model input format"""
        return np.array([[
            patient_data.pregnancies,
            patient_data.glucose,
            patient_data.blood_pressure,
            patient_data.skin_thickness,
            patient_data.insulin,
            patient_data.bmi,
            patient_data.diabetes_pedigree_function,
            patient_data.age
        ]])
    
    def _determine_risk_level(self, probability_positive: float) -> RiskLevel:
        """Determine risk level based on positive probability"""
        if probability_positive < self.LOW_RISK_THRESHOLD:
            return RiskLevel.LOW
        elif probability_positive > self.HIGH_RISK_THRESHOLD:
            return RiskLevel.HIGH
        return RiskLevel.MODERATE
    
    def _generate_message(self, is_diabetic: bool, risk_level: RiskLevel) -> str:
        """Generate human-readable prediction message"""
        if not is_diabetic:
            if risk_level == RiskLevel.LOW:
                return "Low risk - Patient is not predicted to be diabetic"
            else:
                return "Moderate risk - Patient is not predicted to be diabetic, but some risk factors present"
        else:
            if risk_level == RiskLevel.HIGH:
                return "High risk - Patient is predicted to be diabetic. Medical consultation recommended"
            else:
                return "Moderate to high risk - Patient is predicted to be diabetic. Please consult a healthcare professional"
    
    def predict(self, patient_data: PatientInput) -> PredictionOutput:
        """Make a prediction for given patient data"""
        if self.model is None or self.scaler is None:
            raise RuntimeError("Models not loaded properly")
        
        try:
            # Prepare and scale input
            input_array = self._prepare_input(patient_data)
            input_scaled = self.scaler.transform(input_array)
            
            # Get prediction
            prediction = int(self.model.predict(input_scaled)[0])
            
            # Get probabilities
            try:
                probabilities = self.model.predict_proba(input_scaled)[0]
                prob_negative = float(probabilities[0] * 100)
                prob_positive = float(probabilities[1] * 100)
            except AttributeError:
                # Model doesn't support probability
                prob_positive = 100.0 if prediction == 1 else 0.0
                prob_negative = 100.0 - prob_positive
            
            # Determine risk level
            risk_level = self._determine_risk_level(prob_positive)
            is_diabetic = prediction == 1
            
            # Generate message
            message = self._generate_message(is_diabetic, risk_level)
            
            return PredictionOutput(
                prediction=prediction,
                is_diabetic=is_diabetic,
                probability_negative=prob_negative,
                probability_positive=prob_positive,
                risk_level=risk_level,
                message=message
            )
        except Exception as e:
            raise RuntimeError(f"Prediction error: {str(e)}")
