import { analyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import useAnalyticsData from '../hooks/useAnalyticsData';
import { formatCurrency } from '../utils/formatters';

const SalesTrendsAnalysis = () => {
  const { data, loading, error, usedFallback } = useAnalyticsData(() => 
    analyticsService.getSalesTrends(), 
    { 
      data: [
        { date: '2025-05-01', sales: 15200000, orders: 22 },
        { date: '2025-05-02', sales: 18500000, orders: 25 },
        { date: '2025-05-03', sales: 12800000, orders: 18 },
        { date: '2025-05-04', sales: 10500000, orders: 15 },
        { date: '2025-05-05', sales: 14700000, orders: 20 },
        { date: '2025-05-06', sales: 16300000, orders: 24 },
        { date: '2025-05-07', sales: 19200000, orders: 28 },
        { date: '2025-05-08', sales: 17800000, orders: 26 },
        { date: '2025-05-09', sales: 21500000, orders: 31 },
        { date: '2025-05-10', sales: 23100000, orders: 33 }
      ], 
      summary: {
        totalRevenue: 169600000,
        totalOrders: 242,
        averageOrderValue: 700000,
        growthRate: 12.4,
        bestSellingDay: 'Thứ 7'
      } 
    }
  );

  if (loading) return <LoadingSpinner />;
  if (error && !usedFallback) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu xu hướng doanh số</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-red-500" />
          Phân tích xu hướng doanh số
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

export default SalesTrendsAnalysis;
