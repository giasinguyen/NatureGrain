import { useState, useMemo } from 'react';
import { advancedAnalyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { FireIcon } from '@heroicons/react/24/outline';
import useAnalyticsData from '../hooks/useAnalyticsData';

const DayHourHeatmapChart = () => {
  const [metric, setMetric] = useState(1); // Use numeric value 1 for 'orders'
  
  const { data, loading, error } = useAnalyticsData(
    () => advancedAnalyticsService.getDayHourHeatmap(metric),
    { heatmapData: [], peakTimes: {}, summary: {} },
    [metric]
  );

  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate color based on intensity
  const getHeatColor = (intensity) => {
    if (intensity >= 0.8) return 'bg-red-600';
    if (intensity >= 0.6) return 'bg-red-500';
    if (intensity >= 0.4) return 'bg-orange-400';
    if (intensity >= 0.2) return 'bg-yellow-300';
    return 'bg-green-200';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu biểu đồ nhiệt</div>;

  // Organize data by day and hour
  const heatmapByDayAndHour = {};
  if (data.heatmapData) {
    data.heatmapData.forEach(item => {
      if (!heatmapByDayAndHour[item.day]) {
        heatmapByDayAndHour[item.day] = {};
      }
      heatmapByDayAndHour[item.day][item.hour] = item;
    });
  }
  
  // Find max value for normalization
  const maxValue = data.heatmapData && data.heatmapData.length > 0
    ? Math.max(...data.heatmapData.map(item => item.value))
    : 1;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FireIcon className="h-6 w-6 mr-2 text-red-500" />
          Biểu đồ nhiệt theo ngày và giờ
        </h2>
        
        <div className="mt-4 md:mt-0">
          <label className="text-sm text-gray-500 block mb-1">Chỉ số đo</label>
          <select 
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={metric}
            onChange={(e) => setMetric(parseInt(e.target.value, 10))}
          >
            <option value={1}>Số đơn hàng</option>
            <option value={2}>Doanh thu</option>
            <option value={3}>Số lượt truy cập</option>
          </select>
        </div>
      </div>

      {/* Peak times summary */}
      {data.peakTimes && (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Thời gian cao điểm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Ngày trong tuần</div>
              <div className="text-lg font-bold text-red-800">
                {data.peakTimes.peakDay === 0 ? 'Chủ nhật' : `Thứ ${data.peakTimes.peakDay + 1}`}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Giờ cao điểm</div>
              <div className="text-lg font-bold text-red-800">
                {data.peakTimes.peakHour}:00 - {data.peakTimes.peakHour + 1}:00
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap */}
      <div className="overflow-x-auto mb-6">
        <div className="min-w-max">
          <div className="flex">
            <div className="w-12"></div>
            {daysOfWeek.map((day, index) => (
              <div key={index} className="flex-1 text-center font-medium text-sm text-gray-700 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {hoursOfDay.map(hour => (
            <div key={hour} className="flex">
              <div className="w-12 text-right pr-2 text-xs font-medium text-gray-600 py-2 flex items-center justify-end">
                {hour}:00
              </div>
              
              {daysOfWeek.map((_, dayIndex) => {
                const dayData = heatmapByDayAndHour[dayIndex];
                const hourData = dayData && dayData[hour];
                const intensity = hourData ? hourData.value / maxValue : 0;
                const value = hourData ? hourData.value : 0;
                
                const isPeak = data.peakTimes && 
                  data.peakTimes.peakDay === dayIndex && 
                  data.peakTimes.peakHour === hour;
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`flex-1 flex items-center justify-center
                      ${isPeak ? 'ring-2 ring-red-600' : ''}
                    `}
                  >
                    <div 
                      className={`w-full h-6 ${getHeatColor(intensity)} 
                        border border-white flex items-center justify-center text-xs
                        ${intensity > 0.5 ? 'text-white' : 'text-gray-800'}
                      `}
                      title={`${daysOfWeek[dayIndex]} ${hour}:00 - ${value} ${
                        metric === 1 ? 'đơn hàng' : 
                        metric === 2 ? 'doanh thu' : 'lượt truy cập'
                      }`}
                    >
                      {intensity > 0.2 ? value : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-1 items-center mb-6">
        <span className="text-xs text-gray-500">Thấp</span>
        <div className="flex">
          <div className="w-6 h-6 bg-green-200"></div>
          <div className="w-6 h-6 bg-yellow-300"></div>
          <div className="w-6 h-6 bg-orange-400"></div>
          <div className="w-6 h-6 bg-red-500"></div>
          <div className="w-6 h-6 bg-red-600"></div>
        </div>
        <span className="text-xs text-gray-500">Cao</span>
      </div>

      {/* Insights */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Phân tích & Đề xuất</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="p-3 bg-red-50 rounded-md">
            <p className="font-medium text-red-800 mb-1">Đề xuất về nhân sự</p>
            <p>
              {data.summary?.staffingInsight || 
                `Đảm bảo đủ nhân viên vào thời gian cao điểm là ${data.peakTimes?.peakDay === 0 ? 'Chủ nhật' : `Thứ ${data.peakTimes?.peakDay + 1}`} 
                từ ${data.peakTimes?.peakHour}:00 đến ${data.peakTimes?.peakHour + 1}:00. Cân nhắc tăng cường nhân sự hỗ trợ khách hàng trong khung giờ này.`}
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-blue-800 mb-1">Đề xuất marketing</p>
            <p>
              {data.summary?.marketingInsight || 
                `Tập trung chiến dịch marketing vào các khung giờ thấp điểm để phân bổ đều lượng đơn hàng. 
                Cân nhắc gửi email marketing vào thời điểm có tỷ lệ mở cao nhất, thường là buổi sáng.`}
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-md">
            <p className="font-medium text-green-800 mb-1">Đề xuất vận hành</p>
            <p>
              {data.summary?.operationalInsight || 
                `Lên kế hoạch vận hành, đóng gói và giao hàng dựa trên mô hình đơn hàng theo ngày trong tuần. 
                Cân nhắc điều chỉnh lịch trình nhập hàng và xử lý đơn hàng dựa trên dữ liệu biểu đồ nhiệt.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayHourHeatmapChart;
