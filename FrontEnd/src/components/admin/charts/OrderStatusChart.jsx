import { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { dashboardService } from '../../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrderStatusChart = ({ className = "" }) => {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderStatusData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getOrderStatusDistribution();
        setStatusData(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching order status data:', err);
        setError('Không thể tải dữ liệu trạng thái đơn hàng');
        // Mock data on error
        setStatusData([
          { status: 'COMPLETED', count: 65, label: 'Hoàn thành' },
          { status: 'PENDING', count: 15, label: 'Đang xử lý' },
          { status: 'SHIPPED', count: 12, label: 'Đã gửi' },
          { status: 'CANCELLED', count: 8, label: 'Đã hủy' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatusData();
  }, []);

  const statusColors = {
    'COMPLETED': '#10B981',
    'PENDING': '#F59E0B', 
    'SHIPPED': '#3B82F6',
    'CANCELLED': '#EF4444',
    'PROCESSING': '#8B5CF6'
  };

  const chartData = useMemo(() => {
    if (!statusData.length) return null;

    return {
      labels: statusData.map(item => item.label || item.status),
      datasets: [
        {
          label: 'Số đơn hàng',
          data: statusData.map(item => item.count),
          backgroundColor: statusData.map(item => statusColors[item.status] || '#6B7280'),
          borderColor: statusData.map(item => statusColors[item.status] || '#6B7280'),
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    };
  }, [statusData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#10B981',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
            return `${context.parsed.y} đơn hàng (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          beginAtZero: true,
          stepSize: 1
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="w-8 h-8 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-red-500 text-sm text-center">
          <p>{error}</p>
          <p className="text-xs text-gray-500 mt-1">Hiển thị dữ liệu mẫu</p>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  return (
    <div className={`h-64 ${className}`}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default OrderStatusChart;
