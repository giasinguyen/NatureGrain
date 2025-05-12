import { useMemo } from 'react';
import { advancedAnalyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { BanknotesIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { CSVLink } from 'react-csv';
import { formatForCSVExport } from '../../../utils/analyticsOptimizer';
import useAnalyticsData from '../hooks/useAnalyticsData';
import { formatCurrency } from '../utils/formatters';

const CustomerLifetimeValueChart = () => {
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

export default CustomerLifetimeValueChart;
