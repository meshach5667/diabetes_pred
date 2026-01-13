import { Heart, Stethoscope, Apple, Footprints, Moon, Activity } from 'lucide-react';

interface RecommendationsProps {
  isDiabetic: boolean;
}

export function Recommendations({ isDiabetic }: RecommendationsProps) {
  if (isDiabetic) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-5">
        <h4 className="flex items-center gap-2 font-medium text-red-700 mb-4">
          <Stethoscope className="h-4 w-4" />
          Recommended Actions
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: Stethoscope, title: 'Consult a Professional', desc: 'Schedule a diabetes screening' },
            { icon: Activity, title: 'Regular Monitoring', desc: 'Check blood glucose regularly' },
            { icon: Apple, title: 'Dietary Changes', desc: 'Consider a low-glycemic diet' },
            { icon: Footprints, title: 'Physical Activity', desc: '150+ minutes exercise weekly' },
            { icon: Heart, title: 'Medication Review', desc: 'Discuss treatments with your doctor' },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200">
              <item.icon className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
      <h4 className="flex items-center gap-2 font-medium text-green-700 mb-4">
        <Heart className="h-4 w-4" />
        Maintain Your Health
      </h4>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: Stethoscope, title: 'Regular Check-ups', desc: 'Annual health screenings' },
          { icon: Apple, title: 'Balanced Nutrition', desc: 'Vegetables and whole grains' },
          { icon: Footprints, title: 'Stay Active', desc: '30+ minutes exercise daily' },
          { icon: Activity, title: 'Healthy Weight', desc: 'Maintain optimal BMI' },
          { icon: Moon, title: 'Quality Sleep', desc: '7-9 hours per night' },
        ].map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200">
            <item.icon className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
