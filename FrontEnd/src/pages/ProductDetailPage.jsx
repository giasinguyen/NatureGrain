import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductCard from '../components/ui/ProductCard';
import { toast } from 'react-toastify';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Fetch thông tin sản phẩm khi component được render
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    productService.getProduct(id)
      .then(response => {
        setProduct(response.data);
        setLoading(false);

        // Sau khi có thông tin sản phẩm, fetch sản phẩm liên quan
        if (response.data && response.data.category) {
          fetchRelatedProducts(response.data.category.id, response.data.id);
        }
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        setLoading(false);
        toast.error('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      });
  }, [id]);

  // Fetch sản phẩm liên quan
  const fetchRelatedProducts = (categoryId, productId) => {
    setLoadingRelated(true);
    
    productService.getProductsByCategory(categoryId)
      .then(response => {
        // Lọc ra sản phẩm hiện tại và giới hạn chỉ lấy 4 sản phẩm
        const filteredProducts = response.data
          .filter(p => p.id !== productId)
          .slice(0, 4);
        
        setRelatedProducts(filteredProducts);
        setLoadingRelated(false);
      })
      .catch(error => {
        console.error('Error fetching related products:', error);
        setLoadingRelated(false);
      });
  };

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Xử lý tăng giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  // Toggle yêu thích
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Thực tế sẽ gọi API để lưu trạng thái yêu thích
  };

  // Render stars for ratings
  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <span key={index}>
            {index < Math.floor(rating) ? (
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            ) : index < rating ? (
              <div className="relative">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating - Math.floor(rating)) * 100}%` }}>
                  <StarIconSolid className="h-5 w-5 text-yellow-400" />
                </div>
              </div>
            ) : (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            )}
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-500">({product?.reviewCount || 0} đánh giá)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sản phẩm không tồn tại</h1>
          <p className="mt-4 text-gray-600">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/products" className="btn-primary inline-block mt-6">
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  // Tạo mảng ảnh sản phẩm, bao gồm ảnh chính và các ảnh phụ
  const productImages = [
    product.image,
    ...(product.images || []).map(img => img.url),
  ].filter(Boolean);

  // Tính giá khuyến mãi nếu có
  const discountPrice = product.discount 
    ? (product.price * (1 - product.discount / 100)).toFixed(0) 
    : null;

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link to="/products" className="hover:text-primary-600">Sản phẩm</Link>
              <span className="mx-2">/</span>
            </li>
            {product.category && (
              <li>
                <Link to={`/categories/${product.category.id}`} className="hover:text-primary-600">
                  {product.category.name}
                </Link>
                <span className="mx-2">/</span>
              </li>
            )}
            <li className="text-gray-900 font-medium truncate">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Detail Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              {/* Hiển thị ảnh chính */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src={productImages[selectedImage] || 'https://via.placeholder.com/600x400?text=NatureGrain'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {/* Image thumbnails */}
              {productImages.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image || 'https://via.placeholder.com/100?text=NatureGrain'}
                        alt={`${product.name} - thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4">
                {discountPrice ? (
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-primary-600">
                      {parseInt(discountPrice).toLocaleString('vi-VN')}₫
                    </p>
                    <p className="ml-3 text-xl text-gray-500 line-through">
                      {product.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-primary-600">
                    {product.price.toLocaleString('vi-VN')}₫
                  </p>
                )}
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="mt-2">
                  {renderRatingStars(product.rating)}
                </div>
              )}

              {/* Short Description */}
              <div className="mt-4 text-gray-600">
                <p>{product.shortDescription}</p>
              </div>

              {/* Stock Status */}
              <div className="mt-4">
                <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                </p>
              </div>

              {/* Quantity */}
              {product.inStock && (
                <div className="mt-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng
                  </label>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600 rounded-l-md hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 text-center border-gray-300 border-y focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      className="px-3 py-1 border border-gray-300 bg-gray-100 text-gray-600 rounded-r-md hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`btn-primary flex-1 flex items-center justify-center py-3 ${
                    !product.inStock ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Thêm vào giỏ
                </button>
                <button
                  onClick={toggleFavorite}
                  className="btn-secondary flex items-center justify-center py-3 px-4"
                >
                  {isFavorite ? (
                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Categories */}
              {product.category && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Danh mục:</span>
                    <Link
                      to={`/categories/${product.category.id}`}
                      className="ml-2 text-sm text-primary-600 hover:text-primary-800"
                    >
                      {product.category.name}
                    </Link>
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center flex-wrap">
                    <span className="text-sm text-gray-500 mr-2">Tags:</span>
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2 mb-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Tabs */}
          <div className="border-t border-gray-200">
            <div className="px-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'description'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Mô tả chi tiết
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'reviews'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Đánh giá ({product.reviewCount || 0})
                  </button>
                </nav>
              </div>
            </div>

            <div className="px-6 py-8">
              {activeTab === 'description' ? (
                <div className="prose max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">{product.description || 'Không có mô tả cho sản phẩm này.'}</p>
                  {product.specifications && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900">Thông số kỹ thuật</h3>
                      <table className="min-w-full divide-y divide-gray-200 mt-3">
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <tr key={key}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">{key}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* Reviews content would go here - implemented when we have reviews data */}
                  <p className="text-gray-600">
                    Chức năng đánh giá đang được phát triển.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
          {loadingRelated ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : relatedProducts.length === 0 ? (
            <p className="text-gray-600">Không có sản phẩm liên quan.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}