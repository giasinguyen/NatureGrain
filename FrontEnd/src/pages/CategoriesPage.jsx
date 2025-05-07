import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService, productService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getCategories();
        setCategories(response.data || []);
        
        // Sau khi có danh sách danh mục, tải số lượng sản phẩm cho mỗi danh mục
        const categoriesData = response.data || [];
        await fetchProductCounts(categoriesData);
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    // Hàm lấy số lượng sản phẩm cho mỗi danh mục
    const fetchProductCounts = async (categoriesData) => {
      try {
        const counts = {};
        
        // Tạo mảng promises để gọi API song song
        const promises = categoriesData.map(category => 
          productService.getProductsByCategory(category.id)
            .then(response => {
              const productCount = response.data ? response.data.length : 0;
              counts[category.id] = productCount;
            })
            .catch(err => {
              console.error(`Lỗi khi đếm sản phẩm cho danh mục ${category.id}:`, err);
              counts[category.id] = 0;
            })
        );
        
        // Đợi tất cả các API calls hoàn thành
        await Promise.all(promises);
        setProductCounts(counts);
      } catch (err) {
        console.error('Lỗi khi đếm sản phẩm:', err);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Banner trang danh mục */}
        <div className="relative mb-12">
          <div className="w-full h-64 bg-gradient-to-r from-green-700 to-green-500 rounded-lg overflow-hidden shadow-lg">
            <div className="absolute inset-0 flex items-center px-8">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-white mb-4">Danh mục sản phẩm</h1>
                <p className="text-green-100 text-lg">
                  Khám phá các danh mục sản phẩm tự nhiên, hữu cơ và tốt cho sức khỏe tại NatureGrain.
                </p>
                <div className="mt-6">
                  <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-1 md:space-x-3">
                      <li className="inline-flex items-center">
                        <Link to="/" className="text-sm text-green-200 hover:text-white">
                          Trang chủ
                        </Link>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <span className="mx-2 text-green-200">/</span>
                          <span className="text-sm font-medium text-white">
                            Danh mục
                          </span>
                        </div>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách danh mục */}
        {categories.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">Không tìm thấy danh mục nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link 
                to={`/categories/${category.id}`} 
                key={category.id} 
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={category.image || 'https://via.placeholder.com/300x200?text=NatureGrain'} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {category.description || `Khám phá các sản phẩm ${category.name.toLowerCase()} tự nhiên và hữu cơ.`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {productCounts[category.id] || '0'} sản phẩm
                      </span>
                      <span className="text-green-600 font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center">
                        Xem chi tiết
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Giới thiệu về danh mục */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Về danh mục sản phẩm của chúng tôi</h2>
          <p className="text-gray-600 mb-4">
            Tại NatureGrain, chúng tôi phân chia sản phẩm thành nhiều danh mục để bạn dễ dàng tìm kiếm những sản phẩm phù hợp với nhu cầu của mình.
            Mỗi danh mục đều được lựa chọn kỹ lưỡng để đảm bảo cung cấp những sản phẩm chất lượng cao, tự nhiên và có lợi cho sức khỏe.
          </p>
          <p className="text-gray-600 mb-4">
            Dù bạn đang tìm kiếm thực phẩm hữu cơ, đồ uống tự nhiên, thảo dược, hay các sản phẩm chăm sóc cá nhân, 
            chúng tôi đều có những lựa chọn đa dạng và chất lượng để đáp ứng nhu cầu của bạn.
          </p>
          <p className="text-gray-600">
            Khám phá các danh mục sản phẩm của chúng tôi và tìm ra những sản phẩm tốt nhất cho lối sống lành mạnh của bạn!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;