import { analyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import useAnalyticsData from '../hooks/useAnalyticsData';

const OrderProcessingTimeAnalysis = () => {
  const { data, loading, error, usedFallback } = useAnalyticsData(() => 
    analyticsService.getOrderProcessingTime(), 
    {
      // Fallback data structure if the API fails
      averageProcessingHours: 2.5,
      averageProcessingDays: 1.2,
      byStatus: [
        { status: 'New', hours: 0 },
        { status: 'Processing', hours: 1.5 },
        { status: 'Shipped', hours: 24 },
        { status: 'Delivered', hours: 36 }
      ],
      trends: {
        last30Days: 2.5,
        last60Days: 2.7,
        changePercent: -7.4
      }
    }
  );
  if (loading) return <LoadingSpinner />;
  if (error && !usedFallback) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu thời gian xử lý</div>;

  const hours = data.averageProcessingHours || 0;
  const days = data.averageProcessingDays || 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow">      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-blue-500" />
          Phân tích thời gian xử lý đơn hàng
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

export default OrderProcessingTimeAnalysis;
