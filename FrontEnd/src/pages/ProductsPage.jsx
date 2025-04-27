import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import ProductFilter from '../components/ui/ProductFilter';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Lấy các tham số tìm kiếm từ URL
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
        
        // Prepare filter params for product fetch
        let productsRes;
        
        if (categoryId) {
          // If category filter is applied
          productsRes = await productService.getProductsByCategory(categoryId);
        } 
        else if (minPrice !== 0 || maxPrice !== 1000000) {
          // If price range filter is applied
          productsRes = await productService.getProducts({
            minPrice: minPrice,
            maxPrice: maxPrice
          });
        } 
        else {
          // Default - get all products
          productsRes = await productService.getProducts({});
        }
        
        // Handle the products response
        const productData = productsRes.data || [];
        setProducts(productData);
        setTotalItems(productData.length);
        
        // Calculate total pages based on page size
        const calculatedTotalPages = Math.ceil(productData.length / pageSize);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        
        // Handle client-side pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedProducts = productData.slice(startIndex, endIndex);
        setProducts(paginatedProducts);
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, categories.length]);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filters) => {
    const newParams = new URLSearchParams();
    
    // Always reset to page 1 when filters change
    newParams.set('page', '1');
    
    // Set sort type
    if (filters.sort && filters.sort !== 'newest') {
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

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tất cả sản phẩm</h1>
          <p className="text-gray-600 mt-2">Khám phá các sản phẩm organic chất lượng cao</p>
        </div>

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
                  Rất tiếc, chúng tôi không thể tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn. 
                  Vui lòng thử lại với các tiêu chí khác.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;