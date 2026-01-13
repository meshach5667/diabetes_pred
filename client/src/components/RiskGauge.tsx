import { useEffect, useState } from 'react';

interface RiskGaugeProps {
  probability: number;
  size?: number;
}

export function RiskGauge({ probability, size = 200 }: RiskGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(probability);
    }, 100);
    return () => clearTimeout(timer);
  }, [probability]);

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI;
  const progress = (animatedValue / 100) * circumference;

  const getColor = (value: number) => {
    if (value < 30) return '#16a34a'; // green-600
    if (value < 70) return '#ca8a04'; // yellow-600
    return '#dc2626'; // red-600
  };

  const getRiskLabel = (value: number) => {
    if (value < 30) return 'Low Risk';
    if (value < 70) return 'Moderate Risk';
    return 'High Risk';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size / 2 + 30}
        viewBox={`0 0 ${size} ${size / 2 + 30}`}
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={getColor(animatedValue)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.3s ease' }}
        />

        {/* Tick labels */}
        {[0, 30, 70, 100].map((tick) => {
          const angle = (tick / 100) * 180;
          const x = size / 2 + (radius + 18) * Math.cos((Math.PI * (180 - angle)) / 180);
          const y = size / 2 - (radius + 18) * Math.sin((Math.PI * (180 - angle)) / 180);
          return (
            <text
              key={tick}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-400 text-xs"
            >
              {tick}%
            </text>
          );
        })}
      </svg>

      <div className="text-center -mt-2">
        <div
          className="text-3xl font-bold transition-colors duration-300"
          style={{ color: getColor(animatedValue) }}
        >
          {animatedValue.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {getRiskLabel(animatedValue)}
        </div>
      </div>
    </div>
  );
}
