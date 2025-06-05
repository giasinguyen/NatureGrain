import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  PresentationChartLineIcon,
  ChartBarIcon,
  ChartPieIcon,
  CalendarDaysIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { getChartOptions, COLORS } from './ChartOptions';

/**
 * Revenue Chart Component
 */
export const RevenueChart = ({ data, timeframe, darkMode }) => {
  if (!data || !data.revenue || !data.revenue.trend || data.revenue.trend.length === 0) {
    return <div className="h-80 flex items-center justify-center text-gray-500">Không có dữ liệu</div>;
  }

  const chartData = {
    labels: data.revenue.trend.map(item => {
      const date = new Date(item.date);
      return timeframe === 'week' 
        ? date.toLocaleDateString('vi-VN', { weekday: 'short' })
        : timeframe === 'month'
        ? date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })
        : date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.revenue.trend.map(item => item.value),
        borderColor: COLORS.primary[500],
        backgroundColor: `${COLORS.primary[500]}20`,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: COLORS.primary[600],
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  return (
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
      <div className="h-80">
        <Line
          data={chartData}
          options={getChartOptions('Doanh thu theo thời gian', darkMode)}
        />
      </div>
    </div>
  );
};

/**
 * Orders Status Chart Component
 */
export const OrdersChart = ({ data, darkMode }) => {
  if (!data || !data.orders) {
    return <div className="h-80 flex items-center justify-center text-gray-500">Không có dữ liệu</div>;
  }

  const chartData = {
    labels: ['Đã hoàn thành', 'Đang xử lý', 'Đã hủy', 'Chờ thanh toán'],
    datasets: [
      {
        label: 'Số đơn hàng',
        data: [
          data.orders.completed,
          data.orders.pending,
          data.orders.cancelled || 0,
          data.orders.awaitingPayment || 0
        ],
        backgroundColor: [
          COLORS.primary[500],
          COLORS.secondary[500],
          COLORS.danger[500],
          COLORS.accent[500]
        ],
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  return (
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
      <div className="h-80">
        <Bar
          data={chartData}
          options={{
            ...getChartOptions('Phân bố đơn hàng', darkMode),
            scales: {
              ...getChartOptions('', darkMode).scales,
              y: {
                ...getChartOptions('', darkMode).scales.y,
                beginAtZero: true
              }
            }
          }}
        />
      </div>
    </div>
  );
};

/**
 * Product Categories Chart Component
 */
export const CategoriesChart = ({ data, darkMode }) => {
  if (!data || !data.products || !data.products.categories || data.products.categories.length === 0) {
    return <div className="h-80 flex items-center justify-center text-gray-500">Không có dữ liệu</div>;
  }

  const chartData = {
    labels: data.products.categories.map(cat => cat.name),
    datasets: [
      {
        data: data.products.categories.map(cat => cat.value),
        backgroundColor: [
          COLORS.primary[500],
          COLORS.secondary[500],
          COLORS.accent[500],
          COLORS.danger[500]
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3
      }
    ]
  };

  return (
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
      <div className="h-80">
        <Doughnut
          data={chartData}
          options={{
            ...getChartOptions('Phân bố danh mục', darkMode),
            cutout: '60%',
            plugins: {
              ...getChartOptions('', darkMode).plugins,
              legend: {
                ...getChartOptions('', darkMode).plugins.legend,
                position: 'bottom'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

/**
 * User Growth Chart Component
 */
export const UserGrowthChart = ({ data, darkMode }) => {
  if (!data || !data.users || !data.users.trend || data.users.trend.length === 0) {
    return <div className="h-80 flex items-center justify-center text-gray-500">Không có dữ liệu</div>;
  }

  const chartData = {
    labels: data.users.trend.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        label: 'Người dùng mới',
        data: data.users.trend.map(item => item.value),
        borderColor: COLORS.secondary[500],
        backgroundColor: `${COLORS.secondary[500]}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }
    ]
  };

  return (
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
      <div className="h-80">
        <Line
          data={chartData}
          options={getChartOptions('Người dùng mới theo ngày', darkMode)}
        />
      </div>
    </div>
  );
};
