import { useState, useMemo } from 'react';
import { advancedAnalyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { CalendarIcon } from '@heroicons/react/24/outline';
import useAnalyticsData from '../hooks/useAnalyticsData';
import { formatCurrency } from '../utils/formatters';

const SeasonalTrendsChart = () => {
  const [timeframe, setTimeframe] = useState(1); // Use numeric value 1 for 'monthly'
  const [year, setYear] = useState(new Date().getFullYear());
  
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getSeasonalTrends(timeframe, year),
    { data: [], peakPeriods: {}, yearComparison: [] },
    [timeframe, year]
  );
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  
  const chartData = useMemo(() => {
    if (!data || !data.data) return [];
    return data.data;
  }, [data]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu phân tích theo mùa</div>;

  const renderLegend = () => (
    <div className="flex justify-center space-x-6 text-sm">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        <span>Doanh thu</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
        <span>Đơn hàng</span>
      </div>
      {data.yearComparison && data.yearComparison.length > 0 && (
        <div className="flex items-center">
          <div className="w-3 h-3 border border-dashed border-gray-400 mr-2"></div>
          <span>Năm trước</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <CalendarIcon className="h-6 w-6 mr-2 text-purple-600" />
          Phân tích theo mùa
        </h2>
        
        <div className="flex items-center space-x-3 mt-3 md:mt-0">
          <select 
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(parseInt(e.target.value, 10))}
          >
            <option value={1}>Theo tháng</option>
            <option value={2}>Theo quý</option>
          </select>
          
          <select 
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
          >
            {[year-1, year, year+1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Summary about peak periods */}
      {data.peakPeriods && Object.keys(data.peakPeriods).length > 0 && (
        <div className="bg-purple-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Thời điểm cao điểm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Tháng/Quý cao điểm</div>
              <div className="text-lg font-bold text-purple-800">
                {timeframe === 1
                  ? `Tháng ${data.peakPeriods.peakMonth || '-'}` 
                  : `Quý ${data.peakPeriods.peakQuarter || '-'}`}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Tăng trưởng so với năm trước</div>
              <div className="text-lg font-bold text-purple-800">
                {data.peakPeriods.yearOverYearGrowth || 0}%
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Chart */}
      <div className="h-64 mb-8 mt-8">
        {chartData && chartData.length > 0 ? (
          <div className="flex h-full items-end">
            {chartData.map((periodData, index) => {
              const maxRevenue = Math.max(...chartData.map(d => d.revenue));
              const revenueHeight = Math.max(5, (periodData.revenue / maxRevenue) * 90);
              const ordersHeight = Math.max(5, (periodData.orders / Math.max(...chartData.map(d => d.orders))) * 90);
              
              const periodLabel = timeframe === 1
                ? months[periodData.period - 1] 
                : quarters[periodData.period - 1];
                
              const prevYearData = data.yearComparison?.find(d => d.period === periodData.period);
              const prevYearHeight = prevYearData 
                ? Math.max(5, (prevYearData.revenue / maxRevenue) * 90)
                : 0;
                
              return (
                <div key={index} className="flex-1 flex justify-center relative">
                  <div className="flex items-end space-x-1 h-full">
                    {/* Revenue bar */}
                    <div 
                      className="w-3 bg-green-500 hover:bg-green-600 transition-all rounded"
                      style={{ height: `${revenueHeight}%` }}
                      title={`Doanh thu: ${formatCurrency(periodData.revenue)}`}
                    ></div>
                    
                    {/* Orders bar */}
                    <div 
                      className="w-3 bg-blue-500 hover:bg-blue-600 transition-all rounded"
                      style={{ height: `${ordersHeight}%` }}
                      title={`Đơn hàng: ${periodData.orders}`}
                    ></div>
                    
                    {/* Previous year comparison */}
                    {prevYearData && (
                      <div 
                        className="w-2 bg-transparent border border-dashed border-gray-400 rounded absolute left-0"
                        style={{ height: `${prevYearHeight}%`, left: '8px' }}
                        title={`Năm trước: ${formatCurrency(prevYearData.revenue)}`}
                      ></div>
                    )}
                  </div>
                  <div className="absolute bottom-0 transform translate-y-full text-xs mt-2">
                    {periodLabel}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu theo mùa</p>
          </div>
        )}
      </div>
      
      {renderLegend()}
      
      {/* Insights and analysis */}
      <div className="border-t border-gray-200 pt-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Phân tích & Đề xuất</h3>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="p-3 bg-purple-50 rounded-md">
            <p className="font-medium text-purple-800 mb-1">Xu hướng theo mùa</p>
            <p>
              {data.peakPeriods?.seasonalInsight || 
                `Doanh số cao nhất trong ${timeframe === 1 ? 'tháng 12 và tháng 6' : 'quý 4 và quý 2'}, 
                khuyến nghị tăng cường chiến dịch marketing và chuẩn bị hàng tồn kho trong những thời điểm này.`}
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-blue-800 mb-1">Chuẩn bị cho mùa cao điểm</p>
            <p>
              {data.peakPeriods?.preparationInsight || 
                `Trong ${timeframe === 1 ? 'tháng 11 và tháng 5' : 'quý 3 và quý 1'} cần chuẩn bị nguồn lực 
                và hàng tồn kho cho mùa cao điểm sắp tới. Xem xét tăng cường nhân viên và cải thiện quy trình xử lý đơn hàng.`}
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-md">
            <p className="font-medium text-green-800 mb-1">Cơ hội tăng trưởng</p>
            <p>
              {data.peakPeriods?.growthInsight || 
                `Những ${timeframe === 1 ? 'tháng' : 'quý'} có doanh số thấp là cơ hội để chạy các chương trình 
                khuyến mãi đặc biệt và chiến dịch tiếp thị để tăng doanh thu.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalTrendsChart;
