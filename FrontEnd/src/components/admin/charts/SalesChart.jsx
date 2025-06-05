import { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { dashboardService } from '../../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = ({ days = 7, className = "" }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getSalesChartData(days);
        setSalesData(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching sales data:', err);
        setError('Không thể tải dữ liệu doanh thu');
        // Mock data on error
        setSalesData(generateMockSalesData(days));
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [days]);

  const generateMockSalesData = (days) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 2000000) + 500000
      });
    }
    return data;
  };

  const chartData = useMemo(() => {
    if (!salesData.length) return null;

    return {
      labels: salesData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('vi-VN', { 
          month: 'short', 
          day: 'numeric' 
        });
      }),
      datasets: [
        {
          label: 'Doanh thu (VNĐ)',
          data: salesData.map(item => item.amount),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        }
      ]
    };
  }, [salesData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#10B981',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `Doanh thu: ${new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(context.parsed.y)}`;
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
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value) + ' ₫';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        hoverBackgroundColor: '#10B981'
      }
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
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default SalesChart;
