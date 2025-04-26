import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // Ở đây có thể thêm logic để lưu sản phẩm yêu thích
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    // Ở đây sẽ thêm logic để thêm sản phẩm vào giỏ hàng
    console.log('Add to cart:', product);
  };

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.imageUrl || '/placeholder.jpg'}
            alt={product.name}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </Link>
        
        {/* Overlay actions */}
        <div className="absolute top-2 right-2 space-y-2">
          <button
            onClick={toggleFavorite}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            {isFavorite ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          <button
            onClick={handleAddToCart}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <ShoppingCartIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <Link to={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        <div>
          {product.discountPrice ? (
            <div>
              <p className="text-sm font-medium text-gray-900">{formatPrice(product.discountPrice)}</p>
              <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</p>
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
          )}
        </div>
      </div>
    </div>
  );
}