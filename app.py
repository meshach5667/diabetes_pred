import streamlit as st
import numpy as np
import joblib
import plotly.graph_objects as go
from dataclasses import dataclass
from pathlib import Path


@dataclass
class AppConfig:
    PAGE_TITLE: str = "Diabetes Prediction"
    PAGE_ICON: str = ":material/cardiology:"
    MODEL_PATH: str = "diabetes_model_v2.pkl"
    SCALER_PATH: str = "scaler_rf_v2.pkl"
    FEATURE_RANGES: dict = None
    
    def __post_init__(self):
        self.FEATURE_RANGES = {
            'pregnancies': {'min': 0, 'max': 20, 'default': 0, 'step': 1},
            'glucose': {'min': 0, 'max': 200, 'default': 120, 'step': 1},
            'blood_pressure': {'min': 0, 'max': 130, 'default': 70, 'step': 1},
            'skin_thickness': {'min': 0, 'max': 100, 'default': 20, 'step': 1},
            'insulin': {'min': 0, 'max': 900, 'default': 80, 'step': 1},
            'bmi': {'min': 10.0, 'max': 70.0, 'default': 25.0, 'step': 0.1},
            'dpf': {'min': 0.0, 'max': 2.5, 'default': 0.5, 'step': 0.01},
            'age': {'min': 1, 'max': 100, 'default': 30, 'step': 1},
        }

    LOW_RISK_THRESHOLD: float = 30.0
    HIGH_RISK_THRESHOLD: float = 70.0


config = AppConfig()


@dataclass
class PatientData:
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree_function: float
    age: int
    
    def to_array(self) -> np.ndarray:
        return np.array([[
            self.pregnancies, self.glucose, self.blood_pressure,
            self.skin_thickness, self.insulin, self.bmi,
            self.diabetes_pedigree_function, self.age
        ]])
@dataclass
class PredictionResult:
    prediction: int
    probability_negative: float
    probability_positive: float
    
    @property
    def is_diabetic(self) -> bool:
        return self.prediction == 1
    
    @property
    def risk_level(self) -> str:
        if self.probability_positive < config.LOW_RISK_THRESHOLD:
            return "LOW"
        elif self.probability_positive > config.HIGH_RISK_THRESHOLD:
            return "HIGH"
        return "MODERATE"


class ModelManager:
    def __init__(self, model_path: str, scaler_path: str):
        self.model_path = Path(model_path)
        self.scaler_path = Path(scaler_path)
        self.model = None
        self.scaler = None
    
    def load(self) -> bool:
        try:
            if not self.model_path.exists() or not self.scaler_path.exists():
                return False
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            return True
        except Exception as e:
            st.error(f"Error loading model: {str(e)}")
            return False
    
    def predict(self, patient_data: PatientData):
        if self.model is None or self.scaler is None:
            return None
        
        try:
            # Prepare and scale input
            input_array = patient_data.to_array()
            input_scaled = self.scaler.transform(input_array)
            
            # Get prediction and probabilities
            prediction = self.model.predict(input_scaled)[0]
            
            try:
                probabilities = self.model.predict_proba(input_scaled)[0]
                prob_negative = probabilities[0] * 100
                prob_positive = probabilities[1] * 100
            except AttributeError:
                # Model doesn't support probability
                prob_positive = 100.0 if prediction == 1 else 0.0
                prob_negative = 100.0 - prob_positive
            
            return PredictionResult(
                prediction=int(prediction),
                probability_negative=prob_negative,
                probability_positive=prob_positive
            )
        except Exception as e:
            st.error(f"Prediction error: {str(e)}")
            return None


@st.cache_resource
def get_model_manager() -> ModelManager:
    manager = ModelManager(config.MODEL_PATH, config.SCALER_PATH)
    manager.load()
    return manager


def setup_page():
    st.set_page_config(
        page_title=config.PAGE_TITLE,
        page_icon=config.PAGE_ICON,
        layout="wide"
    )
    st.markdown("""
        <style>
        .main {padding: 0rem 1rem;}
        .stAlert {padding: 1rem; border-radius: 0.5rem;}
        h1 {color: #1f77b4; padding-bottom: 1rem;}
        </style>
    """, unsafe_allow_html=True)


def render_header():
    st.title("Diabetes Prediction System")

    st.markdown("---")


def render_sidebar_inputs() -> PatientData:
    st.sidebar.title("Patient Information")
    
    st.sidebar.subheader("Demographics")
    gender = st.sidebar.selectbox(
        'Gender',
        options=['Female', 'Male']
    )
    age = st.sidebar.slider(
        'Age (years)', 
        min_value=config.FEATURE_RANGES['age']['min'],
        max_value=config.FEATURE_RANGES['age']['max'],
        value=config.FEATURE_RANGES['age']['default']
    )
    if gender == 'Female':
        pregnancies = st.sidebar.number_input(
            'Number of Pregnancies', 
            min_value=config.FEATURE_RANGES['pregnancies']['min'],
            max_value=config.FEATURE_RANGES['pregnancies']['max'],
            value=config.FEATURE_RANGES['pregnancies']['default']
        )
    else:
        pregnancies = 0
    
    st.sidebar.subheader("Medical Measurements")
    glucose = st.sidebar.slider(
        'Glucose Level (mg/dL)',
        min_value=config.FEATURE_RANGES['glucose']['min'],
        max_value=config.FEATURE_RANGES['glucose']['max'],
        value=config.FEATURE_RANGES['glucose']['default']
    )
    blood_pressure = st.sidebar.slider(
        'Blood Pressure (mm Hg)',
        min_value=config.FEATURE_RANGES['blood_pressure']['min'],
        max_value=config.FEATURE_RANGES['blood_pressure']['max'],
        value=config.FEATURE_RANGES['blood_pressure']['default']
    )
    skin_thickness = st.sidebar.slider(
        'Skin Thickness (mm)',
        min_value=config.FEATURE_RANGES['skin_thickness']['min'],
        max_value=config.FEATURE_RANGES['skin_thickness']['max'],
        value=config.FEATURE_RANGES['skin_thickness']['default']
    )
    insulin = st.sidebar.slider(
        'Insulin Level (uU/mL)',
        min_value=config.FEATURE_RANGES['insulin']['min'],
        max_value=config.FEATURE_RANGES['insulin']['max'],
        value=config.FEATURE_RANGES['insulin']['default']
    )
    bmi = st.sidebar.number_input(
        'BMI (kg/m2)',
        min_value=config.FEATURE_RANGES['bmi']['min'],
        max_value=config.FEATURE_RANGES['bmi']['max'],
        value=config.FEATURE_RANGES['bmi']['default'],
        step=config.FEATURE_RANGES['bmi']['step']
    )
    dpf = st.sidebar.slider(
        'Diabetes Pedigree Function',
        min_value=config.FEATURE_RANGES['dpf']['min'],
        max_value=config.FEATURE_RANGES['dpf']['max'],
        value=config.FEATURE_RANGES['dpf']['default'],
        step=config.FEATURE_RANGES['dpf']['step']
    )
    
    return PatientData(
        pregnancies=pregnancies, glucose=glucose, blood_pressure=blood_pressure,
        skin_thickness=skin_thickness, insulin=insulin, bmi=bmi,
        diabetes_pedigree_function=dpf, age=age
    )


def render_risk_gauge(probability: float) -> go.Figure:
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=probability,
        title={'text': "Risk Level", 'font': {'size': 20}},
        number={'suffix': "%", 'font': {'size': 36}},
        gauge={
            'axis': {'range': [0, 100], 'tickwidth': 1},
            'bar': {'color': "darkblue"},
            'bgcolor': "white",
            'borderwidth': 2,
            'bordercolor': "gray",
            'steps': [
                {'range': [0, 30], 'color': '#2ecc71'},    # Green - Low risk
                {'range': [30, 70], 'color': '#f1c40f'},   # Yellow - Moderate
                {'range': [70, 100], 'color': '#e74c3c'}   # Red - High risk
            ],
            'threshold': {
                'line': {'color': "black", 'width': 4},
                'thickness': 0.75,
                'value': 50
            }
        }
    ))
    fig.update_layout(
        height=300,
        margin=dict(l=20, r=20, t=60, b=20),
        paper_bgcolor="rgba(0,0,0,0)",
        font={'color': "black"}
    )
    return fig


def analyze_risk_factors(patient_data: PatientData):
    risk_factors = []
    positive_factors = []
    
    if patient_data.glucose > 125:
        risk_factors.append("High Glucose Level (>125 mg/dL) - Indicates potential diabetes")
    elif patient_data.glucose < 100:
        positive_factors.append("Normal Glucose Level (<100 mg/dL)")
    
    if patient_data.bmi >= 30:
        risk_factors.append("Obesity (BMI >= 30) - Significantly increases diabetes risk")
    elif patient_data.bmi >= 25:
        risk_factors.append("Overweight (BMI 25-29.9) - Moderate risk factor")
    elif 18.5 <= patient_data.bmi <= 24.9:
        positive_factors.append("Healthy BMI (18.5-24.9 kg/m2)")
    
    if patient_data.age >= 45:
        risk_factors.append("Age Factor (>= 45 years) - Increased risk with age")
    
    if patient_data.blood_pressure > 80:
        risk_factors.append("Elevated Blood Pressure (>80 mm Hg)")
    elif 60 <= patient_data.blood_pressure <= 80:
        positive_factors.append("Normal Blood Pressure (60-80 mm Hg)")
    
    if patient_data.diabetes_pedigree_function > 0.5:
        risk_factors.append("Genetic Predisposition (DPF >0.5) - Family history indicates higher risk")
    
    if patient_data.insulin > 200:
        risk_factors.append("Elevated Insulin (>200 uU/mL) - May indicate insulin resistance")
    
    return risk_factors, positive_factors


def render_prediction_results(result: PredictionResult, patient_data: PatientData):
    st.markdown("---")
    st.header("Prediction Results")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        if not result.is_diabetic:
            if result.risk_level == "LOW":
                st.success("LOW RISK - Not Diabetic", icon=":material/check_circle:")
                st.info("The model predicts a low probability of diabetes based on the provided health metrics.")
            else:
                st.warning("MODERATE RISK - Not Diabetic", icon=":material/warning:")
                st.info("While the prediction is negative, some risk factors are present.")
        else:
            if result.risk_level == "HIGH":
                st.error("HIGH RISK - Diabetic", icon=":material/error:")
                st.warning("The model indicates a high probability of diabetes. Medical consultation is recommended.")
            else:
                st.warning("MODERATE RISK - Diabetic", icon=":material/warning:")
                st.info("The model suggests diabetes risk. Please consult a healthcare professional.")
        
        st.subheader("Probability Breakdown")
        prob_col1, prob_col2 = st.columns(2)
        prob_col1.metric("Non-Diabetic Probability", f"{result.probability_negative:.1f}%")
        prob_col2.metric("Diabetic Probability", f"{result.probability_positive:.1f}%")
    
    with col2:
        fig = render_risk_gauge(result.probability_positive)
        st.plotly_chart(fig, use_container_width=True)
    
    render_risk_analysis(patient_data)
    render_recommendations(result)


def render_risk_analysis(patient_data: PatientData):
    st.markdown("---")
    st.subheader("Risk Factor Analysis")
    
    risk_factors, positive_factors = analyze_risk_factors(patient_data)
    
    col1, col2 = st.columns(2)
    
    with col1:
        if risk_factors:
            st.warning("**Identified Risk Factors:**", icon=":material/warning:")
            for factor in risk_factors:
                st.markdown(f"- {factor}")
        else:
            st.success("No significant risk factors identified!", icon=":material/check_circle:")
    
    with col2:
        if positive_factors:
            st.success("**Positive Health Indicators:**", icon=":material/thumb_up:")
            for factor in positive_factors:
                st.markdown(f"- {factor}")


def render_recommendations(result: PredictionResult):
    st.markdown("---")
    st.subheader("Health Recommendations")
    
    if result.is_diabetic:
        st.error("**Immediate Actions Recommended:**", icon=":material/medical_services:")
        st.markdown("""
        1. **Consult a healthcare professional** - Schedule an appointment for comprehensive diabetes screening
        2. **Regular monitoring** - Check blood glucose levels regularly
        3. **Dietary changes** - Consider a low-glycemic, balanced diet
        4. **Physical activity** - Aim for at least 150 minutes of moderate exercise per week
        5. **Medication review** - Discuss potential treatments with your doctor
        """)
    else:
        st.success("**Maintain Your Health:**", icon=":material/favorite:")
        st.markdown("""
        1. **Regular check-ups** - Annual health screenings recommended
        2. **Balanced nutrition** - Maintain a healthy diet rich in vegetables and whole grains
        3. **Stay active** - Regular exercise (30+ minutes daily)
        4. **Healthy weight** - Monitor and maintain optimal BMI
        5. **Quality sleep** - Aim for 7-9 hours of sleep per night
        """)


def render_landing_page():
    st.info("Enter patient information in the sidebar and click 'Predict' to get started", icon=":material/arrow_back:")
    

def main():
    setup_page()
    render_header()
    
    model_manager = get_model_manager()
    
    if model_manager.model is None or model_manager.scaler is None:

        return
    
    patient_data = render_sidebar_inputs()
    
    st.sidebar.markdown("---")
    predict_clicked = st.sidebar.button(
        "Predict Diabetes Risk",
        type="primary",
        use_container_width=True,
        icon=":material/query_stats:"
    )
    
    if predict_clicked:
        with st.spinner("Analyzing health data..."):
            result = model_manager.predict(patient_data)
            if result:
                render_prediction_results(result, patient_data)
            else:
                st.error("Failed to generate prediction. Please try again.")
    else:
        render_landing_page()
    

    


if __name__ == "__main__":
    main()
