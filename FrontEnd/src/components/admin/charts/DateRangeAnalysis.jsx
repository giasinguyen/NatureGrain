import { useState, useEffect } from 'react';
import { analyticsService } from '../../../services/api';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { CalendarIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { CSVLink } from 'react-csv';
import useAnalyticsData from '../hooks/useAnalyticsData';
import { formatCurrency } from '../utils/formatters';

const DateRangeAnalysis = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [csvData, setCsvData] = useState([]);
  const { data, loading, error, usedFallback } = useAnalyticsData(() => 
    analyticsService.getSalesByDateRange(startDate, endDate), 
    { 
      data: [
        { date: '2025-05-05', quantity: 12, revenue: 8400000 },
        { date: '2025-05-06', quantity: 15, revenue: 10500000 },
        { date: '2025-05-07', quantity: 18, revenue: 12600000 },
        { date: '2025-05-08', quantity: 14, revenue: 9800000 },
        { date: '2025-05-09', quantity: 20, revenue: 14000000 },
        { date: '2025-05-10', quantity: 25, revenue: 17500000 },
        { date: '2025-05-11', quantity: 22, revenue: 15400000 }
      ],
      summary: {
        totalOrders: 126,
        totalRevenue: 88200000,
        averageOrderValue: 700000,
        bestDay: { date: '2025-05-10', revenue: 17500000 },
        worstDay: { date: '2025-05-05', revenue: 8400000 }
      }
    }
  );

  useEffect(() => {
    if (data && data.data) {
      // Format data for CSV export
      const formattedData = data.data.map(item => ({
        Date: item.date,
        Quantity: item.quantity,
        Revenue: item.revenue
      }));
      setCsvData(formattedData);
    }
  }, [data]);

  const handleDateSubmit = (e) => {
    e.preventDefault();
    // The data will be refetched automatically via the useEffect in useAnalyticsData
  };
  if (loading) return <LoadingSpinner />;
  if (error && !usedFallback) return <div className="p-4 text-red-500">Lỗi khi tải dữ liệu phân tích theo ngày</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <CalendarIcon className="h-6 w-6 mr-2 text-orange-500" />
          Phân tích theo khoảng thời gian
        </h2>      </div>
      
      {usedFallback && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Đang hiển thị dữ liệu mẫu do không thể kết nối đến máy chủ.
        </div>
      )}
      
      <div className="flex justify-end mb-6">
        <CSVLink 
          data={csvData} 
          filename={"sales_report.csv"}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Tải xuống CSV
        </CSVLink>
      </div>

      {/* Date range selection form */}
      <form onSubmit={handleDateSubmit} className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">Ngày bắt đầu</label>
          <input 
            type="date" 
            id="startDate"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">Ngày kết thúc</label>
          <input 
            type="date" 
            id="endDate"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-end">
          <button 
            type="submit" 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Áp dụng
          </button>
        </div>
      </form>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-gray-500 mb-1">Tổng số lượng bán</div>
          <div className="text-xl font-bold text-gray-900">{data.summary?.totalQuantity || 0}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-sm text-gray-500 mb-1">Tổng doanh thu</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.summary?.totalRevenue || 0)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-sm text-gray-500 mb-1">Doanh thu trung bình / ngày</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(data.summary?.avgDailyRevenue || 0)}
          </div>
        </div>
      </div>

      {/* Line chart showing revenue trends */}
      <div className="relative h-64">
        {data.data && data.data.length > 0 ? (
          <div className="flex h-full items-end">
            {data.data.map((dayData, index) => {
              const maxRevenue = Math.max(...data.data.map(d => d.revenue));
              const height = (dayData.revenue / maxRevenue * 90);
              return (
                <div key={index} className="flex flex-col items-center justify-end flex-1">
                  <div 
                    className="bg-blue-500 hover:bg-blue-600 transition-all rounded-t w-4/5" 
                    style={{height: `${height}%`}}
                    title={`${dayData.date}: ${formatCurrency(dayData.revenue)}`}
                  ></div>
                  <div className="text-xs mt-1 truncate w-full text-center">
                    {
                      new Date(dayData.date).toLocaleDateString('vi-VN', {
                        month: 'numeric',
                        day: 'numeric'
                      })
                    }
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu trong khoảng thời gian đã chọn</p>
          </div>
        )}
      </div>
      
      {/* Data table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data && data.data.length > 0 ? data.data.map((day, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                  {new Date(day.date).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{day.quantity}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(day.revenue)}</td>
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

export default DateRangeAnalysis;
