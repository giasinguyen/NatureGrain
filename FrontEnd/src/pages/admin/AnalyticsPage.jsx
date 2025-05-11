import { useState } from 'react';
import { AnalyticsDashboard } from '../../components/admin/AnalyticsCharts';
import AdvancedAnalyticsDashboard from '../../components/admin/AdvancedAnalyticsCharts';
import {
  ChartBarIcon,
  ChartPieIcon,
  UsersIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

const AnalyticsPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' or 'advanced'
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Phân tích dữ liệu</h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 transition text-white rounded-md shadow ${
            isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ArrowPathIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Làm mới dữ liệu
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('basic')}
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm 
            ${activeTab === 'basic'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          <div className="flex items-center justify-center">
            <ChartPieIcon className="w-5 h-5 mr-2" />
            <span>Phân tích cơ bản</span>
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('advanced')}
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm
            ${activeTab === 'advanced'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          <div className="flex items-center justify-center">
            <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
            <span>Phân tích nâng cao</span>
          </div>
        </button>
      </div>
      
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Doanh thu</div>
              <div className="text-xl font-bold text-gray-800">500.000.000đ</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Đơn hàng</div>
              <div className="text-xl font-bold text-gray-800">3.256</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Khách hàng</div>
              <div className="text-xl font-bold text-gray-800">1.872</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
              <ChartPieIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Tỷ lệ chuyển đổi</div>
              <div className="text-xl font-bold text-gray-800">22,5%</div>
            </div>
          </div>
        </div>
      </div>
        {/* Main Analytics Dashboard */}
      <Transition
        show={!isRefreshing}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        as="div"
      >
        {activeTab === 'basic' ? <AnalyticsDashboard /> : <AdvancedAnalyticsDashboard />}
      </Transition>
      
      {isRefreshing && (
        <div className="h-96 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-green-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu phân tích...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
