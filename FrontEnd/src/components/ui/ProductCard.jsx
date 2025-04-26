import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist = () => {},
  onQuickView = () => {},
  isInWishlist = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(isInWishlist);

  if (!product) return null;

  const {
    id,
    name,
    price,
    discountPrice,
    imageUrl,
    categoryName,
    isOrganic = false,
    inStock = true,
    discount = 0,
  } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && inStock) {
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

  return (
    <div 
      className="group relative bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge giảm giá */}
      {discount > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
          -{discount}%
        </div>
      )}

      {/* Badge hữu cơ */}
      {isOrganic && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-full">
          Organic
        </div>
      )}

      {/* Hết hàng */}
      {!inStock && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <span className="bg-white px-4 py-2 rounded-md text-gray-800 font-semibold">
            Hết hàng
          </span>
        </div>
      )}

      {/* Ảnh sản phẩm */}
      <Link to={`/products/${id}`} className="block relative overflow-hidden pt-[100%]">
        <img
          src={imageUrl || '/dummy.png'}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/dummy.png';
          }}
        />
        
        {/* Các nút action khi hover */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleQuickView}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title="Xem nhanh"
            disabled={!inStock}
          >
            <EyeIcon className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={handleToggleWishlist}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title={liked ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
          >
            {liked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-700" />
            )}
          </button>
          <button
            onClick={handleAddToCart}
            className={`bg-white p-2 rounded-full shadow-md transition-colors ${
              inStock ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
            title={inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
            disabled={!inStock}
          >
            <ShoppingCartIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </Link>

      {/* Thông tin sản phẩm */}
      <div className="p-4">
        {categoryName && (
          <Link 
            to={`/categories/${categoryName.toLowerCase()}`} 
            className="text-xs text-green-600 hover:underline mb-1 block"
          >
            {categoryName}
          </Link>
        )}
        
        <Link 
          to={`/products/${id}`}
          className="text-gray-800 font-medium text-sm hover:text-green-600 transition-colors line-clamp-2 h-10"
        >
          {name}
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className={`font-semibold text-md ${discountPrice ? 'text-red-600' : 'text-gray-800'}`}>
              {formattedDiscountPrice || formattedPrice}
            </span>
            {formattedDiscountPrice && (
              <span className="text-gray-500 text-sm line-through">
                {formattedPrice}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            className={`text-sm font-medium rounded-md px-3 py-1 ${
              inStock
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!inStock}
          >
            {inStock ? 'Thêm' : 'Hết hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;