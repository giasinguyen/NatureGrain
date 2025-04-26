import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import ProductFilter from '../components/ui/ProductFilter';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Trích xuất các tham số từ URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';
  
  // State cho bộ lọc
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: { 
      min: parseInt(searchParams.get('minPrice') || '0', 10), 
      max: parseInt(searchParams.get('maxPrice') || 'Infinity', 10) 
    },
    sortBy: searchParams.get('sort') || 'newest'
  });

  // Fetch danh mục khi component được render
  useEffect(() => {
    categoryService.getCategories()
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  // Fetch sản phẩm khi tham số URL hoặc bộ lọc thay đổi
  useEffect(() => {
    setLoading(true);
    
    const params = {
      page: currentPage - 1, // Backend page index thường bắt đầu từ 0
      size: 12,
      sort: getSortParams(filters.sortBy)
    };

    // Thêm tham số tìm kiếm nếu có
    if (searchQuery) {
      params.search = searchQuery;
    }

    // Thêm tham số danh mục nếu có
    if (filters.category) {
      params.categoryId = filters.category;
    }

    // Thêm tham số giá nếu không phải giá mặc định
    if (filters.priceRange.min > 0) {
      params.minPrice = filters.priceRange.min;
    }
    
    if (filters.priceRange.max < Infinity) {
      params.maxPrice = filters.priceRange.max;
    }

    // Gọi API để lấy sản phẩm theo các tham số
    productService.getProducts(params)
      .then(response => {
        setProducts(response.data.content || response.data);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
        setProducts([]);
      });
  }, [currentPage, searchQuery, filters]);

  // Chuyển đổi giá trị sắp xếp thành tham số API
  const getSortParams = (sortValue) => {
    switch(sortValue) {
      case 'newest':
        return 'createdDate,desc';
      case 'price-asc':
        return 'price,asc';
      case 'price-desc':
        return 'price,desc';
      case 'name-asc':
        return 'name,asc';
      case 'name-desc':
        return 'name,desc';
      default:
        return 'createdDate,desc';
    }
  };

  // Xử lý khi bộ lọc thay đổi
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Cập nhật URL với các tham số mới
    const newSearchParams = new URLSearchParams();
    
    // Reset về trang 1 khi thay đổi bộ lọc
    newSearchParams.set('page', '1');
    
    if (searchQuery) {
      newSearchParams.set('q', searchQuery);
    }
    
    if (newFilters.category) {
      newSearchParams.set('category', newFilters.category);
    }
    
    if (newFilters.priceRange.min > 0) {
      newSearchParams.set('minPrice', newFilters.priceRange.min);
    }
    
    if (newFilters.priceRange.max < Infinity) {
      newSearchParams.set('maxPrice', newFilters.priceRange.max);
    }
    
    newSearchParams.set('sort', newFilters.sortBy);
    
    setSearchParams(newSearchParams);
  };

  // Xử lý khi thay đổi trang
  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
    
    // Cuộn lên đầu trang khi thay đổi trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Sản phẩm
          </h1>
          {searchQuery && (
            <p className="mt-3 text-xl text-gray-500">
              Kết quả tìm kiếm cho "{searchQuery}"
            </p>
          )}
        </div>

        {/* Content */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <ProductFilter 
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Product grid */}
          <div className="mt-6 lg:mt-0 lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500">
                  Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.
                </p>
                <button 
                  onClick={() => handleFilterChange({
                    category: '',
                    priceRange: { min: 0, max: Infinity },
                    sortBy: 'newest'
                  })}
                  className="mt-4 btn-outline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}