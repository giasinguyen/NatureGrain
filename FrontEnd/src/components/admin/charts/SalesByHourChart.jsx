import { useMemo } from 'react';
import { analyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { ClockIcon } from '@heroicons/react/24/outline';
import useAnalyticsData from '../hooks/useAnalyticsData';
import { formatCurrency } from '../utils/formatters';

const SalesByHourChart = () => {
  const { data, loading, error, usedFallback } = useAnalyticsData(
    () => analyticsService.getSalesByHour(),
    { 
      hourlyData: [
        {hour: 0, sales: 1200000, orders: 5},
        {hour: 1, sales: 800000, orders: 3},
        {hour: 2, sales: 500000, orders: 2},
        {hour: 3, sales: 300000, orders: 1},
        {hour: 4, sales: 200000, orders: 1},
        {hour: 5, sales: 500000, orders: 2},
        {hour: 6, sales: 1500000, orders: 6},
        {hour: 7, sales: 2800000, orders: 10},
        {hour: 8, sales: 5200000, orders: 18},
        {hour: 9, sales: 7500000, orders: 25},
        {hour: 10, sales: 8200000, orders: 28},
        {hour: 11, sales: 9800000, orders: 32},
        {hour: 12, sales: 10500000, orders: 35},
        {hour: 13, sales: 9200000, orders: 30},
        {hour: 14, sales: 7800000, orders: 26},
        {hour: 15, sales: 8500000, orders: 29},
        {hour: 16, sales: 9300000, orders: 31},
        {hour: 17, sales: 12500000, orders: 42},
        {hour: 18, sales: 15800000, orders: 52},
        {hour: 19, sales: 18200000, orders: 60},
        {hour: 20, sales: 15500000, orders: 50},
        {hour: 21, sales: 11200000, orders: 38},
        {hour: 22, sales: 6500000, orders: 22},
        {hour: 23, sales: 3200000, orders: 12}
      ], 
      peakHours: {
        morning: {hour: 12, sales: 10500000},
        evening: {hour: 19, sales: 18200000}
      }, 
      insights: [
        "Giờ cao điểm bán hàng là 19:00 với doanh số 18.200.000₫",
        "Buổi tối (17:00-22:00) chiếm 45% tổng doanh số",
        "Thời gian thấp điểm là từ 2:00-5:00 sáng"
      ] 
    }
  );

  // Calculate the highest performing hour - moved before conditional returns
  const peakHour = useMemo(() => {
    if (!data.hourlyData || data.hourlyData.length === 0) return null;
    
    let maxSales = 0;
    let hour = 0;
    
    data.hourlyData.forEach(item => {
      if (item.sales > maxSales) {
        maxSales = item.sales;
        hour = item.hour;
      }
    });
    
    return { hour, sales: maxSales };
  }, [data.hourlyData]);
  if (loading) return <LoadingSpinner />;
  if (error && !usedFallback) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu doanh số theo giờ</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ClockIcon className="h-6 w-6 mr-2 text-blue-600" />
          Doanh số theo giờ
        </h2>
      </div>
      
      {usedFallback && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Đang hiển thị dữ liệu mẫu do không thể kết nối đến máy chủ.
        </div>
      )}
      
      {/* Peak performance insights */}
      {peakHour && (
        <div className="p-4 bg-blue-50 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Giờ cao điểm</h3>
          <div className="flex items-center text-blue-800">
            <span className="text-2xl font-bold mr-2">
              {peakHour.hour}:00 - {peakHour.hour + 1}:00
            </span>
            <span className="text-sm">(Doanh số: {formatCurrency(peakHour.sales)})</span>
          </div>
          {data.peakHours && (
            <div className="mt-1 text-sm text-gray-600">
              <span className="font-medium">Gợi ý: </span>
              Đảm bảo đủ nhân viên vào giờ cao điểm và xem xét chạy chiến dịch marketing vào những giờ thấp điểm.
            </div>
          )}
        </div>
      )}

      {/* Bar chart showing hourly sales */}
      <div className="h-64 mb-6">
        {data.hourlyData && data.hourlyData.length > 0 ? (
          <div className="flex h-full items-end">
            {data.hourlyData.map((hourData, index) => {
              const maxSales = Math.max(...data.hourlyData.map(d => d.sales));
              const height = (hourData.sales / maxSales * 90);
              let bgColor = 'bg-blue-400';
              
              // Highlight peak hours
              if (hourData.hour === peakHour?.hour) {
                bgColor = 'bg-blue-600';
              }

              return (
                <div key={index} className="flex flex-col items-center justify-end flex-1">
                  <div 
                    className={`${bgColor} hover:opacity-90 transition-all rounded-t w-4/5`} 
                    style={{height: `${height}%`}}
                    title={`${hourData.hour}:00: ${formatCurrency(hourData.sales)}`}
                  ></div>
                  <div className="text-xs mt-1 truncate w-full text-center">
                    {hourData.hour}:00
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu doanh số theo giờ</p>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Phân tích & Đề xuất</h3>
        
        <div className="space-y-3 text-sm text-gray-600">
          {data.insights && data.insights.map((insight, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-md">
              <p className="font-medium text-gray-800 mb-1">{insight.title}</p>
              <p>{insight.description}</p>
            </div>
          ))}
          
          <div className="p-3 bg-yellow-50 rounded-md border border-yellow-100">
            <p className="font-medium text-yellow-800 mb-1">Đề xuất về nhân sự</p>
            <p>
              Điều chỉnh lịch làm việc của nhân viên để đảm bảo đủ nhân lực vào khung giờ 
              {peakHour ? ` ${peakHour.hour}:00 - ${peakHour.hour + 1}:00` : ' cao điểm'}.
              Có thể cần thêm nhân viên hỗ trợ trong giờ cao điểm này.
            </p>
          </div>

          <div className="p-3 bg-green-50 rounded-md border border-green-100">
            <p className="font-medium text-green-800 mb-1">Đề xuất marketing</p>
            <p>
              Xem xét việc chạy các chiến dịch khuyến mãi vào các giờ thấp điểm để phân bổ đều lượng 
              đơn hàng và tăng hiệu quả bán hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesByHourChart;
