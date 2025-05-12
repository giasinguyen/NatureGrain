import React, { useState } from 'react';
import BasketAnalysisChart from './BasketAnalysisChart';
import CategoryPerformanceChart from './charts/CategoryPerformanceChart';
import CustomerInsightsChart from './charts/CustomerInsightsChart';
import CustomerLifetimeValueChart from './charts/CustomerLifetimeValueChart';
import DateRangeAnalysis from './charts/DateRangeAnalysis';
import DayHourHeatmapChart from './charts/DayHourHeatmapChart';
import FunnelAnalysisChart from './charts/FunnelAnalysisChart';
import OrderCompletionRateChart from './charts/OrderCompletionRateChart';
import OrderProcessingTimeAnalysis from './charts/OrderProcessingTimeAnalysis';
import RfmAnalysisChart from './charts/RfmAnalysisChart';
import SalesByHourChart from './charts/SalesByHourChart';
import SalesTrendsAnalysis from './charts/SalesTrendsAnalysis';
import SeasonalTrendsChart from './charts/SeasonalTrendsChart';
import UserCohortAnalysisChart from './charts/UserCohortAnalysisChart';

// ServerErrorBanner component to display when there are backend issues
const ServerErrorBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return isVisible ? (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Đang có lỗi kết nối đến một số API phân tích nâng cao. Một số biểu đồ sẽ sử dụng dữ liệu giả lập.
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={() => setIsVisible(false)}
              className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
            >
              <span className="sr-only">Đóng</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

const AdvancedAnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <ServerErrorBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RfmAnalysisChart />
        <BasketAnalysisChart />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <FunnelAnalysisChart />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <UserCohortAnalysisChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CustomerLifetimeValueChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesByHourChart />
        <SeasonalTrendsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPerformanceChart />
        <DayHourHeatmapChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <OrderCompletionRateChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderProcessingTimeAnalysis />
        <SalesTrendsAnalysis />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerInsightsChart />
        <DateRangeAnalysis />
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
