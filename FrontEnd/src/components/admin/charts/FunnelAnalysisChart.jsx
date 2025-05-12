import { advancedAnalyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import useAnalyticsData from '../hooks/useAnalyticsData';
import { formatCurrency } from '../utils/formatters';

const FunnelAnalysisChart = () => {
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

export default FunnelAnalysisChart;
