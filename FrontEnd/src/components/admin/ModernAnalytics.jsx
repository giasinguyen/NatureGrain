import React, { useState, useCallback } from 'react';
import { 
  ArrowDownTrayIcon, 
  ArrowPathIcon, 
  MoonIcon, 
  SunIcon, 
  ChartBarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/solid';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

// Component imports
import ModernMetricCard from './analytics/ModernMetricCard';
import AdvancedRealTimeStatistics from './analytics/RealTimeMetrics';
import { RevenueChart, OrdersChart, CategoriesChart, UserGrowthChart } from './analytics/AnalyticsCharts';
import ProductsTable from './analytics/ProductsTable';

// Hooks imports
import { useAnalyticsData, useRealTimeMetrics } from './analytics/AnalyticsHooks';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

/**
 * Main Analytics Dashboard Component
 */
const ModernAnalytics = () => {
  // State
  const [timeframe, setTimeframe] = useState('month');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('analytics-dark-mode') === 'true';
  });
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [isLiveMode, setIsLiveMode] = useState(true);
  // Hooks
  const { data, loading, error, fetchData } = useAnalyticsData(timeframe, dateRange);
  const { realTimeMetrics, lastUpdate } = useRealTimeMetrics(isLiveMode);

  // Apply dark mode to document
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('analytics-dark-mode', darkMode.toString());
  }, [darkMode]);

  // Export data functionality
  const exportData = useCallback((format) => {
    if (!data) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      timeframe,
      dateRange,
      metrics: data
    };
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Convert to CSV format
      const csvData = [
        ['Metric', 'Value', 'Growth'],
        ['Revenue', data.revenue.current, data.revenue.growth + '%'],
        ['Users', data.users.current, data.users.growth + '%'],
        ['Orders', data.orders.current, data.orders.growth + '%'],
        ['Retention Rate', data.retention.rate + '%', '']
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [data, timeframe, dateRange]);

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu phân tích...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <ChartBarIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Lỗi tải dữ liệu
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Phân tích nâng cao
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Thông tin chi tiết về hiệu suất và xu hướng
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">            
            {/* Real-time indicator */}
            {isLiveMode && (
              <div 
                className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                onClick={() => setIsLiveMode(!isLiveMode)}
                title="Click để tắt/bật chế độ thời gian thực"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Thời gian thực</span>
              </div>
            )}
            
            {!isLiveMode && (
              <button
                onClick={() => setIsLiveMode(true)}
                className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Bật chế độ thời gian thực"
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Dữ liệu tĩnh</span>
              </button>
            )}
            
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all"
            >
              <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Bộ lọc</span>
            </button>
            
            {/* Export dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Xuất dữ liệu</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => exportData('json')}
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  Xuất JSON
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                >
                  Xuất CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Khung thời gian
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="week">7 ngày qua</option>
                  <option value="month">30 ngày qua</option>
                  <option value="year">1 năm qua</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Real-time Metrics Bar */}
        {isLiveMode && <AdvancedRealTimeStatistics metrics={realTimeMetrics} lastUpdate={lastUpdate} isLiveMode={isLiveMode} />}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">          <ModernMetricCard
            title="Tổng doanh thu"
            value={data?.revenue?.current || 0}
            change={{ 
              change: data?.revenue?.growth || 0, 
              isPositive: data?.revenue?.growth > 0 // Chỉ hiển thị tích cực nếu thực sự có tăng trưởng dương
            }}
            icon={CurrencyDollarIcon}
            colorScheme="primary"
            formatType="currency"
            subtitle="So với tháng trước"
            loading={loading}
          />
          
          <ModernMetricCard
            title="Người dùng"
            value={data?.users?.current || 0}
            change={{ change: data?.users?.growth || 0, isPositive: (data?.users?.growth || 0) > 0 }}
            icon={UserGroupIcon}
            colorScheme="secondary"
            subtitle={`${data?.users?.newUsers || 0} người dùng mới`}
            loading={loading}
          />
          
          <ModernMetricCard
            title="Đơn hàng"
            value={data?.orders?.current || 0}
            change={{ change: data?.orders?.growth || 0, isPositive: (data?.orders?.growth || 0) > 0 }}
            icon={ShoppingCartIcon}
            colorScheme="accent"
            subtitle={`${data?.orders?.completed || 0} đã hoàn thành`}
            loading={loading}
          />
            <ModernMetricCard
            title="Tỷ lệ giữ chân KH"
            value={data?.retention?.rate || data?.users?.retention || 68.5}
            change={{ change: 2.3, isPositive: true }}
            icon={ArrowTrendingUpIcon}
            colorScheme="primary"
            formatType="percentage"
            subtitle="Trong 30 ngày qua"
            loading={loading}
          />
        </div>

        {/* Charts Grid */}
        {data && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <RevenueChart data={data} timeframe={timeframe} darkMode={darkMode} />
            <OrdersChart data={data} darkMode={darkMode} />
            <CategoriesChart data={data} darkMode={darkMode} />
            <UserGrowthChart data={data} darkMode={darkMode} />
          </div>
        )}

        {/* Top Products Table */}
        {data?.products?.topSelling && (
          <ProductsTable products={data.products.topSelling} />
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernAnalytics;