import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  StarIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import { getImageUrl } from '../../utils/imageUtils';

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist = () => {},
  onQuickView = () => {},
  onCompare = () => {},
  isInWishlist = false,
  showCompare = false,
  showNutrition = true,
  showDelivery = true,
  showSustainability = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(isInWishlist);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rippleEffect, setRippleEffect] = useState({ active: false, x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNutritionInfo, setShowNutritionInfo] = useState(false);
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

  // Intersection Observer to check if card is visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  if (!product) return null;

  const {
    id,
    name,
    price,
    discountPrice,
    category,
    quantity = 0,
    discount = 0,
    rating = Math.floor(Math.random() * 2) + 4, // Sẽ được thay thế bằng dữ liệu thật từ backend
    soldCount = Math.floor(Math.random() * 100) + 10, // Sẽ được thay thế bằng dữ liệu thật từ backend
    description,
    origin,
    nutritionBenefits = [],
    certifications = [],
    expiryDate,
    sustainabilityScore = Math.floor(Math.random() * 3) + 3, // 3-5 điểm sustainability
    deliveryDays = Math.floor(Math.random() * 3) + 1, // 1-3 ngày giao hàng
    isBestseller = Math.random() > 0.7,
    isNew = Math.random() > 0.8,
    reviewCount = Math.floor(Math.random() * 200) + 50
  } = product;

  const inStock = quantity > 0;
  const isOrganic = category?.name?.toLowerCase().includes('organic') || 
                   certifications?.some(cert => cert.toLowerCase().includes('organic'));
  const categoryName = category?.name;
  
  // Tính toán độ tươi dựa trên ngày hết hạn
  const freshnessDays = expiryDate ? 
    Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const isExpiringSoon = freshnessDays && freshnessDays <= 7;
  
  // Tooltip content cho dinh dưỡng
  const nutritionTooltip = nutritionBenefits?.length > 0 ? 
    nutritionBenefits.slice(0, 3).join(', ') + (nutritionBenefits.length > 3 ? '...' : '') : 
    'Thông tin dinh dưỡng đang được cập nhật';  const handleAddToCart = (e) => {
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

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompare) {
      onCompare(product);
    }
  };

  const handleNutritionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNutritionInfo(!showNutritionInfo);
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
            <StarSolidIcon className="h-3.5 w-3.5 text-yellow-400" />          ) : starValue - 0.5 <= rating ? (
            <StarIcon className="h-3.5 w-3.5 text-yellow-400" style={{ fill: "rgb(250 204 21)", fillOpacity: "50%" }} />
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
  };  // No longer need handleImageError as we're using loadImageProgressively
  return (
    <div 
      ref={cardRef}
      className={`group relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-xl 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Badges container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {/* Badge hữu cơ */}
        {isOrganic && (
          <div className="relative">
            <div className="bg-green-500 text-white text-xs font-bold py-1.5 px-3 rounded-full
                          flex items-center gap-1 transform transition-transform duration-300 group-hover:scale-110 shadow-md">
              <ShieldCheckSolidIcon className="h-3 w-3" />
              Organic
            </div>
            <div className="absolute -inset-0.5 bg-green-500 rounded-full blur opacity-30 
                          group-hover:opacity-60 animate-pulse"></div>
          </div>
        )}

        {/* Badge bestseller */}
        {isBestseller && (
          <div className="relative">
            <div className="bg-yellow-500 text-white text-xs font-bold py-1.5 px-3 rounded-full
                          flex items-center gap-1 transform transition-transform duration-300 group-hover:scale-110 shadow-md">
              <FireIcon className="h-3 w-3" />
              Bán chạy
            </div>
            <div className="absolute -inset-0.5 bg-yellow-500 rounded-full blur opacity-30 
                          group-hover:opacity-60 animate-pulse"></div>
          </div>
        )}

        {/* Badge mới */}
        {isNew && (
          <div className="relative">
            <div className="bg-blue-500 text-white text-xs font-bold py-1.5 px-3 rounded-full
                          flex items-center gap-1 transform transition-transform duration-300 group-hover:scale-110 shadow-md">
              <SparklesIcon className="h-3 w-3" />
              Mới
            </div>
            <div className="absolute -inset-0.5 bg-blue-500 rounded-full blur opacity-30 
                          group-hover:opacity-60 animate-pulse"></div>
          </div>
        )}

        {/* Badge sắp hết hạn */}
        {isExpiringSoon && (
          <div className="relative">
            <div className="bg-orange-500 text-white text-xs font-bold py-1.5 px-3 rounded-full
                          flex items-center gap-1 transform transition-transform duration-300 group-hover:scale-110 shadow-md">
              <CalendarDaysIcon className="h-3 w-3" />
              Còn {freshnessDays} ngày
            </div>
            <div className="absolute -inset-0.5 bg-orange-500 rounded-full blur opacity-30 
                          group-hover:opacity-60 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Right side badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {/* Badge giảm giá */}
        {discount > 0 && (
          <div className="relative">
            <div className="bg-red-500 text-white text-xs font-bold py-1.5 px-3 rounded-full 
                          transform transition-transform duration-300 group-hover:scale-110 shadow-md">
              -{discount}%
            </div>
            <div className="absolute -inset-0.5 bg-red-500 rounded-full blur opacity-30 
                          group-hover:opacity-60 animate-pulse"></div>
          </div>
        )}

        {/* Sustainability score */}
        {showSustainability && sustainabilityScore >= 4 && (
          <div className="relative">
            <div className="bg-green-600 text-white text-xs font-bold py-1.5 px-3 rounded-full
                          flex items-center gap-1 transform transition-transform duration-300 group-hover:scale-110 shadow-md">
              <ShieldCheckIcon className="h-3 w-3" />
              Eco {sustainabilityScore}/5
            </div>
            <div className="absolute -inset-0.5 bg-green-600 rounded-full blur opacity-30 
                          group-hover:opacity-60 animate-pulse"></div>
          </div>
        )}
      </div>{/* Hiệu ứng pulse loading khi chưa tải */}
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
      )}      {/* Ảnh sản phẩm */}
      <Link to={`/products/${id}`} className="block relative overflow-hidden pt-[100%]">
        {/* Only load image when card is visible in viewport */}
        {isVisible && (
          <>
            {/* Empty SVG placeholder first */}
            <img
              ref={imageRef => {
                if (imageRef) {
                  // Use progressive image loading when the ref is available
                  loadImageProgressively({
                    imgElement: imageRef,
                    src: {
                      product,
                      options: { 
                        width: 300, 
                        quality: 'auto',
                        crop: 'fill'
                      }
                    },
                    onSuccess: () => setIsLoaded(true),
                    onError: () => {
                      console.log(`Failed to load image for ${name}, using fallback`);
                      setIsLoaded(true);
                    },
                    fallbackUrl: '/dummy.png'
                  });
                }
              }}
              alt={name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500
                      group-hover:scale-110 filter ${isHovered ? 'brightness-105' : 'brightness-100'}`}
              loading="lazy"
              decoding="async"
            />
          </>
        )}
        
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 
                        transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}></div>
            {/* Các nút action khi hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 
                    ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Nutrition info button */}
          {showNutrition && nutritionBenefits?.length > 0 && (
            <button
              onClick={handleNutritionClick}
              className="bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 
                       transform hover:scale-110 hover:-translate-y-1 relative group/tooltip"
              title="Thông tin dinh dưỡng"
              style={{animationDelay: '0.05s'}}
            >
              <BeakerIcon className="h-5 w-5 text-gray-700" />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                {nutritionTooltip}
              </div>
            </button>
          )}

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

          {/* Compare button */}
          {showCompare && (
            <button
              onClick={handleCompare}
              className="bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 
                       transform hover:scale-110 hover:-translate-y-1"
              title="So sánh sản phẩm"
              style={{animationDelay: '0.15s'}}
            >
              <ArrowsRightLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
          )}

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
                        inStock ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
                      }`}
            disabled={!inStock}
            title={inStock ? "Thêm vào giỏ hàng" : "Sản phẩm hết hàng"}
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
          
          {/* Quick add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`p-2 rounded-full ${
              inStock
                ? 'bg-green-50 text-green-600 hover:bg-green-100 transition-colors'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            title={inStock ? "Thêm vào giỏ hàng" : "Sản phẩm hết hàng"}
          >
            <ShoppingCartIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;