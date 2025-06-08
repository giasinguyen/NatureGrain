import { useState } from 'react';
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
  isInWishlist = false
}) => {
  const [liked, setLiked] = useState(isInWishlist);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const {
    id,
    name,
    price,
    discountPrice,
    category,
    quantity = 0,
    discount = 0,
    rating = 4.5,
    image
  } = product;

  const inStock = quantity > 0;
  const categoryName = category?.name || 'Sản phẩm';
  const hasDiscount = discount > 0 && discountPrice;
  const finalPrice = hasDiscount ? discountPrice : price;

  // Get image URL using Cloudinary integration
  const getProductImageUrl = () => {
    if (image?.id) {
      return getImageUrl({ id: image.id });
    }
    if (image?.url) {
      return getImageUrl({ url: image.url });
    }
    return '/dummy.png'; // fallback image
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    onToggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && inStock) {
      onAddToCart(product);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Product Link */}
      <Link to={`/products/${id}`} className="block">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            -{discount}%
          </div>
        )}

        {/* Stock Status Badge */}
        {!inStock && (
          <div className="absolute top-3 right-3 z-10 bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            Hết hàng
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}
          
          <img
            src={getProductImageUrl()}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            } ${imageError ? 'object-contain' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            {liked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Quick Add to Cart on Hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                inStock
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {categoryName}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarSolidIcon
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-600 text-lg">
                    {finalPrice?.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {price?.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ) : (
                <span className="font-bold text-gray-900 text-lg">
                  {price?.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>

            {/* Stock Indicator */}
            <div className={`w-3 h-3 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
