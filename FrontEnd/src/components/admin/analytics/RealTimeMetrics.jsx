import React from 'react';
import { 
  UserGroupIcon, 
  ShoppingCartIcon,
  ChartBarIcon 
} from '@heroicons/react/24/solid';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from './ChartOptions';

/**
 * Real-time metrics display component
 * @param {Object} props
 * @param {Object} props.metrics - Real-time metrics data
 * @param {Date} props.lastUpdate - Timestamp of last update
 */
const RealTimeMetrics = ({ metrics, lastUpdate }) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 mb-8 border border-green-200 dark:border-green-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
          Dữ liệu thời gian thực
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Cập nhật lần cuối: {lastUpdate.toLocaleTimeString('vi-VN')}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto mb-2">
            <UserGroupIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {metrics.onlineUsers}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Người dùng online</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto mb-2">
            <ShoppingCartIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {metrics.activeOrders}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Đơn hàng đang xử lý</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mx-auto mb-2">
            <CurrencyDollarIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(metrics.recentSales)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Doanh thu hôm nay</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full mx-auto mb-2">
            <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {typeof metrics.conversionRate === 'number' 
              ? metrics.conversionRate.toFixed(1) + '%' 
              : metrics.conversionRate}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ chuyển đổi</p>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;
