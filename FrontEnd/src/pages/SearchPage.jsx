import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import ProductFilter from '../components/ui/ProductFilter';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  // Lấy các tham số tìm kiếm từ URL
  const searchQuery = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;
  const sortType = searchParams.get('sort') || 'latest';
  const categoryParam = searchParams.get('category');
  const categoryId = categoryParam ? parseInt(categoryParam, 10) : null;
  const minPrice = parseInt(searchParams.get('minPrice') || '0', 10);
  const maxPrice = parseInt(searchParams.get('maxPrice') || '1000000', 10);

  // Lấy dữ liệu sản phẩm và danh mục
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories first (we only need to do this once)
        if (categories.length === 0) {
          const categoriesRes = await categoryService.getCategories();
          setCategories(categoriesRes.data || []);
        }
        
        // Fetch products based on search query
        let productsRes;
        if (!searchQuery || searchQuery.trim() === '') {
          // If no search query, show no results
          setAllProducts([]);
          setProducts([]);
          setTotalItems(0);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        
        productsRes = await productService.searchProducts(searchQuery);
        const searchResults = productsRes.data || [];
        setAllProducts(searchResults);
        
        // Apply additional filters after search
        let filteredResults = [...searchResults];
        
        // Apply category filter if selected
        if (categoryId) {
          filteredResults = filteredResults.filter(
            product => product.category && product.category.id === categoryId
          );
        }
        
        // Apply price filter
        if (minPrice !== 0 || maxPrice !== 1000000) {
          filteredResults = filteredResults.filter(
            product => product.price >= minPrice && product.price <= maxPrice
          );
        }
        
        // Apply sorting
        if (sortType === 'price-asc') {
          filteredResults.sort((a, b) => a.price - b.price);
        } else if (sortType === 'price-desc') {
          filteredResults.sort((a, b) => b.price - a.price);
        } else if (sortType === 'name-asc') {
          filteredResults.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortType === 'name-desc') {
          filteredResults.sort((a, b) => b.name.localeCompare(a.name));
        }
        
        setTotalItems(filteredResults.length);
        
        // Calculate total pages based on page size
        const calculatedTotalPages = Math.ceil(filteredResults.length / pageSize);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        
        // Handle client-side pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedProducts = filteredResults.slice(startIndex, endIndex);
        
        setProducts(paginatedProducts);
      } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, categories.length]);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filters) => {
    const newParams = new URLSearchParams();
    
    // Keep search query
    if (searchQuery) {
      newParams.set('q', searchQuery);
    }
    
    // Always reset to page 1 when filters change
    newParams.set('page', '1');
    
    // Set sort type
    if (filters.sort) {
      newParams.set('sort', filters.sort);
    }
    
    // Set category filter
    if (filters.category) {
      newParams.set('category', filters.category);
    }
    
    // Set price range
    if (filters.priceRange && filters.priceRange.includes('-')) {
      const [min, max] = filters.priceRange.split('-');
      newParams.set('minPrice', min);
      newParams.set('maxPrice', max);
    }
    
    setSearchParams(newParams);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  // Định nghĩa các khoảng giá
  const priceRanges = [
    { value: '0-50000', label: 'Dưới 50,000₫' },
    { value: '50000-100000', label: '50,000₫ - 100,000₫' },
    { value: '100000-200000', label: '100,000₫ - 200,000₫' },
    { value: '200000-500000', label: '200,000₫ - 500,000₫' },
    { value: '500000-1000000', label: 'Trên 500,000₫' }
  ];

  // Tạo giá trị khởi tạo cho bộ lọc từ URL params
  const selectedFilters = {
    category: categoryId || '',
    priceRange: searchParams.get('minPrice') && searchParams.get('maxPrice') 
      ? `${searchParams.get('minPrice')}-${searchParams.get('maxPrice')}`
      : '',
    sort: sortType
  };

  // Xác định tiêu đề và thông báo dựa trên kết quả tìm kiếm
  const getSearchResultMessage = () => {
    if (!searchQuery) {
      return 'Hãy nhập từ khóa để tìm kiếm sản phẩm';
    }
    
    if (totalItems === 0) {
      return `Không tìm thấy kết quả nào cho "${searchQuery}"`;
    }
    
    return `Tìm thấy ${totalItems} kết quả cho "${searchQuery}"`;
  };

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Kết quả tìm kiếm</h1>
          <p className="text-gray-600 mt-2">{getSearchResultMessage()}</p>
        </div>

        {searchQuery ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter sidebar */}
            <div className="w-full lg:w-1/4">
              <ProductFilter 
                categories={categories}
                priceRanges={priceRanges}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Product grid */}
            <div className="w-full lg:w-3/4">
              {loading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                      Hiển thị {products.length} trên tổng số {totalItems} sản phẩm
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Rất tiếc, chúng tôi không thể tìm thấy sản phẩm nào phù hợp với từ khóa "{searchQuery}".
                    Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Tìm kiếm sản phẩm</h3>
            <p className="text-gray-500 text-center max-w-md">
              Vui lòng nhập từ khóa vào ô tìm kiếm phía trên để tìm kiếm các sản phẩm bạn đang quan tâm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;