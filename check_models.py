import joblib
import os

print('Files in directory:')
for f in os.listdir('.'):
    if f.endswith('.pkl'):
        print(f'  {f}')

print()
try:
    model = joblib.load('diabetes_model.pkl')
    print(f'diabetes_model.pkl loaded: {type(model).__name__}')
except Exception as e:
    print(f'diabetes_model.pkl error: {e}')

try:
    scaler = joblib.load('scaler_svm.pkl')
    print(f'scaler_svm.pkl loaded: {type(scaler).__name__}')
except Exception as e:
    print(f'scaler_svm.pkl error: {e}')

try:
    scaler2 = joblib.load('scaler_rf_v2.pkl')
    print(f'scaler_rf_v2.pkl loaded: {type(scaler2).__name__}')
except Exception as e:
    print(f'scaler_rf_v2.pkl error: {e}')
