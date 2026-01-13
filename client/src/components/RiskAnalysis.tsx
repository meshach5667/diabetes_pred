import { RiskFactor } from '@/types/patient';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface RiskAnalysisProps {
  riskFactors: RiskFactor[];
  positiveFactors: RiskFactor[];
}

export function RiskAnalysis({ riskFactors, positiveFactors }: RiskAnalysisProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Risk Factors */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="flex items-center gap-2 font-medium text-red-700 mb-3">
          <AlertTriangle className="h-4 w-4" />
          Risk Factors
        </h4>
        {riskFactors.length > 0 ? (
          <ul className="space-y-2">
            {riskFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-500 mt-1">•</span>
                <span>{factor.message}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            No significant risk factors identified
          </p>
        )}
      </div>

      {/* Positive Factors */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="flex items-center gap-2 font-medium text-green-700 mb-3">
          <CheckCircle className="h-4 w-4" />
          Positive Indicators
        </h4>
        {positiveFactors.length > 0 ? (
          <ul className="space-y-2">
            {positiveFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-1">•</span>
                <span>{factor.message}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">
            Enter your health data to see positive indicators
          </p>
        )}
      </div>
    </div>
  );
}
