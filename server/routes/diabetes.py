from fastapi import APIRouter, HTTPException, status
from ..schemas.diabetes import PatientInput, PredictionOutput
from ..services.prediction_service import PredictionService

router = APIRouter(tags=["Diabetes Prediction"])

# Initialize prediction service
try:
    prediction_service = PredictionService()
except Exception as e:
    print(f"Warning: Failed to initialize prediction service: {e}")
    prediction_service = None


@router.get("/health", response_model=dict)
async def health_check():
    """Check if the prediction service is healthy"""
    if prediction_service is None or prediction_service.model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction service is not available. Models not loaded."
        )
    return {
        "status": "healthy",
        "service": "diabetes-prediction",
        "models_loaded": True
    }


@router.post("/predict", response_model=PredictionOutput, status_code=status.HTTP_200_OK)
async def predict_diabetes(patient_data: PatientInput):
    """
    Predict diabetes risk for a patient based on health metrics
    
    - **pregnancies**: Number of pregnancies (0-20)
    - **glucose**: Glucose level in mg/dL (0-200)
    - **blood_pressure**: Blood pressure in mm Hg (0-130)
    - **skin_thickness**: Skin thickness in mm (0-100)
    - **insulin**: Insulin level in uU/mL (0-900)
    - **bmi**: Body Mass Index in kg/m² (10-70)
    - **diabetes_pedigree_function**: Diabetes Pedigree Function (0-2.5)
    - **age**: Age in years (1-100)
    
    Returns prediction with probabilities and risk level.
    """
    if prediction_service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction service is not available"
        )
    
    try:
        result = prediction_service.predict(patient_data)
        return result
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )


@router.get("/info", response_model=dict)
async def get_model_info():
    """Get information about the model and expected input ranges"""
    return {
        "model": "Random Forest Classifier (v2)",
        "features": [
            {"name": "pregnancies", "min": 0, "max": 20, "unit": "count"},
            {"name": "glucose", "min": 0, "max": 200, "unit": "mg/dL"},
            {"name": "blood_pressure", "min": 0, "max": 130, "unit": "mm Hg"},
            {"name": "skin_thickness", "min": 0, "max": 100, "unit": "mm"},
            {"name": "insulin", "min": 0, "max": 900, "unit": "uU/mL"},
            {"name": "bmi", "min": 10.0, "max": 70.0, "unit": "kg/m²"},
            {"name": "diabetes_pedigree_function", "min": 0.0, "max": 2.5, "unit": "ratio"},
            {"name": "age", "min": 1, "max": 100, "unit": "years"}
        ],
        "risk_levels": {
            "LOW": "< 30% probability",
            "MODERATE": "30-70% probability",
            "HIGH": "> 70% probability"
        }
    }
