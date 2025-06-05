import React, { memo } from 'react';
import { 
  PresentationChartLineIcon, 
  ChartBarIcon, 
  ChartPieIcon, 
  UserGroupIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { LineChartComponent, BarChartComponent, DoughnutChartComponent } from './ChartComponents';

/**
 * Component for the chart grid in the analytics dashboard
 */
const AnalyticsChartGrid = memo(({ chartData, data, timeframe, darkMode }) => {
  if (!chartData) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
      {/* Revenue Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <PresentationChartLineIcon className="h-5 w-5 mr-2 text-green-600" />
            Xu hướng doanh thu
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>{timeframe === 'week' ? '7 ngày' : timeframe === 'month' ? '30 ngày' : '1 năm'}</span>
          </div>
        </div>
        <LineChartComponent 
          data={chartData.revenue} 
          title="Doanh thu theo thời gian" 
          darkMode={darkMode}
        />
      </div>

      {/* Orders Status Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
            Trạng thái đơn hàng
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Tổng: {data?.orders?.current || 0} đơn
          </div>
        </div>
        <BarChartComponent 
          data={chartData.orders}
          title="Phân bố đơn hàng" 
          darkMode={darkMode}
        />
      </div>

      {/* Product Categories Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <ChartPieIcon className="h-5 w-5 mr-2 text-purple-600" />
            Danh mục sản phẩm
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Theo doanh số
          </div>
        </div>
        <DoughnutChartComponent 
          data={chartData.categories}
          title="Phân bố danh mục" 
          darkMode={darkMode}
        />
      </div>

      {/* User Growth Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Tăng trưởng người dùng
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            +{data?.users?.growth || 0}% so với kỳ trước
          </div>
        </div>
        <LineChartComponent 
          data={chartData.userGrowth}
          title="Người dùng mới theo ngày" 
          darkMode={darkMode}
        />
      </div>
    </div>
  );
});

AnalyticsChartGrid.displayName = 'AnalyticsChartGrid';

export default AnalyticsChartGrid;
