import React, { memo } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import { formatCurrency, formatNumber } from './ChartOptions';

// Modern Metric Card Component
const ModernMetricCard = memo(({ 
  title, 
  value, 
  change, 
  icon: IconComponent, 
  colorScheme = 'primary',
  formatType = 'number',
  subtitle,
  loading = false
}) => {
  const formatValue = (val) => {
    if (loading) return '—';
    if (formatType === 'currency') return formatCurrency(val);
    if (formatType === 'percentage') return `${val}%`;
    return formatNumber(val);
  };
  
  const isPositive = change?.isPositive !== false;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-${colorScheme}-50 to-${colorScheme}-100 dark:from-${colorScheme}-900/20 dark:to-${colorScheme}-800/20`}>
          <IconComponent className={`h-6 w-6 text-${colorScheme}-600 dark:text-${colorScheme}-400`} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive 
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {isPositive ? (
              <ArrowTrendingUpIcon className="h-3 w-3" />
            ) : (
              <ArrowTrendingDownIcon className="h-3 w-3" />
            )}
            <span>{change.change}%</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {formatValue(value)}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
});

ModernMetricCard.displayName = 'ModernMetricCard';

export default ModernMetricCard;
