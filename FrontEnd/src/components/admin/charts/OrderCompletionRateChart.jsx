import { useMemo } from 'react';
import { advancedAnalyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import useAnalyticsData from '../hooks/useAnalyticsData';
import { formatCurrency } from '../utils/formatters';

const OrderCompletionRateChart = () => {
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getOrderCompletionRate(),
    { stages: [], byDevice: [], summary: {} }
  );

  // Find the stage with the highest dropoff - moved before conditional returns
  const highestDropoffStage = useMemo(() => {
    if (!data.stages || data.stages.length < 2) return null;
    
    let maxDropoff = 0;
    let stage = null;
    
    for (let i = 1; i < data.stages.length; i++) {
      const dropoff = data.stages[i-1].rate - data.stages[i].rate;
      if (dropoff > maxDropoff) {
        maxDropoff = dropoff;
        stage = data.stages[i].name;
      }
    }
    
    return { stage, dropoff: maxDropoff };
  }, [data.stages]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu hoàn thành đơn hàng</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-green-500" />
          Phân tích tỷ lệ hoàn thành đơn hàng
        </h2>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Tỷ lệ hoàn thành đơn hàng</div>
          <div className="text-2xl font-bold text-gray-800">
            {data.summary?.orderCompletionRate?.toFixed(2) || 0}%
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Tỷ lệ rời bỏ trung bình</div>
          <div className="text-2xl font-bold text-gray-800">
            {data.summary?.averageDropoffRate?.toFixed(2) || 0}%
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Doanh thu tiềm năng mất mát</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(data.summary?.potentialLostRevenue || 0)}
          </div>
        </div>
      </div>

      {/* Funnel chart */}
      <div className="mb-6">
        {data.stages && data.stages.length > 0 ? (
          <div className="space-y-4">
            {data.stages.map((stage, index) => {
              const nextStage = data.stages[index + 1];
              const dropoffRate = nextStage ? ((stage.rate - nextStage.rate) / stage.rate * 100).toFixed(1) : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">{stage.name}</div>
                    <div className="h-2.5 bg-gray-200 rounded-full">
                      <div 
                        className="h-2.5 rounded-full bg-green-600"
                        style={{ width: `${stage.rate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {nextStage && (
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-500">{dropoffRate}%</div>
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Không có dữ liệu phân tích tỷ lệ hoàn thành đơn hàng
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Phân tích & Đề xuất</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="p-3 bg-green-50 rounded-md">
            <p className="font-medium text-green-800 mb-1">Tối ưu hóa tỷ lệ hoàn thành</p>
            <p>
              {data.summary?.optimizationInsight || 
                "Tập trung vào việc giảm tỷ lệ rời bỏ giữa các bước trong quy trình đặt hàng. Cải thiện trải nghiệm người dùng và giảm thiểu các bước không cần thiết."}
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-blue-800 mb-1">Cơ hội tăng trưởng doanh thu</p>
            <p>
              {data.summary?.growthOpportunity || 
                "Tăng cường tiếp thị và khuyến mãi cho những khách hàng có khả năng quay lại cao. Sử dụng email nhắc nhở và ưu đãi đặc biệt để kích thích đơn hàng."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletionRateChart;
