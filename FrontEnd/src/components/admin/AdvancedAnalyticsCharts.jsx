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
  UsersIcon
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

export const SalesByHourChart = () => {
  const { data, loading, error } = useAnalyticsData(() => 
    analyticsService.getSalesByHour(), 
    []
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu biểu đồ theo giờ</div>;
  
  // Format data for display
  const chartData = data.map(hourData => ({
    hour: `${hourData.hour}:00`,
    orderCount: hourData.orderCount,
    revenue: hourData.revenue
  }));

  // Find peak hours
  const peakRevenue = [...chartData].sort((a, b) => b.revenue - a.revenue)[0];
  const peakOrders = [...chartData].sort((a, b) => b.orderCount - a.orderCount)[0];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ClockIcon className="h-6 w-6 mr-2 text-indigo-500" />
          Doanh số theo giờ trong ngày
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-gray-500 mb-1">Giờ cao điểm (đơn hàng)</div>
          <div className="text-xl font-bold text-gray-900">
            {peakOrders ? peakOrders.hour : 'N/A'} 
            <span className="ml-2 text-base font-normal text-blue-600">
              ({peakOrders ? peakOrders.orderCount : 0} đơn hàng)
            </span>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-sm text-gray-500 mb-1">Giờ cao điểm (doanh thu)</div>
          <div className="text-xl font-bold text-gray-900">
            {peakRevenue ? peakRevenue.hour : 'N/A'} 
            <span className="ml-2 text-base font-normal text-green-600">
              ({formatCurrency(peakRevenue ? peakRevenue.revenue : 0)})
            </span>
          </div>
        </div>
      </div>

      {/* Chart visualization - bar chart showing hourly distribution */}
      <div className="relative h-64">
        {chartData.length > 0 ? (
          <div className="flex h-full items-end justify-around">
            {chartData.map((hourData, index) => {
              const maxRevenue = Math.max(...chartData.map(d => d.revenue));
              const height = hourData.revenue / maxRevenue * 100;
              return (
                <div key={index} className="flex flex-col items-center justify-end w-full">
                  <div 
                    className="bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t w-4/5" 
                    style={{height: `${height}%`}}
                    title={`${formatCurrency(hourData.revenue)}`}
                  ></div>
                  <div className="text-xs mt-1 rotate-45 origin-top-left translate-x-2">{hourData.hour}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu khả dụng</p>
          </div>
        )}
      </div>
      
      {/* Data table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giờ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh thu
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chartData.map((hourData, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                  {hourData.hour}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                  {hourData.orderCount}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(hourData.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  <div className="text-xs mt-1 truncate w-full text-center">{
                    new Date(dayData.date).toLocaleDateString('vi-VN', {
                      month: 'numeric',
                      day: 'numeric'
                    })
                  }</div>
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

export const ProductPerformanceAnalysis = () => {
  const { data, loading, error } = useAnalyticsData(() => 
    advancedAnalyticsService.getProductPerformance(), 
    { data: [], summary: {} }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu hiệu suất sản phẩm</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <TagIcon className="h-6 w-6 mr-2 text-purple-500" />
          Phân tích hiệu suất sản phẩm
        </h2>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-gray-500 mb-1">Tổng số sản phẩm bán được</div>
          <div className="text-xl font-bold text-gray-900">{data.summary.totalUnitsSold}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-sm text-gray-500 mb-1">Doanh thu từ sản phẩm</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.summary.totalRevenue || 0)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-sm text-gray-500 mb-1">Lợi nhuận gộp</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.summary.grossProfit || 0)}
          </div>
        </div>
      </div>

      {/* Bar chart showing product performance */}
      <div className="relative h-64 mb-6">
        {data.data && data.data.length > 0 ? (
          <div className="flex h-full items-end">
            {data.data.map((product, index) => {
              const maxRevenue = Math.max(...data.data.map(p => p.revenue));
              const height = (product.revenue / maxRevenue * 90);
              return (
                <div key={index} className="flex flex-col items-center justify-end flex-1">
                  <div 
                    className="bg-purple-500 hover:bg-purple-600 transition-all rounded-t w-4/5" 
                    style={{height: `${height}%`}}
                    title={`${product.name}: ${formatCurrency(product.revenue)}`}
                  ></div>
                  <div className="text-xs mt-1 truncate w-full text-center">{product.name}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu hiệu suất sản phẩm</p>
          </div>
        )}
      </div>
      
      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh thu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lợi nhuận gộp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data && data.data.length > 0 ? data.data.map((product, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.unitsSold}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(product.revenue)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(product.grossProfit)}</div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RfmAnalysisChart = () => {
  const { data, loading, error } = useAnalyticsData(
    advancedAnalyticsService.getRfmAnalysis, 
    { customers: [], segmentCounts: {}, averages: {} }
  );
  
  const [csvData, setCsvData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  // Use useMemo to avoid unnecessary recalculations
  const customerStats = useMemo(() => {
    if (data && data.customers && data.customers.length > 0) {
      return calculateStatistics(data.customers, 'monetaryValue');
    }
    return { min: 0, max: 0, average: 0, total: 0, median: 0 };
  }, [data]);
  
  // Use paginateData for efficient display of large datasets
  const paginatedCustomers = useMemo(() => {
    if (data && data.customers) {
      return paginateData(data.customers, currentPage, pageSize);
    }
    return [];
  }, [data, currentPage]);

  useEffect(() => {
    if (data && data.customers) {
      // Use formatForCSVExport for efficient CSV data preparation
      const fieldMap = {
        username: 'Username',
        segment: 'Segment',
        recencyDays: 'Recency (Days)',
        frequency: 'Frequency (Orders)',
        monetaryValue: 'Monetary Value (VND)',
        rScore: 'R Score',
        fScore: 'F Score',
        mScore: 'M Score'
      };
      
      // Optimize for large datasets
      const optimizedData = data.customers.length > 1000 
        ? optimizeDataset(data.customers, 1000) 
        : data.customers;
        
      setCsvData(formatForCSVExport(optimizedData, fieldMap));
    }
  }, [data]);
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu phân tích RFM</div>;

  const segmentColors = {
    VIP: 'bg-purple-600',
    Loyal: 'bg-blue-600',
    'Big Spender': 'bg-green-600',
    Recent: 'bg-yellow-500',
    Regular: 'bg-gray-500',
    'At Risk': 'bg-red-500'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2 text-blue-500" />
          Phân tích RFM Khách hàng
        </h2>
        
        <CSVLink 
          data={csvData} 
          filename={"rfm_analysis.csv"}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Xuất CSV
        </CSVLink>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Phân khúc khách hàng</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(data.segmentCounts || {}).map(([segment, count]) => (
            <div key={segment} className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${segmentColors[segment] || 'bg-gray-400'} mr-2`}></div>
              <span>{segment}: <strong>{count}</strong></span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Recency (Gần đây)</span>
            <ClockIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-xl font-bold">{Math.round(data.averages?.avgRecencyDays || 0)} ngày</div>
          <div className="text-sm text-gray-600">Trung bình từ đơn hàng gần nhất</div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Frequency (Tần suất)</span>
            <CalendarIcon className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-xl font-bold">{data.averages?.avgFrequency?.toFixed(1) || 0} đơn</div>
          <div className="text-sm text-gray-600">Trung bình số đơn hàng</div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Monetary (Giá trị)</span>
            <BanknotesIcon className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex flex-col">
            <div className="text-xl font-bold">{formatCurrency(data.averages?.avgMonetaryValue || 0)}</div>
            <div className="text-sm text-gray-600">Chi tiêu trung bình</div>
            <div className="mt-2 text-xs text-gray-500">
              <div>Trung vị: {formatCurrency(customerStats.median)}</div>
              <div>Cao nhất: {formatCurrency(customerStats.max)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h3 className="font-semibold mb-2">Khách hàng tiêu biểu theo phân khúc</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phân khúc</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recency (Ngày)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency (Đơn)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monetary (VND)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCustomers.map((customer, index) => (
              <tr key={customer.userId || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2">{customer.username}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    segmentColors[customer.segment] ? 
                      `${segmentColors[customer.segment].replace('bg-', 'bg-opacity-25 ')} ${segmentColors[customer.segment].replace('bg-', 'text-')}` : 
                      'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.segment}
                  </span>
                </td>
                <td className="px-4 py-2">{customer.recencyDays}</td>
                <td className="px-4 py-2">{customer.frequency}</td>
                <td className="px-4 py-2">{formatCurrency(customer.monetaryValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        {data.customers && data.customers.length > pageSize && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Hiển thị {currentPage * pageSize + 1} đến {Math.min((currentPage + 1) * pageSize, data.customers.length)} 
              trong số {data.customers.length} khách hàng
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className={`px-3 py-1 rounded ${
                  currentPage === 0 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(prev => (prev + 1) * pageSize < data.customers.length ? prev + 1 : prev)}
                disabled={(currentPage + 1) * pageSize >= data.customers.length}
                className={`px-3 py-1 rounded ${
                  (currentPage + 1) * pageSize >= data.customers.length 
                    ? 'bg-gray-200 text-gray-500' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CustomerLifetimeValueChart = () => {
  const { data, loading, error } = useAnalyticsData(
    advancedAnalyticsService.getCustomerLifetimeValue,
    { customers: [], summary: {} }
  );
  
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    if (data && data.customers) {
      // Format data for CSV export
      const formattedData = data.customers.map(customer => ({
        Username: customer.username,
        'Order Count': customer.orderCount,
        'Total Spent (VND)': customer.totalSpent,
        'Average Order Value (VND)': customer.avgOrderValue,
        'Customer Lifetime Value (VND)': customer.clv,
        'Monthly Value (VND)': customer.monthlyValue,
        'Customer Since': customer.customerSince
      }));
      setCsvData(formattedData);
    }
  }, [data]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu CLV</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <BanknotesIcon className="h-6 w-6 mr-2 text-green-600" />
          Giá trị Vòng đời Khách hàng (CLV)
        </h2>
        
        <CSVLink 
          data={csvData} 
          filename={"customer_lifetime_value.csv"}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Xuất CSV
        </CSVLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Tổng số khách hàng</div>
          <div className="text-2xl font-bold">{data.summary?.totalCustomers || 0}</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">CLV trung bình</div>
          <div className="text-2xl font-bold">{formatCurrency(data.summary?.avgClv || 0)}</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Giá trị hàng tháng trung bình</div>
          <div className="text-2xl font-bold">{formatCurrency(data.summary?.avgMonthlyValue || 0)}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h3 className="font-semibold mb-2">Top 10 khách hàng theo CLV</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn hàng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng chi tiêu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị TB/Đơn</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLV</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị hàng tháng</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.customers?.slice(0, 10).map((customer, index) => (
              <tr key={customer.userId || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2">{customer.username}</td>
                <td className="px-4 py-2">{customer.orderCount}</td>
                <td className="px-4 py-2">{formatCurrency(customer.totalSpent)}</td>
                <td className="px-4 py-2">{formatCurrency(customer.avgOrderValue)}</td>
                <td className="px-4 py-2 font-bold">{formatCurrency(customer.clv)}</td>
                <td className="px-4 py-2">{formatCurrency(customer.monthlyValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default AdvancedAnalyticsDashboard;
