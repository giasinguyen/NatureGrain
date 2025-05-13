import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ui/ProductCard';
import ProductFilter from '../components/ui/ProductFilter';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { getImageUrlWithCacheBuster, loadImageProgressively } from '../utils/imageUtils';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewLoading, setQuickViewLoading] = useState(false);
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);

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
  // Xử lý xem nhanh sản phẩm
  const handleQuickView = async (product) => {
    setQuickViewProduct(product);
    setQuickViewQuantity(1);
    
    // Nếu cần tải thêm thông tin chi tiết
    if (!product.description) {
      setQuickViewLoading(true);
      try {
        const response = await productService.getProduct(product.id);
        if (response.data) {
          setQuickViewProduct({...product, ...response.data});
        }
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setQuickViewLoading(false);
      }
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: quickViewQuantity || 1,
      image: product.images && product.images.length > 0 
        ? `http://localhost:8080/photos/${product.images[0].name}` 
        : '/dummy.png'
    });
  };
  
  // Hàm render đánh giá sao
  const renderRatingStars = (rating = 4.5) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span key={index}>
          {starValue <= rating ? (
            <StarSolidIcon className="h-4 w-4 text-yellow-400" />
          ) : starValue - 0.5 <= rating ? (
            <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400 fill-[50%]" />
          ) : (
            <StarIcon className="h-4 w-4 text-yellow-400" />
          )}
        </span>
      );
    });
  };

  // Đóng modal xem nhanh
  const closeQuickView = () => {
    setQuickViewProduct(null);
    setQuickViewQuantity(1);
  };

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4"><div className="mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-fadeIn">Tất cả sản phẩm</h1>
            <div className="h-1 w-24 bg-green-500 mb-4 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl animate-fadeIn opacity-0" style={{animationDelay: '200ms', animationFillMode: 'forwards'}}>
              Khám phá các sản phẩm organic chất lượng cao, được trồng và thu hoạch theo tiêu chuẩn nghiêm ngặt, 
              để mang đến cho bạn những trải nghiệm ẩm thực tự nhiên và lành mạnh nhất.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full filter blur-3xl opacity-20 -z-10 transform translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-100 rounded-full filter blur-2xl opacity-20 -z-10 transform -translate-x-1/3 translate-y-1/2"></div>
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
          <div className="w-full lg:w-3/4">            {loading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <LoadingSpinner size="lg" type="logo" />
              </div>
            ): products.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Hiển thị {products.length} trên tổng số {totalItems} sản phẩm
                  </p>
                </div>                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="transform transition-all duration-500"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard 
                        product={product} 
                        onAddToCart={() => handleAddToCart(product)} 
                        onQuickView={() => handleQuickView(product)} 
                      />
                    </div>
                  ))}
                </div>
                
                {/* Quick View Modal */}
                {quickViewProduct && (
                  <Modal 
                    isOpen={Boolean(quickViewProduct)} 
                    onClose={closeQuickView} 
                    title="Chi tiết sản phẩm"
                    size="lg"
                  >
                    {quickViewLoading ? (
                      <div className="flex justify-center py-10">
                        <LoadingSpinner type="dots" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Hình ảnh sản phẩm */}                        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                          <img 
                            ref={imageRef => {
                              if (imageRef) {
                                loadImageProgressively({
                                  imgElement: imageRef,
                                  src: {
                                    url: quickViewProduct.images && quickViewProduct.images.length > 0 
                                      ? `http://localhost:8080/photos/${quickViewProduct.images[0].name}` 
                                      : null,
                                    id: quickViewProduct.images && quickViewProduct.images.length > 0 
                                      ? quickViewProduct.images[0]?.id 
                                      : null,
                                    options: { 
                                      width: 600, 
                                      height: 600,
                                      quality: 'auto',
                                      crop: 'fill' 
                                    }
                                  },
                                  onSuccess: () => console.log(`Quick view image loaded successfully`),
                                  onError: () => console.log(`Failed to load quick view image, using fallback`),
                                  fallbackUrl: '/dummy.png'
                                });
                              }
                            }}
                            alt={quickViewProduct.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                          
                          {/* Badge giảm giá */}
                          {quickViewProduct.discount > 0 && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              -{quickViewProduct.discount}%
                            </div>
                          )}
                          
                          {/* Badge organic */}
                          {quickViewProduct.category?.name?.toLowerCase().includes('organic') && (
                            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              Organic
                            </div>
                          )}
                        </div>
                        
                        {/* Thông tin sản phẩm */}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{quickViewProduct.name}</h3>
                          
                          <div className="flex items-center mb-4">
                            <div className="flex mr-2">
                              {renderRatingStars(4.5)}
                            </div>
                            <span className="text-gray-500 text-sm">123 đánh giá</span>
                          </div>
                          
                          <div className="mb-4">
                            {quickViewProduct.discountPrice ? (
                              <div className="flex items-center">
                                <span className="text-2xl font-bold text-red-600 mr-2">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(quickViewProduct.discountPrice)}
                                </span>
                                <span className="text-gray-500 line-through">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(quickViewProduct.price)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-2xl font-bold text-gray-800">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(quickViewProduct.price)}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-6 line-clamp-3">
                            {quickViewProduct.description || 'Không có mô tả chi tiết cho sản phẩm này.'}
                          </p>
                          
                          <div className="flex items-center mb-6">
                            <span className="text-gray-700 mr-3">Số lượng:</span>
                            <div className="flex border border-gray-300 rounded">
                              <button 
                                className="w-8 h-8 flex items-center justify-center border-r border-gray-300 bg-gray-100"
                                onClick={() => setQuickViewQuantity(prev => Math.max(1, prev - 1))}
                              >
                                -
                              </button>
                              <div className="w-10 h-8 flex items-center justify-center">
                                {quickViewQuantity}
                              </div>
                              <button 
                                className="w-8 h-8 flex items-center justify-center border-l border-gray-300 bg-gray-100"
                                onClick={() => setQuickViewQuantity(prev => prev + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                              onClick={() => {
                                handleAddToCart(quickViewProduct);
                                closeQuickView();
                              }}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center justify-center transition-colors"
                            >
                              <ShoppingCartIcon className="w-5 h-5 mr-2" />
                              Thêm vào giỏ
                            </button>
                            
                            <Link 
                              to={`/products/${quickViewProduct.id}`}
                              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </Modal>
                )}

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
            ) : (              <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-10 border border-gray-100">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Rất tiếc, chúng tôi không thể tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn. 
                  Vui lòng thử lại với các tiêu chí khác.
                </p>
                <button 
                  onClick={() => handleFilterChange({category: '', priceRange: '', sort: 'latest'})}
                  className="bg-green-600 text-white font-medium px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;