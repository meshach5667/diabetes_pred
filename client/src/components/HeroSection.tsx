import { Activity } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="text-center py-8 mb-6">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-lg mb-4">
        <Activity className="h-7 w-7 text-white" />
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
        Diabetes Risk Assessment
      </h1>

      <p className="text-gray-600 max-w-md mx-auto">
        Enter your health metrics to get a diabetes risk prediction based on machine learning analysis.
      </p>
    </div>
  );
}
