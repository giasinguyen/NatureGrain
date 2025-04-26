import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  HeartIcon,
  MinusIcon,
  PlusIcon,
  CheckIcon,
  StarIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductCard from '../components/ui/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Đánh giá sản phẩm mẫu
  const sampleReviews = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      date: '2025-03-15',
      rating: 5,
      comment: 'Sản phẩm rất tươi ngon, đóng gói cẩn thận. Tôi rất hài lòng và sẽ mua lại.',
      avatar: '/avatar-1.jpg',
    },
    {
      id: 2,
      user: 'Trần Thị B',
      date: '2025-03-10',
      rating: 4,
      comment: 'Chất lượng tốt, giao hàng nhanh. Giá hơi cao một chút nhưng xứng đáng với chất lượng.',
      avatar: '/avatar-2.jpg',
    },
    {
      id: 3,
      user: 'Lê Văn C',
      date: '2025-03-05',
      rating: 5,
      comment: 'Rất hài lòng với chất lượng sản phẩm. Sẽ mua lại lần sau.',
      avatar: '/avatar-3.jpg',
    },
  ];
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await productService.getProduct(id);
        setProduct(response.data);
        
        // Fetch related products
        if (response.data.categoryId) {
          const relatedResponse = await productService.getProductsByCategory(response.data.categoryId);
          // Filter out current product and limit to 4 items
          const filteredProducts = relatedResponse.data
            .filter(item => item.id !== parseInt(id))
            .slice(0, 4);
          setRelatedProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);
  
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <img 
          src="/product-not-found.svg" 
          alt="Không tìm thấy sản phẩm" 
          className="w-64 h-64 mb-6 opacity-50"
        />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Rất tiếc, chúng tôi không thể tìm thấy sản phẩm bạn đang tìm kiếm.
        </p>
        <Link 
          to="/products" 
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Quay lại trang sản phẩm
        </Link>
      </div>
    );
  }
  
  // Tính giá khuyến mãi nếu có
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100) 
    : null;
  
  // Tạo mảng ảnh sản phẩm (giả sử có nhiều ảnh)
  const productImages = [
    product.image,
    product.image2 || product.image,
    product.image3 || product.image,
    product.image4 || product.image
  ].filter(Boolean); // Lọc bỏ các giá trị falsy
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-600">Trang chủ</Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <Link to="/products" className="hover:text-green-600">Sản phẩm</Link>
          {product.categoryName && (
            <>
              <ChevronRightIcon className="w-4 h-4 mx-2" />
              <Link to={`/categories/${product.categoryId}`} className="hover:text-green-600">
                {product.categoryName}
              </Link>
            </>
          )}
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="font-medium text-gray-700 truncate max-w-[150px]">{product.name}</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="mb-4 aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {productImages.length > 1 && (
                <div className="flex gap-3">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      className={`w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-green-500' : 'border-gray-200'}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - Ảnh ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              {/* Ratings */}
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewCount || 0} đánh giá)
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-600">
                  Đã bán: {product.soldCount || 0}
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                {discountedPrice ? (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-green-600 mr-3">
                      {discountedPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="ml-3 text-sm font-medium text-red-500 bg-red-50 px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-green-600">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>
              
              {/* Short description */}
              <p className="text-gray-600 mb-6">
                {product.shortDescription || product.description?.substring(0, 150) + '...'}
              </p>
              
              {/* Quantity & Add to cart */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Số lượng:</p>
                <div className="flex items-center">
                  <div className="flex items-center border border-gray-300 rounded-md mr-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-1 text-gray-600 hover:text-green-600"
                      disabled={quantity <= 1}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-1 text-gray-600 hover:text-green-600"
                      disabled={quantity >= (product.stock || 10)}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.stock || 10} sản phẩm có sẵn
                  </span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleFavoriteToggle}
                  className="flex items-center justify-center bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {/* Product attributes */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  {product.origin && (
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-24">Xuất xứ:</span>
                      <span className="text-sm text-gray-800">{product.origin}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-24">Trọng lượng:</span>
                      <span className="text-sm text-gray-800">{product.weight}</span>
                    </div>
                  )}
                  {product.unit && (
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-24">Đơn vị:</span>
                      <span className="text-sm text-gray-800">{product.unit}</span>
                    </div>
                  )}
                  {product.categoryName && (
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-24">Danh mục:</span>
                      <Link 
                        to={`/categories/${product.categoryId}`}
                        className="text-sm text-green-600 hover:underline"
                      >
                        {product.categoryName}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Delivery & policy info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Cam kết 100% chính hãng</span>
                </div>
                <div className="flex items-center">
                  <TruckIcon className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Giao hàng toàn quốc</span>
                </div>
                <div className="flex items-center">
                  <ArrowPathIcon className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Đổi trả trong 7 ngày</span>
                </div>
                <div className="flex items-center">
                  <TicketIcon className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Giảm 5% khi thanh toán online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs: Description, Specifications, Reviews */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-10">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'description'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Mô tả sản phẩm
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'specifications'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('specifications')}
              >
                Thông số kỹ thuật
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Đánh giá ({sampleReviews.length})
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description || 'Chưa có thông tin mô tả cho sản phẩm này.' }} />
            )}
            
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500">Xuất xứ</td>
                      <td className="py-3 text-sm text-gray-800">{product.origin || 'Chưa có thông tin'}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500">Trọng lượng</td>
                      <td className="py-3 text-sm text-gray-800">{product.weight || 'Chưa có thông tin'}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500">Thương hiệu</td>
                      <td className="py-3 text-sm text-gray-800">{product.brand || 'Chưa có thông tin'}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500">Thành phần</td>
                      <td className="py-3 text-sm text-gray-800">{product.ingredients || 'Chưa có thông tin'}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500">Hướng dẫn bảo quản</td>
                      <td className="py-3 text-sm text-gray-800">{product.storageInstructions || 'Bảo quản nơi khô ráo, thoáng mát'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                {/* Rating summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="text-center md:text-left md:mr-8">
                      <div className="text-5xl font-bold text-gray-800">{product.rating || 4.8}</div>
                      <div className="flex justify-center md:justify-start mt-2">
                        {[...Array(5)].map((_, i) => (
                          <StarSolidIcon 
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(product.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{product.reviewCount || sampleReviews.length} đánh giá</div>
                    </div>
                    <div className="flex-1 w-full md:w-auto mt-4 md:mt-0">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center">
                            <span className="text-sm text-gray-600 w-8">{star} sao</span>
                            <div className="flex-1 mx-3">
                              <div className="h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-yellow-400 rounded-full"
                                  style={{ 
                                    width: `${sampleReviews.filter(r => Math.floor(r.rating) === star).length / sampleReviews.length * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {sampleReviews.filter(r => Math.floor(r.rating) === star).length}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Review list */}
                <div className="space-y-6">
                  {sampleReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center mb-3">
                        <img 
                          src={review.avatar || '/default-avatar.jpg'} 
                          alt={review.user} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{review.user}</div>
                          <div className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('vi-VN')}</div>
                        </div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarSolidIcon 
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;