from pydantic import BaseModel, Field
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"


class PatientInput(BaseModel):
    pregnancies: int = Field(ge=0, le=20, description="Number of pregnancies")
    glucose: float = Field(ge=0, le=200, description="Glucose level (mg/dL)")
    blood_pressure: float = Field(ge=0, le=130, description="Blood pressure (mm Hg)")
    skin_thickness: float = Field(ge=0, le=100, description="Skin thickness (mm)")
    insulin: float = Field(ge=0, le=900, description="Insulin level (uU/mL)")
    bmi: float = Field(ge=10.0, le=70.0, description="Body Mass Index (kg/m²)")
    diabetes_pedigree_function: float = Field(ge=0.0, le=2.5, description="Diabetes Pedigree Function")
    age: int = Field(ge=1, le=100, description="Age (years)")

    class Config:
        json_schema_extra = {
            "example": {
                "pregnancies": 2,
                "glucose": 120,
                "blood_pressure": 70,
                "skin_thickness": 20,
                "insulin": 80,
                "bmi": 25.0,
                "diabetes_pedigree_function": 0.5,
                "age": 30
            }
        }


class PredictionOutput(BaseModel):
    prediction: int = Field(description="0 = Non-Diabetic, 1 = Diabetic")
    is_diabetic: bool = Field(description="Whether the patient is predicted to be diabetic")
    probability_negative: float = Field(description="Probability of not having diabetes (%)")
    probability_positive: float = Field(description="Probability of having diabetes (%)")
    risk_level: RiskLevel = Field(description="Risk level: LOW, MODERATE, or HIGH")
    message: str = Field(description="Human-readable prediction message")

    class Config:
        json_schema_extra = {
            "example": {
                "prediction": 0,
                "is_diabetic": False,
                "probability_negative": 85.5,
                "probability_positive": 14.5,
                "risk_level": "LOW",
                "message": "Low risk - Patient is not predicted to be diabetic"
            }
        }
