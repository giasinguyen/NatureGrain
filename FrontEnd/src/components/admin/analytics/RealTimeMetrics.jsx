import React, { useState, useEffect, useRef } from 'react';
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  ClockIcon,
  FireIcon,
  BoltIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
  PresentationChartLineIcon,
  CpuChipIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon,
  FireIcon as FireSolidIcon 
} from '@heroicons/react/24/solid';
import { formatCurrency } from './ChartOptions';

/**
 * Advanced Real-time Business Intelligence Dashboard
 * Features: Multiple view modes, interactive controls, real-time updates, customizable widgets
 */
const AdvancedRealTimeStatistics = ({ metrics, lastUpdate, isLiveMode = true }) => {
  const [viewMode, setViewMode] = useState('comprehensive'); // comprehensive, compact, detailed
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [isPaused, setIsPaused] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState('all');
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [highlightChanges, setHighlightChanges] = useState({});
  const previousMetrics = useRef({});
  
  // Track metric changes for animations
  useEffect(() => {
    if (animationEnabled && metrics) {
      const changes = {};
      Object.keys(metrics).forEach(key => {
        if (previousMetrics.current[key] !== metrics[key] && previousMetrics.current[key] !== undefined) {
          changes[key] = metrics[key] > previousMetrics.current[key] ? 'increase' : 'decrease';
          setTimeout(() => {
            setHighlightChanges(prev => ({ ...prev, [key]: null }));
          }, 2000);
        }
      });
      setHighlightChanges(changes);
      previousMetrics.current = { ...metrics };
    }
  }, [metrics, animationEnabled]);  // Helper functions
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };
  const getChangeIcon = (change) => {
    if (change === 'increase') return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    if (change === 'decrease') return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getAnimationClass = (key) => {
    if (!animationEnabled) return '';
    const change = highlightChanges[key];
    if (change === 'increase') return 'animate-pulse bg-green-50 dark:bg-green-900/20';
    if (change === 'decrease') return 'animate-pulse bg-red-50 dark:bg-red-900/20';
    return '';
  };

  const getSatisfactionStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarSolidIcon key={i} className="h-4 w-4 text-yellow-400 opacity-50" />);
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const getSystemHealthColor = (value, type) => {
    switch (type) {
      case 'uptime':
        return value >= 99.5 ? 'text-green-500' : value >= 99 ? 'text-yellow-500' : 'text-red-500';
      case 'response':
        return value <= 200 ? 'text-green-500' : value <= 500 ? 'text-yellow-500' : 'text-red-500';
      case 'error':
        return value <= 0.1 ? 'text-green-500' : value <= 1 ? 'text-yellow-500' : 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const renderControlPanel = () => (
    <div className="flex items-center gap-4 mb-6">
      {/* Live Status Indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isLiveMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isLiveMode ? 'Trực tiếp' : 'Tạm dừng'}
        </span>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Chế độ xem:</span>
        <select 
          value={viewMode} 
          onChange={(e) => setViewMode(e.target.value)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          <option value="comprehensive">Toàn diện</option>
          <option value="compact">Gọn gàng</option>
          <option value="detailed">Chi tiết</option>
        </select>
      </div>

      {/* Refresh Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
        >
          {isPaused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
          {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Làm mới
        </button>
      </div>

      {/* Settings Toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Cog6ToothIcon className="h-4 w-4" />
        Cài đặt
        {showSettings ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />}
      </button>
    </div>
  );

  const renderSettingsPanel = () => showSettings && (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Refresh Interval */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tần suất cập nhật (giây)
          </label>
          <input
            type="number"
            min="5"
            max="300"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          />
        </div>

        {/* Animation Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hiệu ứng chuyển động
          </label>
          <button
            onClick={() => setAnimationEnabled(!animationEnabled)}
            className={`w-full px-3 py-1 rounded-md transition-colors ${
              animationEnabled 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {animationEnabled ? 'Bật' : 'Tắt'}
          </button>
        </div>

        {/* Metric Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hiển thị chỉ số
          </label>
          <select 
            value={selectedMetrics} 
            onChange={(e) => setSelectedMetrics(e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="all">Tất cả</option>
            <option value="revenue">Doanh thu</option>
            <option value="orders">Đơn hàng</option>
            <option value="customers">Khách hàng</option>
            <option value="system">Hệ thống</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderComprehensiveMetrics = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {/* Revenue Today */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-green-500 transition-all ${getAnimationClass('todayRevenue')}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full">
            <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          {getChangeIcon(highlightChanges.todayRevenue)}
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {formatCurrency(metrics.todayRevenue || 0)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Doanh thu hôm nay</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">+{metrics.revenueGrowth || 0}%</span>
          </div>
          <FireSolidIcon className="h-4 w-4 text-orange-500" />
        </div>
      </div>

      {/* New Orders */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-blue-500 transition-all ${getAnimationClass('newOrdersToday')}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <ShoppingCartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          {getChangeIcon(highlightChanges.newOrdersToday)}
        </div>        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {formatNumber(metrics.newOrdersToday || 0)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Đơn hàng mới</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-blue-600">Hôm nay</span>
          <div className="w-12 bg-blue-200 dark:bg-blue-800 rounded-full h-1">
            <div className="bg-blue-500 h-1 rounded-full" style={{width: `${Math.min((metrics.newOrdersToday || 0) / 50 * 100, 100)}%`}}></div>
          </div>
        </div>
      </div>

      {/* Average Order Value */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-purple-500 transition-all ${getAnimationClass('averageOrderValue')}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          {getChangeIcon(highlightChanges.averageOrderValue)}
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {formatCurrency(metrics.averageOrderValue || 0)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Giá trị TB/đơn</p>        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-purple-600">AOV</span>
          <ArrowTrendingUpIcon className="h-4 w-4 text-purple-500" />
        </div>
      </div>

      {/* Active Sessions */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-indigo-500 transition-all ${getAnimationClass('activeSessions')}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
            <EyeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          {getChangeIcon(highlightChanges.activeSessions)}
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {metrics.activeSessions || 0}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Phiên hoạt động</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-indigo-600">Trực tuyến</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-teal-500 transition-all ${getAnimationClass('conversionRate')}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-full">
            <PresentationChartLineIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          {getChangeIcon(highlightChanges.conversionRate)}
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {metrics.conversionRate || 0}%
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ chuyển đổi</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-teal-600">CVR</span>
          <div className="w-12 bg-teal-200 dark:bg-teal-800 rounded-full h-1">
            <div className="bg-teal-500 h-1 rounded-full" style={{width: `${Math.min((metrics.conversionRate || 0) * 10, 100)}%`}}></div>
          </div>
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-yellow-500 transition-all ${getAnimationClass('customerSatisfaction')}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
            <StarIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          {getChangeIcon(highlightChanges.customerSatisfaction)}
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {(metrics.customerSatisfaction || 0).toFixed(1)}/5
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Độ hài lòng KH</p>
        <div className="flex justify-center mt-2">
          {getSatisfactionStars(metrics.customerSatisfaction || 0)}
        </div>
      </div>
    </div>
  );

  const renderSystemHealth = () => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <CpuChipIcon className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
        Sức khỏe hệ thống
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Response Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Thời gian phản hồi</span>
            <BoltIcon className="h-4 w-4 text-yellow-500" />
          </div>
          <p className={`text-xl font-bold ${getSystemHealthColor(metrics.systemMetrics?.responseTime, 'response')}`}>
            {metrics.systemMetrics?.responseTime || 0}ms
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                (metrics.systemMetrics?.responseTime || 0) <= 200 ? 'bg-green-500' : 
                (metrics.systemMetrics?.responseTime || 0) <= 500 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{width: `${Math.min((metrics.systemMetrics?.responseTime || 0) / 1000 * 100, 100)}%`}}
            ></div>
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Thời gian hoạt động</span>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </div>
          <p className={`text-xl font-bold ${getSystemHealthColor(metrics.systemMetrics?.uptime, 'uptime')}`}>
            {(metrics.systemMetrics?.uptime || 0).toFixed(1)}%
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="h-2 rounded-full bg-green-500"
              style={{width: `${metrics.systemMetrics?.uptime || 0}%`}}
            ></div>
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tỷ lệ lỗi</span>
            <XCircleIcon className="h-4 w-4 text-red-500" />
          </div>
          <p className={`text-xl font-bold ${getSystemHealthColor(metrics.systemMetrics?.errorRate, 'error')}`}>
            {(metrics.systemMetrics?.errorRate || 0).toFixed(2)}%
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                (metrics.systemMetrics?.errorRate || 0) <= 0.1 ? 'bg-green-500' : 
                (metrics.systemMetrics?.errorRate || 0) <= 1 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{width: `${Math.min((metrics.systemMetrics?.errorRate || 0) * 10, 100)}%`}}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => {
    const alertCount = metrics.lowStockAlerts || 0;
    const activityCount = metrics.recentActivityCount || 0;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <BellIcon className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
          Thông báo & Cảnh báo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stock Alerts */}
          <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 ${
            alertCount > 0 ? 'border-red-500' : 'border-green-500'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cảnh báo tồn kho</span>
              <ExclamationTriangleIcon className={`h-5 w-5 ${alertCount > 0 ? 'text-red-500' : 'text-green-500'}`} />
            </div>
            <p className={`text-2xl font-bold ${alertCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {alertCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {alertCount > 0 ? 'Sản phẩm cần bổ sung' : 'Tồn kho ổn định'}
            </p>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hoạt động gần đây</span>
              <UserGroupIcon className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {activityCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Hoạt động trong 1 giờ qua
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <PresentationChartLineIcon className="h-7 w-7 mr-3 text-blue-600 dark:text-blue-400" />
          Bảng Điều Khiển Thông Minh
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Cập nhật: {lastUpdate?.toLocaleTimeString('vi-VN') || 'Chưa có'}
          </span>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Tự động cập nhật mỗi {refreshInterval}s
            </span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      {renderControlPanel()}

      {/* Settings Panel */}
      {renderSettingsPanel()}

      {/* Main Metrics */}
      {viewMode === 'comprehensive' && renderComprehensiveMetrics()}
      
      {/* System Health */}
      {(viewMode === 'comprehensive' || viewMode === 'detailed') && renderSystemHealth()}
      
      {/* Alerts Section */}
      {(viewMode === 'comprehensive' || viewMode === 'detailed') && renderAlerts()}

      {/* Peak Hours Info */}
      {viewMode === 'detailed' && metrics.peakHours && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
            Phân tích giờ cao điểm
          </h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Giờ hiện tại</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {metrics.peakHours.currentHour}:00
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Giờ cao điểm</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {metrics.peakHours.peakHour}:00
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Điểm lưu lượng</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {metrics.peakHours.trafficScore}/100
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedRealTimeStatistics;
