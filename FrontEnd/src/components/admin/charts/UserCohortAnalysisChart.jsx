import { useMemo } from 'react';
import { advancedAnalyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { UserGroupIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { CSVLink } from 'react-csv';
import { formatForCSVExport } from '../../../utils/analyticsOptimizer';
import useAnalyticsData from '../hooks/useAnalyticsData';

const UserCohortAnalysisChart = () => {
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

export default UserCohortAnalysisChart;
