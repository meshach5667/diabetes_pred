import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { RiskGauge } from './RiskGauge';
import { RiskAnalysis } from './RiskAnalysis';
import { Recommendations } from './Recommendations';
import { PatientData, RiskFactor } from '@/types/patient';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ResultsViewProps {
  probabilityPositive: number;
  probabilityNegative: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  isDiabetic: boolean;
  riskFactors: RiskFactor[];
  positiveFactors: RiskFactor[];
  patientData: PatientData;
  onReset: () => void;
}

export function ResultsView({
  probabilityPositive,
  probabilityNegative,
  riskLevel,
  isDiabetic,
  riskFactors,
  positiveFactors,
  onReset,
}: ResultsViewProps) {
  const getStatusConfig = () => {
    if (!isDiabetic && riskLevel === 'LOW') {
      return {
        icon: CheckCircle,
        title: 'Low Risk',
        subtitle: 'Not Diabetic',
        message: 'The model predicts a low probability of diabetes based on the provided health metrics.',
        bgClass: 'bg-green-50 border-green-200',
        textClass: 'text-green-700',
        iconBg: 'bg-green-100',
      };
    }
    if (!isDiabetic && riskLevel === 'MODERATE') {
      return {
        icon: AlertTriangle,
        title: 'Moderate Risk',
        subtitle: 'Not Diabetic',
        message: 'While the prediction is negative, some risk factors are present.',
        bgClass: 'bg-yellow-50 border-yellow-200',
        textClass: 'text-yellow-700',
        iconBg: 'bg-yellow-100',
      };
    }
    if (isDiabetic && riskLevel === 'HIGH') {
      return {
        icon: XCircle,
        title: 'High Risk',
        subtitle: 'Diabetic',
        message: 'The model indicates a high probability of diabetes. Medical consultation is recommended.',
        bgClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-700',
        iconBg: 'bg-red-100',
      };
    }
    return {
      icon: AlertTriangle,
      title: 'Moderate Risk',
      subtitle: 'Diabetic',
      message: 'The model suggests diabetes risk. Please consult a healthcare professional.',
      bgClass: 'bg-yellow-50 border-yellow-200',
      textClass: 'text-yellow-700',
      iconBg: 'bg-yellow-100',
    };
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Results</h2>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>

      {/* Main Result */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* Status */}
          <div className={`${status.bgClass} border rounded-lg p-5`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${status.iconBg}`}>
                <StatusIcon className={`h-6 w-6 ${status.textClass}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{status.subtitle}</p>
                <h3 className={`text-xl font-semibold ${status.textClass}`}>{status.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{status.message}</p>
              </div>
            </div>
          </div>

          {/* Probabilities */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-green-700 mb-1">Non-Diabetic</p>
              <p className="text-2xl font-bold text-green-700">{probabilityNegative.toFixed(1)}%</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-sm text-red-700 mb-1">Diabetic</p>
              <p className="text-2xl font-bold text-red-700">{probabilityPositive.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Gauge */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center">
          <RiskGauge probability={probabilityPositive} size={220} />
        </div>
      </div>

      {/* Risk Analysis */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Factor Analysis</h3>
        <RiskAnalysis riskFactors={riskFactors} positiveFactors={positiveFactors} />
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Health Recommendations</h3>
        <Recommendations isDiabetic={isDiabetic} />
      </div>
    </div>
  );
}
