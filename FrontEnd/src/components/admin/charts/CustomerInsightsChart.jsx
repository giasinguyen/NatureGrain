import { analyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import useAnalyticsData from '../hooks/useAnalyticsData';
import { formatCurrency } from '../utils/formatters';

const CustomerInsightsChart = () => {
  const { data, loading, error, usedFallback } = useAnalyticsData(() => 
    analyticsService.getCustomerInsights(), 
    { 
      customers: [
        { id: 1, name: 'Khách hàng 1', totalSpend: 5000000, orderCount: 15, avgOrderValue: 333333 },
        { id: 2, name: 'Khách hàng 2', totalSpend: 4500000, orderCount: 12, avgOrderValue: 375000 },
        { id: 3, name: 'Khách hàng 3', totalSpend: 3800000, orderCount: 10, avgOrderValue: 380000 },
        { id: 4, name: 'Khách hàng 4', totalSpend: 3200000, orderCount: 8, avgOrderValue: 400000 },
        { id: 5, name: 'Khách hàng 5', totalSpend: 2900000, orderCount: 9, avgOrderValue: 322222 },
        { id: 6, name: 'Khách hàng 6', totalSpend: 2700000, orderCount: 7, avgOrderValue: 385714 },
        { id: 7, name: 'Khách hàng 7', totalSpend: 2500000, orderCount: 5, avgOrderValue: 500000 },
        { id: 8, name: 'Khách hàng 8', totalSpend: 2400000, orderCount: 6, avgOrderValue: 400000 },
        { id: 9, name: 'Khách hàng 9', totalSpend: 2200000, orderCount: 4, avgOrderValue: 550000 },
        { id: 10, name: 'Khách hàng 10', totalSpend: 2000000, orderCount: 5, avgOrderValue: 400000 }
      ], 
      metrics: {
        totalCustomers: 120,
        averageLifetimeValue: 2950000,
        averageOrderFrequency: 3.2,
        averageOrderValue: 350000,
        newCustomersLastMonth: 15,
        customerRetention: 0.78
      } 
    }
  );

  if (loading) return <LoadingSpinner />;
  if (error && !usedFallback) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu khách hàng</div>;
  
  // Show only top 10 customers by spend for the chart
  const topCustomers = data.customers.slice(0, 10);

  return (
    <div className="bg-white p-4 rounded-lg shadow">      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2 text-green-500" />
          Phân tích khách hàng
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

export default CustomerInsightsChart;
