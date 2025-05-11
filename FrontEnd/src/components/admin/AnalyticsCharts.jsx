import { useState, useEffect, useMemo, useCallback } from 'react';
import { analyticsService } from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ChartBarIcon,
  ChartPieIcon,
  UsersIcon,
  ShoppingBagIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

// Custom hook for fetching analytics data
const useAnalyticsData = (dataFetcher, defaultValue = null) => {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetch function
  const fetchData = useCallback(async () => {
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
  }, [dataFetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
};

export const SalesTrendsChart = ({ timeframe = 'daily', timespan = 30 }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedTimespan, setSelectedTimespan] = useState(timespan);
  
  // Memoize the data fetcher function with the state variables as dependencies
  const dataFetcher = useCallback(() => 
    analyticsService.getSalesTrends(selectedTimeframe, selectedTimespan), 
    [selectedTimeframe, selectedTimespan]
  );
  
  const { data, loading, error } = useAnalyticsData(dataFetcher, { data: [], summary: {} });

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu biểu đồ</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Xu hướng Doanh thu</h2>
        <div className="flex space-x-2">
          <select 
            className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1 text-sm" 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
          >
            <option value="daily">Theo ngày</option>
            <option value="weekly">Theo tuần</option>
            <option value="monthly">Theo tháng</option>
          </select>
          <select 
            className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1 text-sm"
            value={selectedTimespan}
            onChange={(e) => setSelectedTimespan(parseInt(e.target.value))}
          >
            <option value="7">7 {selectedTimeframe === 'daily' ? 'ngày' : selectedTimeframe === 'weekly' ? 'tuần' : 'tháng'}</option>
            <option value="14">14 {selectedTimeframe === 'daily' ? 'ngày' : selectedTimeframe === 'weekly' ? 'tuần' : 'tháng'}</option>
            <option value="30">30 {selectedTimeframe === 'daily' ? 'ngày' : selectedTimeframe === 'weekly' ? 'tuần' : 'tháng'}</option>
            <option value="90">90 {selectedTimeframe === 'daily' ? 'ngày' : selectedTimeframe === 'weekly' ? 'tuần' : 'tháng'}</option>
          </select>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-sm text-gray-500 mb-1">Tổng doanh thu</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(data.summary?.totalSales || 0)}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-gray-500 mb-1">Tổng đơn hàng</div>
          <div className="text-xl font-bold text-gray-900">{data.summary?.totalOrders || 0}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-sm text-gray-500 mb-1">Giá trị đơn hàng trung bình</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(data.summary?.avgOrderValue || 0)}</div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64 mt-4">
        {data.data?.length ? (
          <div className="relative h-full">
            {/* Simplified chart representation - you would typically use a library like Recharts or Chart.js */}
            <div className="flex h-full items-end space-x-2">
              {data.data.map((point, index) => {
                const maxSales = Math.max(...data.data.map(p => p.sales));
                const height = maxSales > 0 ? (point.sales / maxSales * 100) : 0;
                
                return (
                  <div key={index} className="group flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-all relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {formatCurrency(point.sales)} ({point.orders} đơn)
                      </div>
                    </div>
                    <div className="text-xs mt-1 truncate w-full text-center">
                      {point.period}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
};

export const CustomerRetentionChart = () => {
  const { data, loading, error } = useAnalyticsData(
    analyticsService.getCustomerRetention
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Phân tích khách hàng</h2>
      
      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-gray-500">Tỷ lệ khách hàng quay lại</div>
          <div className="flex items-center mt-1">
            <div className="text-2xl font-bold text-gray-900">{data?.retentionRate || 0}%</div>
            <ArrowUpIcon className="w-4 h-4 text-green-500 ml-2" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-sm text-gray-500">Đơn hàng trung bình/khách</div>
          <div className="text-2xl font-bold text-gray-900">{data?.avgOrdersPerCustomer || 0}</div>
        </div>
      </div>
      
      {/* Customer Breakdown */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">Phân loại khách hàng</h3>
        <div className="relative pt-1">
          <div className="flex h-6 overflow-hidden text-xs rounded-full">
            <div 
              style={{ width: `${data ? (data.repeatCustomers / data.totalCustomers * 100) : 0}%` }}
              className="flex flex-col justify-center text-center text-white bg-green-500 whitespace-nowrap transition-all duration-300"
            >
              {data?.repeatCustomers || 0} khách hàng quay lại
            </div>
            <div 
              style={{ width: `${data ? (data.oneTimeCustomers / data.totalCustomers * 100) : 0}%` }}
              className="flex flex-col justify-center text-center text-white bg-blue-500 whitespace-nowrap transition-all duration-300"
            >
              {data?.oneTimeCustomers || 0} khách hàng một lần
            </div>
          </div>
        </div>
      </div>
      
      {/* Purchase Frequency */}
      {data?.purchaseFrequency && (
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">Tần suất mua hàng</h3>
          <div className="space-y-2">
            {Object.entries(data.purchaseFrequency)
              .sort(([keyA], [keyB]) => {
                if (keyA === '5+') return 1;
                if (keyB === '5+') return -1;
                return parseInt(keyA) - parseInt(keyB);
              })
              .map(([frequency, count]) => (
                <div key={frequency} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">{frequency} đơn:</div>
                  <div className="flex-1 ml-2">
                    <div className="relative pt-1">
                      <div className="flex h-4 overflow-hidden text-xs rounded">
                        <div 
                          style={{ width: `${(count / data.totalCustomers * 100)}%` }}
                          className={`flex flex-col justify-center text-center text-white whitespace-nowrap bg-gradient-to-r from-blue-500 to-green-500`}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-800">
                    {count} khách ({Math.round(count / data.totalCustomers * 100)}%)
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const UserGrowthChart = ({ days = 30 }) => {
  const [selectedDays, setSelectedDays] = useState(days);
  
  // Memoize the data fetcher function with selectedDays as dependency
  const dataFetcher = useCallback(() => 
    analyticsService.getUserGrowth(selectedDays), 
    [selectedDays]
  );
  
  const { data, loading, error } = useAnalyticsData(dataFetcher, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu người dùng</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Tăng trưởng người dùng</h2>
        <select 
          className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1 text-sm" 
          value={selectedDays}
          onChange={(e) => setSelectedDays(parseInt(e.target.value))}
        >
          <option value="7">7 ngày</option>
          <option value="30">30 ngày</option>
          <option value="90">90 ngày</option>
        </select>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        {data?.length ? (
          <div className="relative h-full">
            {/* Simplified chart representation */}
            <div className="flex h-full items-end space-x-0.5">
              {data.map((point, index) => {
                const maxUsers = Math.max(...data.map(p => p.totalUsers));
                const height = maxUsers > 0 ? (point.totalUsers / maxUsers * 100) : 0;
                
                return (
                  <div key={index} className="group flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all relative"
                      style={{ height: `${height}%` }}
                    >
                      {point.newUsers > 0 && (
                        <div 
                          className="w-full bg-green-500 rounded-t absolute bottom-0"
                          style={{ height: `${point.newUsers / point.totalUsers * 100}%` }}
                        ></div>
                      )}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        Tổng: {point.totalUsers} (Mới: +{point.newUsers})
                      </div>
                    </div>
                    {index % Math.ceil(data.length / 10) === 0 && (
                      <div className="text-xs mt-1 truncate w-full text-center">
                        {new Date(point.date).toLocaleDateString('vi-VN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Không có dữ liệu
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Tổng người dùng</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Người dùng mới</span>
        </div>
      </div>
    </div>
  );
};

export const OrderStatusChart = () => {
  const { data, loading, error } = useAnalyticsData(
    analyticsService.getOrderStatusDistribution
  );
  
  const statusColors = useMemo(() => ({
    'PENDING': 'rgb(253, 186, 116)', // orange-300
    'PROCESSING': 'rgb(147, 197, 253)', // blue-300
    'SHIPPED': 'rgb(147, 197, 253)', // blue-300
    'DELIVERED': 'rgb(134, 239, 172)', // green-300
    'CANCELLED': 'rgb(252, 165, 165)', // red-300
    'REFUNDED': 'rgb(216, 180, 254)', // purple-300
    'COMPLETED': 'rgb(110, 231, 183)' // emerald-300
  }), []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu trạng thái đơn hàng</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Phân bố trạng thái đơn hàng</h2>
      
      {data?.length ? (
        <div className="space-y-4">
          {/* Pie chart representation */}
          <div className="relative h-52 flex justify-center items-center">
            <div className="relative w-40 h-40">
              {data.map((item, index, array) => {
                // Calculate pie slices
                let startAngle = 0;
                for (let i = 0; i < index; i++) {
                  startAngle += array[i].percentage * 3.6; // Convert percentage to degrees (360 / 100)
                }
                const endAngle = startAngle + item.percentage * 3.6;
                
                return (
                  <div 
                    key={item.status} 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      clipPath: `path('M 80 80 L 80 0 A 80 80 0 ${
                        item.percentage > 50 ? 1 : 0
                      } 1 ${
                        80 + 80 * Math.cos(endAngle * Math.PI / 180)
                      } ${
                        80 + 80 * Math.sin(endAngle * Math.PI / 180)
                      } Z')`,
                      transform: `rotate(${startAngle}deg)`,
                      backgroundColor: statusColors[item.status] || 'rgb(209, 213, 219)' // gray-300 as default
                    }}
                  ></div>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center text-sm font-medium">
                  {data.reduce((sum, item) => sum + item.count, 0)} đơn hàng
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {data.map(item => (
              <div key={item.status} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: statusColors[item.status] || 'rgb(209, 213, 219)' }}
                ></div>
                <span className="text-sm">{item.status}</span>
                <span className="ml-auto text-sm font-medium">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-400">
          Không có dữ liệu
        </div>
      )}
    </div>
  );
};

export const ProductPerformanceTable = () => {
  const [sortBy, setSortBy] = useState('revenue'); // Default sort by revenue
  const [sortDesc, setSortDesc] = useState(true); // Default descending
  
  const { data, loading, error } = useAnalyticsData(
    analyticsService.getProductPerformance
  );

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (sortDesc) {
        return valueB - valueA;
      } else {
        return valueA - valueB;
      }
    });
  }, [data, sortBy, sortDesc]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(true);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu hiệu suất sản phẩm</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Hiệu suất sản phẩm</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('quantitySold')}
              >
                <div className="flex items-center">
                  Số lượng bán
                  {sortBy === 'quantitySold' && (
                    sortDesc ? 
                      <ArrowDownIcon className="w-3 h-3 ml-1" /> : 
                      <ArrowUpIcon className="w-3 h-3 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center">
                  Doanh thu
                  {sortBy === 'revenue' && (
                    sortDesc ? 
                      <ArrowDownIcon className="w-3 h-3 ml-1" /> : 
                      <ArrowUpIcon className="w-3 h-3 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('uniqueCustomers')}
              >
                <div className="flex items-center">
                  Khách hàng
                  {sortBy === 'uniqueCustomers' && (
                    sortDesc ? 
                      <ArrowDownIcon className="w-3 h-3 ml-1" /> : 
                      <ArrowUpIcon className="w-3 h-3 ml-1" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length ? (
              sortedData.map((product, index) => (
                <tr key={product.productId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.quantitySold}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(product.revenue)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.uniqueCustomers}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Không có dữ liệu hiệu suất sản phẩm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTrendsChart />
        <CustomerRetentionChart />
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart />
        <OrderStatusChart />
      </div>
      
      <div>
        <ProductPerformanceTable />
      </div>
    </div>
  );
};

export const ProductPerformanceChart = () => {
  const { data, loading, error } = useAnalyticsData(
    analyticsService.getProductPerformance
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu hiệu suất sản phẩm</div>;

  // Sort data by revenue (highest first)
  const sortedData = data ? [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 10) : [];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Top 10 sản phẩm theo doanh thu</h2>
      
      {sortedData.length ? (
        <div>
          <div className="relative h-64 mb-4">            
            {sortedData.map((product) => {
              // Calculate max revenue for proportional bars
              const maxRevenue = sortedData[0].revenue;
              const width = (product.revenue / maxRevenue * 100);
              
              return (
                <div key={product.productId} className="flex items-center mb-2">
                  <div className="w-1/3 text-sm truncate pr-2">{product.productName}</div>
                  <div className="flex-1">
                    <div className="relative h-6">
                      <div 
                        className="absolute top-0 left-0 h-full bg-green-500 rounded-r"
                        style={{ width: `${width}%` }}
                      ></div>
                      <div className="absolute top-0 right-0 h-full flex items-center pr-2 text-sm">
                        {formatCurrency(product.revenue)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-sm text-gray-600 text-right">
            * Hiển thị top 10 sản phẩm có doanh thu cao nhất
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-400">
          Không có dữ liệu
        </div>
      )}
    </div>
  );
};

// Add alias exports for components that might be referenced under different names
export const OrderStatusDistributionChart = OrderStatusChart;

export default AnalyticsDashboard;
