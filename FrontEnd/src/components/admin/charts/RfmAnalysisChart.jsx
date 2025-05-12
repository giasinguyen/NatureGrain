import { advancedAnalyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { TagIcon } from '@heroicons/react/24/outline';
import useAnalyticsData from '../hooks/useAnalyticsData';
import { formatCurrency } from '../utils/formatters';

const RfmAnalysisChart = () => {
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

export default RfmAnalysisChart;
