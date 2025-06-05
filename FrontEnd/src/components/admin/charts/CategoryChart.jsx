import { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { dashboardService } from '../../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ className = "" }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getCategoryBreakdown();
        setCategoryData(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Không thể tải dữ liệu danh mục');
        // Mock data on error
        setCategoryData([
          { name: 'Rau củ hữu cơ', count: 12 },
          { name: 'Trái cây tươi', count: 8 },
          { name: 'Ngũ cốc nguyên hạt', count: 6 },
          { name: 'Thực phẩm khô', count: 4 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const colors = [
    '#10B981', // Green
    '#3B82F6', // Blue
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16'  // Lime
  ];

  const chartData = useMemo(() => {
    if (!categoryData.length) return null;

    return {
      labels: categoryData.map(item => item.name),
      datasets: [
        {
          data: categoryData.map(item => item.count),
          backgroundColor: colors.slice(0, categoryData.length),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 10
        }
      ]
    };
  }, [categoryData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          },
          color: '#374151',
          usePointStyle: true,
          pointStyle: 'circle'
        }
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
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} sản phẩm (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%',
    elements: {
      arc: {
        borderJoinStyle: 'round'
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
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default CategoryChart;
