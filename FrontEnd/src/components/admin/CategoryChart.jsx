import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';

const CategoryChart = () => {
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
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError('Không thể tải dữ liệu danh mục.');
        // Tạo dữ liệu giả để hiển thị giao diện
        const mockData = [
          { name: 'Organic Vegetables', count: 10 },
          { name: 'Fresh Fruits', count: 8 },
          { name: 'Whole Grains', count: 6 },
          { name: 'Dairy Products', count: 5 },
          { name: 'Sustainable Meats', count: 4 }
        ];
        setCategoryData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  // Hiển thị loading hoặc error state
  if (loading) {
    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Phân bổ sản phẩm theo danh mục</h2>
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error && categoryData.length === 0) {
    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Phân bổ sản phẩm theo danh mục</h2>
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }
  
  // Nếu không có dữ liệu
  if (categoryData.length === 0) {
    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Phân bổ sản phẩm theo danh mục</h2>
        <div className="text-gray-500 text-center py-4">Không có dữ liệu danh mục.</div>
      </div>
    );
  }

  // Colors for our chart
  const colors = [
    '#16A34A', '#3B82F6', '#EAB308', '#14B8A6', 
    '#8B5CF6', '#EC4899', '#F97316', '#84cc16'
  ];
  
  // Calculate the total count of all categories
  const totalCount = categoryData.reduce((sum, category) => sum + category.count, 0);
  
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-800 mb-6">Phân bổ sản phẩm theo danh mục</h2>
      
      <div className="flex flex-wrap">
        {/* Simple bar chart representation */}
        <div className="w-full md:w-1/2">
          {categoryData.map((category, index) => {
            const percentage = totalCount > 0 ? (category.count / totalCount) * 100 : 0;
            return (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: colors[index % colors.length]
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="w-full md:w-1/2 pl-0 md:pl-6 mt-6 md:mt-0">
          <div className="grid grid-cols-2 gap-3">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-sm text-gray-600">
                  {category.name} ({category.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
