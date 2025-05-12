import { useMemo } from 'react';
import { advancedAnalyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { TagIcon, DocumentArrowDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { CSVLink } from 'react-csv';
import { formatForCSVExport } from '../../../utils/analyticsOptimizer';
import useAnalyticsData from '../hooks/useAnalyticsData';
import { formatCurrency } from '../utils/formatters';

const CategoryPerformanceChart = () => {
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

export default CategoryPerformanceChart;
