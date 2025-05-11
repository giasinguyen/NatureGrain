import { useState, useEffect, useMemo } from 'react';
import { analyticsService, advancedAnalyticsService } from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import BasketAnalysisChart from './BasketAnalysisChart';
import {
  ArrowTrendingUpIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ChartPieIcon,
  FireIcon,
  BanknotesIcon,
  TagIcon,
  UsersIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline';
import { CSVLink } from 'react-csv';
import { 
  optimizeDataset, 
  formatForCSVExport, 
  calculateStatistics, 
  paginateData 
} from '../../utils/analyticsOptimizer';

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

// Custom hook for fetching analytics data
const useAnalyticsData = (dataFetcher, defaultValue = null, deps = []) => {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dataFetcher();
        setData(response.data);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
};

export const SeasonalTrendsChart = () => {
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
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="monthly">Theo tháng</option>
            <option value="quarterly">Theo quý</option>
          </select>
          
          <select 
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
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
                {timeframe === 'monthly' 
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
              
              const periodLabel = timeframe === 'monthly' 
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
                `Doanh số cao nhất trong ${timeframe === 'monthly' ? 'tháng 12 và tháng 6' : 'quý 4 và quý 2'}, 
                khuyến nghị tăng cường chiến dịch marketing và chuẩn bị hàng tồn kho trong những thời điểm này.`}
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-blue-800 mb-1">Chuẩn bị cho mùa cao điểm</p>
            <p>
              {data.peakPeriods?.preparationInsight || 
                `Trong ${timeframe === 'monthly' ? 'tháng 11 và tháng 5' : 'quý 3 và quý 1'} cần chuẩn bị nguồn lực 
                và hàng tồn kho cho mùa cao điểm sắp tới. Xem xét tăng cường nhân viên và cải thiện quy trình xử lý đơn hàng.`}
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-md">
            <p className="font-medium text-green-800 mb-1">Cơ hội tăng trưởng</p>
            <p>
              {data.peakPeriods?.growthInsight || 
                `Những ${timeframe === 'monthly' ? 'tháng' : 'quý'} có doanh số thấp là cơ hội để chạy các chương trình 
                khuyến mãi đặc biệt và chiến dịch tiếp thị để tăng doanh thu.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SalesByHourChart = () => {
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getSalesByHour(),
    { hourlyData: [], peakHours: {}, insights: [] }
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
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu doanh số theo giờ</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ClockIcon className="h-6 w-6 mr-2 text-blue-600" />
          Doanh số theo giờ
        </h2>
      </div>
      
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

export const CustomerInsightsChart = () => {
  const { data, loading, error } = useAnalyticsData(() => 
    analyticsService.getCustomerInsights(), 
    { customers: [], metrics: {} }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu khách hàng</div>;
  
  // Show only top 10 customers by spend for the chart
  const topCustomers = data.customers.slice(0, 10);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2 text-green-500" />
          Phân tích khách hàng
        </h2>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-gray-500 mb-1">Tổng số khách hàng</div>
          <div className="text-xl font-bold text-gray-900">{data.metrics.totalCustomers}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-sm text-gray-500 mb-1">Chi tiêu trung bình / khách hàng</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.metrics.avgSpentPerCustomer || 0)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-sm text-gray-500 mb-1">Giá trị đơn hàng trung bình</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.metrics.avgOrderValue || 0)}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-4">Top 10 khách hàng</h3>
      
      {/* Chart showing top customers by spend */}
      <div className="relative h-64 mb-6">
        {topCustomers.length > 0 ? (
          <div className="flex h-full items-end">
            {topCustomers.map((customer, index) => {
              const maxSpent = Math.max(...topCustomers.map(c => c.totalSpent));
              const height = (customer.totalSpent / maxSpent * 100);
              return (
                <div key={index} className="flex flex-col items-center justify-end flex-1">
                  <div 
                    className="bg-green-500 hover:bg-green-600 transition-all rounded-t w-4/5" 
                    style={{height: `${height}%`}}
                    title={`${customer.username}: ${formatCurrency(customer.totalSpent)}`}
                  ></div>
                  <div className="text-xs mt-1 truncate w-full text-center">{customer.username}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu khách hàng</p>
          </div>
        )}
      </div>
      
      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng chi tiêu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chi tiêu TB / đơn hàng
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topCustomers.map((customer, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{customer.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.orderCount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(customer.totalSpent)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(customer.totalSpent / customer.orderCount)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const DateRangeAnalysis = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [csvData, setCsvData] = useState([]);

  const { data, loading, error } = useAnalyticsData(() => 
    analyticsService.getSalesByDateRange(startDate, endDate), 
    { data: [], summary: {} }
  );

  useEffect(() => {
    if (data && data.data) {
      // Format data for CSV export
      const formattedData = data.data.map(item => ({
        Date: item.date,
        Quantity: item.quantity,
        Revenue: item.revenue
      }));
      setCsvData(formattedData);
    }
  }, [data]);

  const handleDateSubmit = (e) => {
    e.preventDefault();
    // The data will be refetched automatically via the useEffect in useAnalyticsData
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu phân tích theo ngày</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <CalendarIcon className="h-6 w-6 mr-2 text-orange-500" />
          Phân tích theo khoảng thời gian
        </h2>
        
        <CSVLink 
          data={csvData} 
          filename={"sales_report.csv"}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Tải xuống CSV
        </CSVLink>
      </div>

      {/* Date range selection form */}
      <form onSubmit={handleDateSubmit} className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">Ngày bắt đầu</label>
          <input 
            type="date" 
            id="startDate"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">Ngày kết thúc</label>
          <input 
            type="date" 
            id="endDate"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-end">
          <button 
            type="submit" 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Áp dụng
          </button>
        </div>
      </form>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-gray-500 mb-1">Tổng số lượng bán</div>
          <div className="text-xl font-bold text-gray-900">{data.summary?.totalQuantity || 0}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-sm text-gray-500 mb-1">Tổng doanh thu</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.summary?.totalRevenue || 0)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-sm text-gray-500 mb-1">Doanh thu trung bình / ngày</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.summary?.avgDailyRevenue || 0)}
          </div>
        </div>
      </div>

      {/* Line chart showing revenue trends */}
      <div className="relative h-64">
        {data.data && data.data.length > 0 ? (
          <div className="flex h-full items-end">
            {data.data.map((dayData, index) => {
              const maxRevenue = Math.max(...data.data.map(d => d.revenue));
              const height = (dayData.revenue / maxRevenue * 90);
              return (
                <div key={index} className="flex flex-col items-center justify-end flex-1">
                  <div 
                    className="bg-blue-500 hover:bg-blue-600 transition-all rounded-t w-4/5" 
                    style={{height: `${height}%`}}
                    title={`${dayData.date}: ${formatCurrency(dayData.revenue)}`}
                  ></div>
                  <div className="text-xs mt-1 truncate w-full text-center">
                    {
                      new Date(dayData.date).toLocaleDateString('vi-VN', {
                        month: 'numeric',
                        day: 'numeric'
                      })
                    }
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu trong khoảng thời gian đã chọn</p>
          </div>
        )}
      </div>
      
      {/* Data table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data && data.data.length > 0 ? data.data.map((day, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                  {new Date(day.date).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{day.quantity}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(day.revenue)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const OrderProcessingTimeAnalysis = () => {
  const { data, loading, error } = useAnalyticsData(() => 
    analyticsService.getOrderProcessingTime(), 
    {}
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu thời gian xử lý</div>;

  const hours = data.averageProcessingHours || 0;
  const days = data.averageProcessingDays || 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-blue-500" />
          Phân tích thời gian xử lý đơn hàng
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Processing time visual */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 rounded-full border-8 border-gray-200 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-blue-500" 
                style={{height: `${Math.min(100, (hours / 72) * 100)}%`}}
              ></div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{hours.toFixed(1)}</div>
              <div className="text-sm text-gray-500">giờ</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900">{days.toFixed(1)} ngày</div>
            <div className="text-sm text-gray-500">Thời gian xử lý trung bình</div>
          </div>
        </div>

        {/* Processing time breakdown */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Thông tin chi tiết</h3>
            <p className="text-gray-600 mt-1">
              Thời gian xử lý đơn hàng được tính từ lúc khách hàng đặt hàng đến khi đơn hàng được đánh dấu là hoàn thành.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500">Thời gian xử lý (giờ)</div>
              <div className="text-xl font-bold text-gray-900">
                {hours.toFixed(1)} giờ
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500">Thời gian xử lý (ngày)</div>
              <div className="text-xl font-bold text-gray-900">
                {days.toFixed(1)} ngày
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-gray-500">Đánh giá hiệu suất</div>
              <div className="text-xl font-bold text-gray-900">
                {hours <= 24 ? 'Rất tốt' : hours <= 48 ? 'Tốt' : hours <= 72 ? 'Trung bình' : 'Cần cải thiện'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SalesTrendsAnalysis = () => {
  const { data, loading, error } = useAnalyticsData(() => 
    advancedAnalyticsService.getSalesTrends(), 
    { data: [], summary: {} }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu xu hướng doanh số</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-red-500" />
          Phân tích xu hướng doanh số
        </h2>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-gray-500 mb-1">Tổng doanh thu</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.summary?.totalRevenue || 0)}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-sm text-gray-500 mb-1">Doanh thu trung bình / tháng</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.summary?.avgMonthlyRevenue || 0)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-sm text-gray-500 mb-1">Tăng trưởng doanh thu</div>
          <div className="text-xl font-bold text-gray-900">
            {data.summary?.revenueGrowthRate} %
          </div>
        </div>
      </div>

      {/* Line chart showing sales trends over time */}
      <div className="relative h-64 mb-6">
        {data.data && data.data.length > 0 ? (
          <div className="flex h-full items-end">
            {data.data.map((monthData, index) => {
              const maxRevenue = Math.max(...data.data.map(d => d.revenue));
              const height = (monthData.revenue / maxRevenue * 90);
              return (
                <div key={index} className="flex flex-col items-center justify-end flex-1">
                  <div 
                    className="bg-red-500 hover:bg-red-600 transition-all rounded-t w-4/5" 
                    style={{height: `${height}%`}}
                    title={`${monthData.month}: ${formatCurrency(monthData.revenue)}`}
                  ></div>
                  <div className="text-xs mt-1 truncate w-full text-center">{new Date(monthData.month).toLocaleString('default', { month: 'short' })}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu xu hướng doanh số</p>
          </div>
        )}
      </div>
      
      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tháng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh thu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tăng trưởng
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data && data.data.length > 0 ? data.data.map((month, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(month.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(month.revenue)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {month.growthRate} %
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const DayHourHeatmapChart = () => {
  const [metric, setMetric] = useState(1); // Use numeric value 1 for 'orders'
  
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getDayHourHeatmap(metric),
    { heatmapData: [], peakTimes: {}, summary: {} },
    [metric]
  );

  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate color based on intensity
  const getHeatColor = (intensity) => {
    if (intensity >= 0.8) return 'bg-red-600';
    if (intensity >= 0.6) return 'bg-red-500';
    if (intensity >= 0.4) return 'bg-orange-400';
    if (intensity >= 0.2) return 'bg-yellow-300';
    return 'bg-green-200';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu biểu đồ nhiệt</div>;

  // Organize data by day and hour
  const heatmapByDayAndHour = {};
  if (data.heatmapData) {
    data.heatmapData.forEach(item => {
      if (!heatmapByDayAndHour[item.day]) {
        heatmapByDayAndHour[item.day] = {};
      }
      heatmapByDayAndHour[item.day][item.hour] = item;
    });
  }
  
  // Find max value for normalization
  const maxValue = data.heatmapData && data.heatmapData.length > 0
    ? Math.max(...data.heatmapData.map(item => item.value))
    : 1;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FireIcon className="h-6 w-6 mr-2 text-red-500" />
          Biểu đồ nhiệt theo ngày và giờ
        </h2>
        
        <div className="mt-4 md:mt-0">
          <label className="text-sm text-gray-500 block mb-1">Chỉ số đo</label>
          <select 
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            <option value="orders">Số đơn hàng</option>
            <option value="revenue">Doanh thu</option>
            <option value="visitors">Số lượt truy cập</option>
          </select>
        </div>
      </div>

      {/* Peak times summary */}
      {data.peakTimes && (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Thời gian cao điểm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Ngày trong tuần</div>
              <div className="text-lg font-bold text-red-800">
                {data.peakTimes.peakDay === 0 ? 'Chủ nhật' : `Thứ ${data.peakTimes.peakDay + 1}`}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Giờ cao điểm</div>
              <div className="text-lg font-bold text-red-800">
                {data.peakTimes.peakHour}:00 - {data.peakTimes.peakHour + 1}:00
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap */}
      <div className="overflow-x-auto mb-6">
        <div className="min-w-max">
          <div className="flex">
            <div className="w-12"></div>
            {daysOfWeek.map((day, index) => (
              <div key={index} className="flex-1 text-center font-medium text-sm text-gray-700 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {hoursOfDay.map(hour => (
            <div key={hour} className="flex">
              <div className="w-12 text-right pr-2 text-xs font-medium text-gray-600 py-2 flex items-center justify-end">
                {hour}:00
              </div>
              
              {daysOfWeek.map((_, dayIndex) => {
                const dayData = heatmapByDayAndHour[dayIndex];
                const hourData = dayData && dayData[hour];
                const intensity = hourData ? hourData.value / maxValue : 0;
                const value = hourData ? hourData.value : 0;
                
                const isPeak = data.peakTimes && 
                  data.peakTimes.peakDay === dayIndex && 
                  data.peakTimes.peakHour === hour;
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`flex-1 flex items-center justify-center
                      ${isPeak ? 'ring-2 ring-red-600' : ''}
                    `}
                  >
                    <div 
                      className={`w-full h-6 ${getHeatColor(intensity)} 
                        border border-white flex items-center justify-center text-xs
                        ${intensity > 0.5 ? 'text-white' : 'text-gray-800'}
                      `}
                      title={`${daysOfWeek[dayIndex]} ${hour}:00 - ${value} ${
                        metric === 'orders' ? 'đơn hàng' : 
                        metric === 'revenue' ? 'doanh thu' : 'lượt truy cập'
                      }`}
                    >
                      {intensity > 0.2 ? value : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-1 items-center mb-6">
        <span className="text-xs text-gray-500">Thấp</span>
        <div className="flex">
          <div className="w-6 h-6 bg-green-200"></div>
          <div className="w-6 h-6 bg-yellow-300"></div>
          <div className="w-6 h-6 bg-orange-400"></div>
          <div className="w-6 h-6 bg-red-500"></div>
          <div className="w-6 h-6 bg-red-600"></div>
        </div>
        <span className="text-xs text-gray-500">Cao</span>
      </div>

      {/* Insights */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Phân tích & Đề xuất</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="p-3 bg-red-50 rounded-md">
            <p className="font-medium text-red-800 mb-1">Đề xuất về nhân sự</p>
            <p>
              {data.summary?.staffingInsight || 
                `Đảm bảo đủ nhân viên vào thời gian cao điểm là ${data.peakTimes?.peakDay === 0 ? 'Chủ nhật' : `Thứ ${data.peakTimes?.peakDay + 1}`} 
                từ ${data.peakTimes?.peakHour}:00 đến ${data.peakTimes?.peakHour + 1}:00. Cân nhắc tăng cường nhân sự hỗ trợ khách hàng trong khung giờ này.`}
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-blue-800 mb-1">Đề xuất marketing</p>
            <p>
              {data.summary?.marketingInsight || 
                `Tập trung chiến dịch marketing vào các khung giờ thấp điểm để phân bổ đều lượng đơn hàng. 
                Cân nhắc gửi email marketing vào thời điểm có tỷ lệ mở cao nhất, thường là buổi sáng.`}
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-md">
            <p className="font-medium text-green-800 mb-1">Đề xuất vận hành</p>
            <p>
              {data.summary?.operationalInsight || 
                `Lên kế hoạch vận hành, đóng gói và giao hàng dựa trên mô hình đơn hàng theo ngày trong tuần. 
                Cân nhắc điều chỉnh lịch trình nhập hàng và xử lý đơn hàng dựa trên dữ liệu biểu đồ nhiệt.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FunnelAnalysisChart = () => {
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getFunnelAnalysis(),
    { stages: [], summary: {}, insights: [] }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu phân tích phễu</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-indigo-500" />
          Phân tích phễu chuyển đổi
        </h2>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Tỷ lệ chuyển đổi tổng thể</div>
          <div className="text-2xl font-bold text-gray-800">{data.summary?.overallConversionRate?.toFixed(2) || 0}%</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Giá trị đơn hàng trung bình</div>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(data.summary?.averageOrderValue || 0)}</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Tỷ lệ hoàn thành thanh toán</div>
          <div className="text-2xl font-bold text-gray-800">{data.summary?.checkoutCompletionRate?.toFixed(2) || 0}%</div>
        </div>
      </div>

      {/* Funnel visualization */}
      <div className="py-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-8 text-center">Phễu chuyển đổi</h3>
        
        {data.stages && data.stages.length > 0 ? (
          <div className="space-y-4">
            {data.stages.map((stage, index) => {
              const nextStage = data.stages[index + 1];
              const dropoffRate = nextStage ? ((stage.visitors - nextStage.visitors) / stage.visitors * 100).toFixed(1) : 0;
              const conversionRate = nextStage ? ((nextStage.visitors / stage.visitors) * 100).toFixed(1) : 100;
              
              return (
                <div key={index} className="relative">
                  {/* Stage bar */}
                  <div 
                    className="bg-indigo-500 text-white p-4 rounded-lg text-center"
                    style={{ width: `${Math.max(20, stage.percentage)}%` }}
                  >
                    <div className="font-semibold">{stage.name}</div>
                    <div className="text-sm opacity-90">{stage.visitors.toLocaleString()} lượt</div>
                  </div>
                  
                  {/* Dropoff arrow and conversion rate */}
                  {nextStage && (
                    <div className="flex items-center justify-center my-2">
                      <div className="text-sm text-gray-600">{dropoffRate}% rời bỏ</div>
                      <div className="mx-2 w-1 h-6 bg-gray-300"></div>
                      <div className="text-sm font-medium text-indigo-600">{conversionRate}% chuyển đổi</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Không có dữ liệu phễu chuyển đổi
          </div>
        )}
      </div>

      {/* Insights & Recommendations */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Phân tích & Đề xuất</h3>
        
        <div className="space-y-4">
          {data.insights && data.insights.map((insight, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">{insight.title}</p>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <h4 className="font-medium text-yellow-800 mb-2">Điểm cần cải thiện</h4>
              <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                <li>Trang sản phẩm đến giỏ hàng: {data.summary?.highestDropoffStage === 'cart' ? 
                  'Cải thiện UX, thêm CTA rõ ràng' : 'Tối ưu'}</li>
                <li>Giỏ hàng đến thanh toán: {data.summary?.highestDropoffStage === 'checkout' ? 
                  'Đơn giản hóa quy trình thanh toán' : 'Tối ưu'}</li>
                <li>Thanh toán đến hoàn thành: {data.summary?.highestDropoffStage === 'purchase' ? 
                  'Kiểm tra lỗi thanh toán, cải thiện UX' : 'Tối ưu'}</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium text-green-800 mb-2">Cơ hội tăng trưởng</h4>
              <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                <li>Tăng {data.summary?.potentialRevenueLift || 10}% doanh thu bằng cách cải thiện tỷ lệ chuyển đổi</li>
                <li>Thu hút người dùng quay lại với email nhắc nhở giỏ hàng</li>
                <li>Tối ưu hóa trải nghiệm trên thiết bị di động để tăng chuyển đổi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderCompletionRateChart = () => {
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getOrderCompletionRates(),
    { stages: [], byDevice: [], summary: {} }
  );

  // Find the stage with the highest dropoff - moved before conditional returns
  const highestDropoffStage = useMemo(() => {
    if (!data.stages || data.stages.length < 2) return null;
    
    let maxDropoff = 0;
    let stage = null;
    
    for (let i = 1; i < data.stages.length; i++) {
      const dropoff = data.stages[i-1].rate - data.stages[i].rate;
      if (dropoff > maxDropoff) {
        maxDropoff = dropoff;
        stage = data.stages[i].name;
      }
    }
    
    return { stage, dropoff: maxDropoff };
  }, [data.stages]);
  
  // Using a variable with underscore prefix to indicate it's an intentionally unused value
  // This silences the eslint warning while maintaining the hook order
  const _unusedDropoffStage = highestDropoffStage;

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu hoàn thành đơn hàng</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-green-500" />
          Phân tích tỷ lệ hoàn thành đơn hàng
        </h2>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Tỷ lệ hoàn thành đơn hàng</div>
          <div className="text-2xl font-bold text-gray-800">
            {data.summary?.orderCompletionRate?.toFixed(2) || 0}%
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Tỷ lệ rời bỏ trung bình</div>
          <div className="text-2xl font-bold text-gray-800">
            {data.summary?.averageDropoffRate?.toFixed(2) || 0}%
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Doanh thu tiềm năng mất mát</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(data.summary?.potentialLostRevenue || 0)}
          </div>
        </div>
      </div>

      {/* Funnel chart */}
      <div className="mb-6">
        {data.stages && data.stages.length > 0 ? (
          <div className="space-y-4">
            {data.stages.map((stage, index) => {
              const nextStage = data.stages[index + 1];
              const dropoffRate = nextStage ? ((stage.rate - nextStage.rate) / stage.rate * 100).toFixed(1) : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">{stage.name}</div>
                    <div className="h-2.5 bg-gray-200 rounded-full">
                      <div 
                        className="h-2.5 rounded-full bg-green-600"
                        style={{ width: `${stage.rate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {nextStage && (
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-500">{dropoffRate}%</div>
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Không có dữ liệu phân tích tỷ lệ hoàn thành đơn hàng
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Phân tích & Đề xuất</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="p-3 bg-green-50 rounded-md">
            <p className="font-medium text-green-800 mb-1">Tối ưu hóa tỷ lệ hoàn thành</p>
            <p>
              {data.summary?.optimizationInsight || 
                "Tập trung vào việc giảm tỷ lệ rời bỏ giữa các bước trong quy trình đặt hàng. Cải thiện trải nghiệm người dùng và giảm thiểu các bước không cần thiết."}
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-blue-800 mb-1">Cơ hội tăng trưởng doanh thu</p>
            <p>
              {data.summary?.growthOpportunity || 
                "Tăng cường tiếp thị và khuyến mãi cho những khách hàng có khả năng quay lại cao. Sử dụng email nhắc nhở và ưu đãi đặc biệt để kích thích đơn hàng."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RfmAnalysisChart = () => {
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getRfmAnalysis(),
    { rfmData: [], segments: [], summary: {} }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu phân tích RFM</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <TagIcon className="h-6 w-6 mr-2 text-orange-500" />
          Phân tích RFM
        </h2>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Tổng số khách hàng</div>
          <div className="text-xl font-bold text-gray-900">{data.summary?.totalCustomers}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Doanh thu trung bình / khách hàng</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.summary?.avgRevenuePerCustomer || 0)}
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Tỉ lệ giữ chân khách hàng</div>
          <div className="text-xl font-bold text-gray-900">
            {data.summary?.retentionRate} %
          </div>
        </div>
      </div>

      {/* RFM Segmentation Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Phân khúc khách hàng theo RFM</h3>
        
        {data.segments && data.segments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.segments.map((segment, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-800">{segment.name}</div>
                <div className="text-xs text-gray-500 mt-1">R: {segment.recency} | F: {segment.frequency} | M: {formatCurrency(segment.monetary)}</div>
                <div className="mt-2 flex justify-between">
                  <span className="text-xs text-gray-600">
                    {segment.customerCount} khách hàng
                  </span>
                  <span className="text-xs text-gray-600">
                    {formatCurrency(segment.totalRevenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Không có dữ liệu phân khúc khách hàng
          </div>
        )}
      </div>
      
      {/* Insights */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Phân tích & Đề xuất</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="p-3 bg-orange-50 rounded-md">
            <p className="font-medium text-orange-800 mb-1">Cơ hội tăng trưởng</p>
            <p>
              {data.summary?.growthOpportunity || 
                `Tập trung vào nhóm khách hàng có tần suất mua hàng thấp nhưng giá trị đơn hàng cao. 
                Xem xét các chương trình khuyến mãi để kích thích mua sắm thường xuyên hơn.`}
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-blue-800 mb-1">Giữ chân khách hàng</p>
            <p>
              {data.summary?.retentionInsight || 
                `Những khách hàng có tần suất mua hàng cao trong quá khứ nhưng giảm sút gần đây cần được chú ý đặc biệt. 
                Cân nhắc các chiến dịch email nhắc nhở và ưu đãi đặc biệt để giữ chân họ.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdvancedAnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RfmAnalysisChart />
        {/* Using imported BasketAnalysisChart */}
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
    </div>
  );
};

// User Cohort Analysis Chart component
export const UserCohortAnalysisChart = () => {
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getUserCohortData(),
    { cohorts: [], retentionMatrix: [] }
  );

  // Prepare data for visualization - moved before conditional returns
  const cohortData = useMemo(() => {
    if (!data || !data.retentionMatrix || data.retentionMatrix.length === 0) {
      return [];
    }
    return data.retentionMatrix.map((row, i) => ({
      name: `Cohort ${data.cohorts?.[i]?.name || i + 1}`,
      ...row.reduce((acc, val, j) => {
        acc[`Month ${j}`] = val;
        return acc;
      }, {})
    }));
  }, [data]);

  // Format for CSV export - moved before conditional returns
  const exportData = useMemo(() => {
    if (!cohortData.length) return [];
    return formatForCSVExport(cohortData, 'User Cohort Analysis');
  }, [cohortData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error loading cohort analysis data</div>;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center">
            <UserGroupIcon className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Phân tích đoàn hệ khách hàng</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi tỷ lệ giữ chân khách hàng theo thời gian sau lần mua đầu tiên
          </p>
        </div>
        <div className="flex space-x-2">
          <CSVLink 
            data={exportData}
            filename="user_cohort_analysis.csv"
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
            <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
            Xuất CSV
          </CSVLink>
        </div>
      </div>

      {cohortData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cohort
                </th>
                {Object.keys(cohortData[0])
                  .filter(key => key !== 'name')
                  .map(month => (
                    <th key={month} className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {month}
                    </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cohortData.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.name}
                  </td>
                  {Object.keys(row)
                    .filter(key => key !== 'name')
                    .map(month => (
                      <td key={month} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <div 
                          className="px-2 py-1 rounded-md text-center"
                          style={{
                            backgroundColor: `rgba(79, 70, 229, ${Math.min(row[month] / 100, 1)})`,
                            color: row[month] > 50 ? 'white' : 'black'
                          }}
                        >
                          {row[month].toFixed(1)}%
                        </div>
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>Không có dữ liệu phân tích đoàn hệ</p>
        </div>
      )}

      {data.insights && (
        <div className="mt-6 bg-indigo-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-indigo-800 mb-2">Insights:</h4>
          <p className="text-sm text-indigo-700">{data.insights}</p>
        </div>
      )}
    </div>
  );
};

// Customer Lifetime Value Chart component
export const CustomerLifetimeValueChart = () => {
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getCustomerLifetimeValue(),
    { segments: [], averages: {} }
  );

  // Format for CSV export - moved before conditional returns
  const exportData = useMemo(() => {
    if (!data || !data.segments || data.segments.length === 0) return [];
    return formatForCSVExport(data.segments, 'Customer Lifetime Value');
  }, [data]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error loading CLV data</div>;

  // Chart colors
  const segmentColors = [
    'rgba(79, 70, 229, 0.8)',  // Indigo
    'rgba(16, 185, 129, 0.8)', // Green
    'rgba(245, 158, 11, 0.8)', // Amber
    'rgba(239, 68, 68, 0.8)',  // Red
    'rgba(56, 189, 248, 0.8)'  // Light Blue
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center">
            <BanknotesIcon className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Giá trị vòng đời khách hàng (CLV)</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Phân tích giá trị vòng đời khách hàng theo phân khúc
          </p>
        </div>
        <div className="flex space-x-2">
          <CSVLink 
            data={exportData}
            filename="customer_lifetime_value.csv"
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
            <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
            Xuất CSV
          </CSVLink>
        </div>
      </div>

      {data.segments && data.segments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="h-80 relative">
              <div className="absolute inset-0">
                <div className="flex h-full">
                  {data.segments.map((segment, index) => (
                    <div
                      key={index}
                      className="h-full relative group"
                      style={{
                        width: `${(segment.customers / data.totalCustomers * 100)}%`,
                        backgroundColor: segmentColors[index % segmentColors.length],
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 text-transparent group-hover:text-white p-2 transition-all duration-300">
                        <div className="text-xs font-medium">{segment.name}</div>
                        <div className="text-xs">{formatCurrency(segment.averageClv)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <div>Thấp hơn</div>
              <div>Giá trị vòng đời khách hàng</div>
              <div>Cao hơn</div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tổng quan phân khúc CLV</h4>
                <ul className="space-y-3">
                  {data.segments.map((segment, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: segmentColors[index % segmentColors.length] }}
                        ></span>
                        {segment.name}
                      </div>
                      <div className="font-medium">{formatCurrency(segment.averageClv)}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Số liệu chính</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600">CLV trung bình:</span>
                    <span className="font-medium">{formatCurrency(data.averages?.overall || 0)}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600">CLV cao nhất:</span>
                    <span className="font-medium">{formatCurrency(data.averages?.highest || 0)}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-600">Khách hàng có giá trị cao:</span>
                    <span className="font-medium">{data.highValuePercentage || 0}%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>Không có dữ liệu về giá trị vòng đời khách hàng</p>
        </div>
      )}

      {data.recommendations && (
        <div className="mt-6 bg-indigo-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-indigo-800 mb-2">Đề xuất:</h4>
          <p className="text-sm text-indigo-700">{data.recommendations}</p>
        </div>
      )}
    </div>
  );
};

// Category Performance Chart component
export const CategoryPerformanceChart = () => {
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getCategoryPerformance(),
    { categories: [] }
  );

  // Format for CSV export - Must be called before any conditional returns
  const exportData = useMemo(() => {
    if (!data || !data.categories || data.categories.length === 0) return [];
    return formatForCSVExport(data.categories.map(cat => ({
      category: cat.name,
      revenue: cat.revenue,
      orders: cat.orders,
      averageOrderValue: cat.averageOrderValue,
      growth: cat.growth,
    })), 'Category Performance');
  }, [data]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error loading category performance data</div>;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center">
            <TagIcon className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Hiệu suất danh mục sản phẩm</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Phân tích hiệu suất của các danh mục sản phẩm khác nhau
          </p>
        </div>
        <div className="flex space-x-2">
          <CSVLink 
            data={exportData}
            filename="category_performance.csv"
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
            <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
            Xuất CSV
          </CSVLink>
        </div>
      </div>

      {data.categories && data.categories.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị đơn hàng TB
                </th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tăng trưởng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.categories.map((category, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: category.color || '#4f46e5' }}></div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(category.revenue)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {category.orders.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(category.averageOrderValue)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className={`flex items-center ${category.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="font-medium">{category.growth > 0 ? '+' : ''}{category.growth}%</span>
                      <div className="ml-2">
                        {category.growth >= 0 ? (
                          <ArrowTrendingUpIcon className="h-4 w-4" />
                        ) : (
                          <ArrowTrendingUpIcon className="h-4 w-4 transform rotate-180" />
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Performance visualization */}
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Phân bố doanh thu theo danh mục</h4>
            <div className="h-8 flex rounded-md overflow-hidden">
              {data.categories.map((category, index) => (
                <div
                  key={index}
                  className="h-full relative group"
                  style={{
                    width: `${(category.revenue / data.totalRevenue * 100)}%`,
                    backgroundColor: category.color || '#4f46e5',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-70 text-white text-xs transition-opacity">
                    {Math.round(category.revenue / data.totalRevenue * 100)}%
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <div>0%</div>
              <div>Phần trăm doanh thu</div>
              <div>100%</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>Không có dữ liệu về hiệu suất danh mục</p>
        </div>
      )}

      {data.insights && (
        <div className="mt-6 bg-indigo-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-indigo-800 mb-2">Insights:</h4>
          <p className="text-sm text-indigo-700">{data.insights}</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
