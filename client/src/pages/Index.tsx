import { useState, useEffect } from 'react';
import { PatientData, DEFAULT_PATIENT_DATA } from '@/types/patient';
import { analyzeRiskFactors } from '@/utils/riskAnalysis';
import { StepperForm } from '@/components/StepperForm';
import { ResultsView } from '@/components/ResultsView';
import { predictDiabetes, checkApiHealth } from '@/services/api';
import { AlertCircle, Activity, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PredictionResult {
  prediction: 0 | 1;
  probabilityNegative: number;
  probabilityPositive: number;
  isDiabetic: boolean;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  message: string;
}

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [patientData, setPatientData] = useState<PatientData>(DEFAULT_PATIENT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const isHealthy = await checkApiHealth();
      setApiConnected(isHealthy);
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePredict = async (data: PatientData) => {
    setIsLoading(true);
    setError(null);
    setPatientData(data);
    
    try {
      const result = await predictDiabetes(data);
      setPredictionResult(result);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setPatientData(DEFAULT_PATIENT_DATA);
    setError(null);
  };

  const { riskFactors, positiveFactors } = analyzeRiskFactors(patientData);

  // Landing Page
  if (showLanding) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hospital curtain header stripe */}
        <div className="h-2 bg-teal-600" />
        
        {/* Navigation */}
        <nav className="border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">DiabetesCheck</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs ${
              apiConnected ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
              {apiConnected ? 'System Online' : 'Connecting...'}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm mb-6">
                <Shield className="h-4 w-4" />
                ML-Powered Assessment
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Early Diabetes
                <span className="block text-teal-600">Risk Detection</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Get an instant diabetes risk assessment using our machine learning model trained on clinical data. 
                Quick, private, and informative health insights in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  onClick={() => setShowLanding(false)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                >
                  Start Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900">8+</div>
                  <div className="text-sm text-gray-500">Health Metrics</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">~85%</div>
                  <div className="text-sm text-gray-500">Model Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">&lt;1min</div>
                  <div className="text-sm text-gray-500">Assessment Time</div>
                </div>
              </div>
            </div>

            {/* Right Visual - Hospital/Medical Card */}
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Health Assessment</div>
                    <div className="font-semibold text-gray-900">Patient Screening Tool</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Glucose Level', value: '---', unit: 'mg/dL' },
                    { label: 'Blood Pressure', value: '---', unit: 'mm Hg' },
                    { label: 'BMI', value: '---', unit: 'kg/m²' },
                    { label: 'Risk Score', value: '---', unit: '%' },
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <span className="text-gray-600">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-400">{metric.value}</span>
                        <span className="text-xs text-gray-400">{metric.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => setShowLanding(false)}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Begin Screening
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-100 rounded-full opacity-50 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-teal-50 rounded-full opacity-50 -z-10" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">How It Works</h2>
              <p className="text-gray-600">Three simple steps to get your risk assessment</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Enter Your Data',
                  desc: 'Provide basic health metrics like glucose, blood pressure, and BMI',
                  icon: Activity,
                },
                {
                  step: '02',
                  title: 'AI Analysis',
                  desc: 'Our ML model analyzes your data against trained clinical patterns',
                  icon: Shield,
                },
                {
                  step: '03',
                  title: 'Get Results',
                  desc: 'Receive your risk score with personalized health recommendations',
                  icon: Clock,
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-teal-600">{item.step}</span>
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-teal-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <p className="text-center text-sm text-gray-500">
              This tool is for educational purposes only and should not replace professional medical advice.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Main Assessment Tool
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => { setShowLanding(true); handleReset(); }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Activity className="h-5 w-5 text-teal-600" />
            <span className="font-semibold">DiabetesCheck</span>
          </button>
         
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Prediction Failed</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              {!apiConnected && (
                <p className="text-sm text-gray-600 mt-2">
                  Start the API: <code className="bg-gray-100 px-1 rounded text-xs">uvicorn server.main:app --reload --port 8000</code>
                </p>
              )}
            </div>
          </div>
        )}

        {predictionResult ? (
          <ResultsView
            probabilityPositive={predictionResult.probabilityPositive}
            probabilityNegative={predictionResult.probabilityNegative}
            riskLevel={predictionResult.riskLevel}
            isDiabetic={predictionResult.isDiabetic}
            riskFactors={riskFactors}
            positiveFactors={positiveFactors}
            patientData={patientData}
            onReset={handleReset}
          />
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Diabetes Risk Assessment</h1>
              <p className="text-gray-600">Enter your health metrics to get a prediction</p>
            </div>
            <StepperForm onSubmit={handlePredict} isLoading={isLoading} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
