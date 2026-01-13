import { useState } from 'react';
import { PatientData, DEFAULT_PATIENT_DATA, FEATURE_RANGES } from '@/types/patient';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';

interface StepperFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
}

const steps = [
  { id: 1, title: 'Demographics' },
  { id: 2, title: 'Vitals' },
  { id: 3, title: 'Lab Results' },
];

export function StepperForm({ onSubmit, isLoading }: StepperFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<PatientData>(DEFAULT_PATIENT_DATA);

  const updateField = <K extends keyof PatientData>(field: K, value: PatientData[K]) => {
    setData({ ...data, [field]: value });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                    isActive ? 'bg-blue-600 border-blue-600 text-white' :
                    isCompleted ? 'bg-green-600 border-green-600 text-white' :
                    'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </button>
                <span className={`text-xs mt-2 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 -mt-6 ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[350px]">
        {/* Step 1: Demographics */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Patient Demographics</h2>
              <p className="text-sm text-gray-500">Basic information about the patient</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={data.gender}
                  onValueChange={(value: 'male' | 'female') => updateField('gender', value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Age</Label>
                  <span className="text-sm text-gray-600">{data.age} years</span>
                </div>
                <Slider
                  value={[data.age]}
                  onValueChange={([value]) => updateField('age', value)}
                  min={FEATURE_RANGES.age.min}
                  max={FEATURE_RANGES.age.max}
                  step={FEATURE_RANGES.age.step}
                />
              </div>
            </div>

            {data.gender === 'female' && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Number of Pregnancies</Label>
                  <span className="text-sm text-gray-600">{data.pregnancies}</span>
                </div>
                <Slider
                  value={[data.pregnancies]}
                  onValueChange={([value]) => updateField('pregnancies', value)}
                  min={FEATURE_RANGES.pregnancies.min}
                  max={FEATURE_RANGES.pregnancies.max}
                  step={FEATURE_RANGES.pregnancies.step}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Vitals */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Vital Signs</h2>
              <p className="text-sm text-gray-500">Current health measurements</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Blood Pressure</Label>
                  <span className="text-sm text-gray-600">{data.bloodPressure} mm Hg</span>
                </div>
                <Slider
                  value={[data.bloodPressure]}
                  onValueChange={([value]) => updateField('bloodPressure', value)}
                  min={FEATURE_RANGES.bloodPressure.min}
                  max={FEATURE_RANGES.bloodPressure.max}
                  step={FEATURE_RANGES.bloodPressure.step}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>BMI</Label>
                    <span className="text-sm text-gray-600">{data.bmi.toFixed(1)} kg/m²</span>
                  </div>
                  <Input
                    type="number"
                    value={data.bmi}
                    onChange={(e) => updateField('bmi', parseFloat(e.target.value) || 0)}
                    min={FEATURE_RANGES.bmi.min}
                    max={FEATURE_RANGES.bmi.max}
                    step={FEATURE_RANGES.bmi.step}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Skin Thickness</Label>
                    <span className="text-sm text-gray-600">{data.skinThickness} mm</span>
                  </div>
                  <Slider
                    value={[data.skinThickness]}
                    onValueChange={([value]) => updateField('skinThickness', value)}
                    min={FEATURE_RANGES.skinThickness.min}
                    max={FEATURE_RANGES.skinThickness.max}
                    step={FEATURE_RANGES.skinThickness.step}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Lab Results */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Lab Results</h2>
              <p className="text-sm text-gray-500">Blood test measurements</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Glucose Level</Label>
                  <span className="text-sm text-gray-600">{data.glucose} mg/dL</span>
                </div>
                <Slider
                  value={[data.glucose]}
                  onValueChange={([value]) => updateField('glucose', value)}
                  min={FEATURE_RANGES.glucose.min}
                  max={FEATURE_RANGES.glucose.max}
                  step={FEATURE_RANGES.glucose.step}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Insulin Level</Label>
                  <span className="text-sm text-gray-600">{data.insulin} μU/mL</span>
                </div>
                <Slider
                  value={[data.insulin]}
                  onValueChange={([value]) => updateField('insulin', value)}
                  min={FEATURE_RANGES.insulin.min}
                  max={FEATURE_RANGES.insulin.max}
                  step={FEATURE_RANGES.insulin.step}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Diabetes Pedigree Function</Label>
                  <span className="text-sm text-gray-600">{data.diabetesPedigreeFunction.toFixed(2)}</span>
                </div>
                <Slider
                  value={[data.diabetesPedigreeFunction]}
                  onValueChange={([value]) => updateField('diabetesPedigreeFunction', value)}
                  min={FEATURE_RANGES.diabetesPedigreeFunction.min}
                  max={FEATURE_RANGES.diabetesPedigreeFunction.max}
                  step={FEATURE_RANGES.diabetesPedigreeFunction.step}
                />
                <p className="text-xs text-gray-500">
                  Scores likelihood of diabetes based on family history
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {currentStep < 3 ? (
          <Button onClick={nextStep}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Get Prediction'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
