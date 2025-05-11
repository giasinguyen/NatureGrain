import { useState } from 'react';
import {
  SalesTrendsChart,
  UserGrowthChart,
  CustomerRetentionChart,
  ProductPerformanceChart,
  OrderStatusDistributionChart
} from './AnalyticsCharts';
import {
  AdvancedAnalyticsDashboard,
  RfmAnalysisChart,
  FunnelAnalysisChart,
  UserCohortAnalysisChart,
  CustomerLifetimeValueChart,
  SeasonalTrendsChart,
  CategoryPerformanceChart,
  DayHourHeatmapChart,
  OrderCompletionRateChart
} from './AdvancedAnalyticsCharts';
import BasketAnalysisChart from './BasketAnalysisChart';
import AnalyticsDocumentation from './AnalyticsDocumentation';
import ExportAnalyticsReportModal from './ExportAnalyticsReportModal';
import { 
  ChartBarIcon, 
  ChartPieIcon, 
  QuestionMarkCircleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'advanced', or 'docs'
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const tabs = [
    { id: 'basic', name: 'Phân tích Cơ bản', icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: 'advanced', name: 'Phân tích Nâng cao', icon: <ChartPieIcon className="w-5 h-5" /> },
    { id: 'docs', name: 'Hướng dẫn', icon: <QuestionMarkCircleIcon className="w-5 h-5" /> }
  ];
  
  const openExportModal = () => setIsExportModalOpen(true);
  const closeExportModal = () => setIsExportModalOpen(false);

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phân tích Dữ liệu</h1>
          <p className="text-gray-600 mt-2">
            Xem và theo dõi các số liệu thống kê và phân tích chi tiết về hoạt động của cửa hàng
          </p>
        </div>
        <button
          onClick={openExportModal}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Xuất báo cáo tổng hợp
        </button>
      </div>
      
      {/* Export Modal */}
      <ExportAnalyticsReportModal 
        isOpen={isExportModalOpen} 
        onClose={closeExportModal} 
      />{/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'basic' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesTrendsChart />
            <UserGrowthChart />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderStatusDistributionChart />
            <CustomerRetentionChart />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <ProductPerformanceChart />
          </div>
        </div>
      ) : activeTab === 'advanced' ? (
        <AdvancedAnalyticsDashboard />
      ) : (
        <AnalyticsDocumentation />
      )}
    </div>
  );
};

export default AnalyticsPage;
