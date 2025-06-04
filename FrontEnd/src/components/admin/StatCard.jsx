import { useState, useRef, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const StatCard = ({ title, value, change, icon: Icon, color, prefix = '', suffix = '', formatValue = null }) => {
  // Format large numbers to include commas
  const formattedValue = formatValue 
    ? formatValue(value) 
    : value?.toLocaleString();

  // Calculate if the change is positive, negative, or neutral
  let changeType = 'neutral';
  if (change > 0) changeType = 'positive';
  if (change < 0) changeType = 'negative';

  // Generate bar width for animation
  const [width, setWidth] = useState(0);
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (cardRef.current) {
      // Start the animation after component mounts
      setTimeout(() => {
        setWidth(100);
      }, 100);
    }
  }, []);

  // Color configurations
  const colorConfigs = {
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      textPrimary: 'text-green-700',
      textSecondary: 'text-green-600',
      indicator: 'bg-green-500'
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      textPrimary: 'text-blue-700', 
      textSecondary: 'text-blue-600',
      indicator: 'bg-blue-500'
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      textPrimary: 'text-red-700',
      textSecondary: 'text-red-600',
      indicator: 'bg-red-500'
    },
    yellow: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600',
      textPrimary: 'text-yellow-700',
      textSecondary: 'text-yellow-600',
      indicator: 'bg-yellow-500'
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      textPrimary: 'text-purple-700',
      textSecondary: 'text-purple-600',
      indicator: 'bg-purple-500'
    },
    gray: {
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-600',
      textPrimary: 'text-gray-700',
      textSecondary: 'text-gray-600',
      indicator: 'bg-gray-500'
    }
  };
  
  const colorConfig = colorConfigs[color] || colorConfigs.gray;

  return (
    <div ref={cardRef} className={`${colorConfig.bg} rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out`}>
      <div className="p-4 relative">
        {/* Bar indicator */}
        <div 
          className={`absolute bottom-0 left-0 h-1 ${colorConfig.indicator} transition-all duration-1000 ease-out`} 
          style={{ width: `${width}%` }}
        ></div>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <div className="flex items-baseline">
              <p className={`text-2xl font-bold ${colorConfig.textPrimary}`}>
                {prefix}{formattedValue}{suffix}
              </p>
            </div>
            
            {change !== undefined && (
              <div className="mt-2 flex items-center">
                {changeType === 'positive' && (
                  <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                )}
                {changeType === 'negative' && (
                  <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${
                  changeType === 'positive' ? 'text-green-600' : 
                  changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {Math.abs(change)}% so với tháng trước
                </span>
              </div>
            )}
          </div>
          
          <div className={`${colorConfig.iconBg} p-3 rounded-full`}>
            <Icon className={`h-6 w-6 ${colorConfig.iconText}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
