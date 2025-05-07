import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryService, productService } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import Pagination from '../components/ui/Pagination';
import ProductFilter from '../components/ui/ProductFilter';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CategoryDetailPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    sort: 'newest',
    priceRange: [0, 1000000],
    inStock: false,
  });

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        // Fetch products by category
        const productsResponse = await productService.getProductsByCategory(id);
        setProducts(productsResponse.data || []);
        
        // Fetch category details if needed
        // Note: In the current API implementation, there doesn't seem to be a dedicated endpoint
        // to get a single category by ID. If needed, you would add that to your backend.
        // For now, we can extract the category info from the products
        if (productsResponse.data && productsResponse.data.length > 0) {
          const categoryInfo = productsResponse.data[0].category;
          setCategory(categoryInfo);
        } else {
          // If there are no products, we might need a separate API call
          // This would require adding a getCategory endpoint to your backend
          try {
            const categoryResponse = await categoryService.getCategory(id);
            setCategory(categoryResponse.data);
          } catch (categoryErr) {
            console.error('Lỗi khi tải thông tin danh mục:', categoryErr);
          }
        }
        
        // Calculate total pages based on product count (assuming 12 products per page)
        const pageSize = 12;
        const total = productsResponse.data ? Math.ceil(productsResponse.data.length / pageSize) : 1;
        setTotalPages(total);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm theo danh mục:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryDetails();
    }
  }, [id]);

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  // Lọc và sắp xếp sản phẩm dựa trên bộ lọc hiện tại
  const filteredProducts = products
    .filter(product => {
      // Lọc theo giá
      const price = product.price;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }
      
      // Lọc theo trạng thái còn hàng
      if (filters.inStock && product.quantity <= 0) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sắp xếp theo lựa chọn
      switch (filters.sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  // Phân trang
  const productsPerPage = 12;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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
        {/* Banner danh mục */}
        <div className="relative mb-12">
          <div className="w-full h-64 bg-gradient-to-r from-green-700 to-green-500 rounded-lg overflow-hidden shadow-lg">
            <div className="absolute inset-0 flex items-center px-8">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-white mb-4">{category ? category.name : 'Danh mục sản phẩm'}</h1>
                <p className="text-green-100 text-lg">
                  Khám phá các sản phẩm {category ? category.name.toLowerCase() : ''} tự nhiên, 
                  hữu cơ và tốt cho sức khỏe tại NatureGrain.
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
                          <Link to="/categories" className="text-sm text-green-200 hover:text-white">
                            Danh mục
                          </Link>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <span className="mx-2 text-green-200">/</span>
                          <span className="text-sm font-medium text-white">
                            {category ? category.name : ''}
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

        <div className="flex flex-col md:flex-row gap-6">
          {/* Bộ lọc */}
          <div className="w-full md:w-1/4">
            <ProductFilter 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              productCount={filteredProducts.length}
            />
          </div>

          {/* Danh sách sản phẩm */}
          <div className="w-full md:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">Không tìm thấy sản phẩm nào trong danh mục này.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Phân trang */}
                {totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage;