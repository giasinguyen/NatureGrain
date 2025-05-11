import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist = () => {},
  onQuickView = () => {},
  isInWishlist = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(isInWishlist);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rippleEffect, setRippleEffect] = useState({ active: false, x: 0, y: 0 });
  const cardRef = useRef(null);

  // Hiệu ứng xuất hiện khi component render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, Math.random() * 300); // Random delay để tạo hiệu ứng staggered

    return () => clearTimeout(timer);
  }, []);

  // Theo dõi vị trí chuột cho hiệu ứng 3D
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = -(x - centerX) / 20;
    
    setMousePosition({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Hiệu ứng ripple khi click vào nút thêm giỏ hàng
  const createRipple = (e, btnElement) => {
    if (!btnElement) return;
    
    const rect = btnElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRippleEffect({ active: true, x, y });
    setTimeout(() => setRippleEffect({ active: false, x: 0, y: 0 }), 600);
  };

  if (!product) return null;

  const {
    id,
    name,
    price,
    discountPrice,
    category,
    quantity = 0,
    discount = 0,
    rating = Math.floor(Math.random() * 2) + 4, // Giả lập rating 4-5 sao cho demo
    soldCount = Math.floor(Math.random() * 100) + 10 // Giả lập số lượng đã bán cho demo
  } = product;

  // Image handling - get image from backend
  const getImageUrl = () => {
    // Access image from product.images if it exists
    if (product.images && product.images.length > 0) {
      // Use the image name to access from static resources
      return `http://localhost:8080/photos/${product.images[0].name}`;
    }
    
    // Fallback to check if there's a specific image property
    if (product.imageUrl) {
      return product.imageUrl;
    }
    
    // Final fallback to dummy image
    return '/Naturegrain.png';
  };
  
  const inStock = quantity > 0;
  const isOrganic = category?.name?.toLowerCase().includes('organic');
  const categoryName = category?.name;
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && inStock) {
      createRipple(e, e.currentTarget);
      onAddToCart(product);
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    onToggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);

  const formattedDiscountPrice = discountPrice 
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountPrice)
    : null;
  // Renders raring stars
  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span key={index}>
          {starValue <= rating ? (
            <StarSolidIcon className="h-3.5 w-3.5 text-yellow-400" />
          ) : starValue - 0.5 <= rating ? (
            <StarIcon className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 fill-[50%]" />
          ) : (
            <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
          )}
        </span>
      );
    });
  };

  const cardStyle = {
    transform: isHovered ? `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)` : 'perspective(1000px) rotateX(0) rotateY(0)',
    transition: isHovered ? 'transform 0.1s ease' : 'transform 0.5s ease',
  };

  return (
    <div 
      ref={cardRef}
      className={`group relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-xl 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >      {/* Badge giảm giá */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <div className="relative">
            <div className="bg-red-500 text-white text-xs font-bold py-1.5 px-3 rounded-full 
                          transform transition-transform duration-300 group-hover:scale-110 shadow-md">
              -{discount}%
            </div>
            <div className="absolute -inset-0.5 bg-red-500 rounded-full blur opacity-30 
                          group-hover:opacity-60 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Badge hữu cơ */}
      {isOrganic && (
        <div className="absolute top-3 left-3 z-10">
          <div className="relative">
            <div className="bg-green-500 text-white text-xs font-bold py-1.5 px-3 rounded-full
                          flex items-center gap-1 transform transition-transform duration-300 group-hover:scale-110 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Organic
            </div>
            <div className="absolute -inset-0.5 bg-green-500 rounded-full blur opacity-30 
                          group-hover:opacity-60 animate-pulse"></div>
          </div>
        </div>
      )}{/* Hiệu ứng pulse loading khi chưa tải */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 bg-gray-100 animate-pulse" />
      )}

      {/* Hết hàng */}
      {!inStock && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="relative">
            <span className="bg-white text-gray-800 font-bold py-2 px-4 rounded-md shadow-lg transform -rotate-6">
              Hết hàng
            </span>
            <div className="absolute -inset-1 bg-white blur opacity-30 rounded-md"></div>
          </div>
        </div>
      )}

      {/* Ảnh sản phẩm */}
      <Link to={`/products/${id}`} className="block relative overflow-hidden pt-[100%]">
        <img
          src={getImageUrl()}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500
                      group-hover:scale-110 filter ${isHovered ? 'brightness-105' : 'brightness-100'}`}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            e.target.src = '/dummy.png';
            setIsLoaded(true);
          }}
        />
        
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 
                        transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}></div>
          {/* Các nút action khi hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 
                    ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <button
            onClick={handleQuickView}
            className="bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 
                     transform hover:scale-110 hover:-translate-y-1"
            title="Xem nhanh"
            disabled={!inStock}
            style={{animationDelay: '0.1s'}}
          >
            <EyeIcon className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`p-2.5 rounded-full shadow-lg transition-all duration-300 
                      transform hover:scale-110 hover:-translate-y-1 ${liked ? 'bg-red-500' : 'bg-white hover:bg-gray-100'}`}
            title={liked ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
            style={{animationDelay: '0.2s'}}
          >
            {liked ? (
              <HeartSolidIcon className="h-5 w-5 text-white" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-700" />
            )}
          </button>
          <button
            onClick={handleAddToCart}
            className={`relative overflow-hidden bg-white p-2.5 rounded-full shadow-lg transition-all duration-300 
                      transform hover:scale-110 hover:-translate-y-1 ${
              inStock ? 'hover:bg-green-50' : 'opacity-60 cursor-not-allowed'
            }`}
            title={inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
            disabled={!inStock}
            style={{animationDelay: '0.3s'}}
          >
            <ShoppingCartIcon className="h-5 w-5 text-gray-700" />
            {rippleEffect.active && (
              <span 
                className="absolute rounded-full bg-green-200 animate-ripple" 
                style={{ 
                  top: rippleEffect.y - 50,
                  left: rippleEffect.x - 50,
                  width: 100,
                  height: 100
                }}
              />
            )}
          </button>
        </div>
      </Link>      {/* Thông tin sản phẩm */}
      <div className="p-4 relative z-10">
        {categoryName && (
          <Link 
            to={`/categories/${category.id}`} 
            className="text-xs text-green-600 hover:text-green-700 hover:underline mb-1.5 block font-medium"
          >
            {categoryName}
          </Link>
        )}
        
        <Link 
          to={`/products/${id}`}
          className="text-gray-800 font-semibold text-sm hover:text-green-600 transition-colors line-clamp-2 h-10 block"
        >
          {name}
        </Link>

        {/* Rating và số lượng đã bán */}
        <div className="flex items-center text-xs mt-2 mb-3 gap-2">
          <div className="flex items-center">
            {renderRatingStars(rating)}
            <span className="text-gray-600 ml-1">{rating.toFixed(1)}</span>
          </div>
          <span className="h-3 w-px bg-gray-300"></span>
          <span className="text-gray-500">Đã bán {soldCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`font-bold ${discountPrice ? 'text-red-600' : 'text-gray-800'}`}>
              {formattedDiscountPrice || formattedPrice}
            </span>
            {formattedDiscountPrice && (
              <span className="text-gray-400 text-xs line-through mt-0.5">
                {formattedPrice}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            className={`relative overflow-hidden text-sm font-medium rounded-full px-4 py-1.5 transition-all
              ${inStock
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg active:shadow-sm'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            disabled={!inStock}
          >
            <div className="flex items-center gap-1">
              <ShoppingCartIcon className="h-3.5 w-3.5" />
              <span>{inStock ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
            </div>
            {rippleEffect.active && (
              <span 
                className="absolute rounded-full bg-white/25 animate-ripple" 
                style={{ 
                  top: rippleEffect.y - 50,
                  left: rippleEffect.x - 50,
                  width: 100,
                  height: 100
                }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;