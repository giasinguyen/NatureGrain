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
  const categoryIds = categoryParam ? categoryParam.split(',').map(id => parseInt(id, 10)) : [];
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
          setCategories(categoriesRes.data);
        }
        
        // Prepare filter params for product fetch
        const params = {
          page: currentPage - 1, // API uses 0-based indexing
          size: pageSize,
          sort: sortType
        };
        
        // Add category filter if selected
        if (categoryIds.length > 0) {
          params.categoryIds = categoryIds.join(',');
        }
        
        // Add price range filter
        params.minPrice = minPrice;
        params.maxPrice = maxPrice;

        // Fetch products with filters
        const productsRes = await productService.getProducts(params);
        setProducts(productsRes.data.content || []);
        setTotalItems(productsRes.data.totalElements || 0);
        setTotalPages(productsRes.data.totalPages || 1);
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
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
    if (filters.sort !== 'latest') {
      newParams.set('sort', filters.sort);
    }
    
    // Set category filter
    if (filters.category && filters.category.length > 0) {
      newParams.set('category', filters.category.join(','));
    }
    
    // Set price range
    if (filters.price.min > 0) {
      newParams.set('minPrice', filters.price.min.toString());
    }
    
    if (filters.price.max < 1000000) {
      newParams.set('maxPrice', filters.price.max.toString());
    }
    
    setSearchParams(newParams);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  // Tạo giá trị khởi tạo cho bộ lọc từ URL params
  const initialFilters = {
    category: categoryIds,
    sort: sortType,
    price: {
      min: minPrice,
      max: maxPrice
    }
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
              priceRange={{ min: 0, max: 1000000 }}
              onFilterChange={handleFilterChange}
              initialFilters={initialFilters}
            />
          </div>

          {/* Product grid */}
          <div className="w-full lg:w-3/4">
            {loading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <LoadingSpinner size="lg" />
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
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8">
                <img 
                  src="/empty-result.svg" 
                  alt="Không tìm thấy sản phẩm" 
                  className="w-32 h-32 mb-4 opacity-50"
                />
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