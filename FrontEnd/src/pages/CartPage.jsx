import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');

  // Shipping cost
  const shippingCost = cartTotal > 500000 ? 0 : 30000;

  // Handle coupon (placeholder functionality)
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    alert(`Mã giảm giá "${couponCode}" chưa được hỗ trợ trong phiên bản này`);
    setCouponCode('');
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center py-16">
          <ShoppingCartIcon className="w-20 h-20 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán</p>
          <Link
            to="/products"
            className="bg-green-600 text-white font-medium py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items (2 columns on large screens) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Cart header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-500">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-center">Thành tiền</div>
            </div>

            {/* Cart items */}
            <div className="divide-y">
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                  {/* Product info */}
                  <div className="col-span-6 flex items-center space-x-4">
                    <Link to={`/products/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image ? `http://localhost:8080/photos/${item.image.name}` : '/dummy.png'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/dummy.png';
                        }}
                      />
                    </Link>
                    <div>
                      <Link to={`/products/${item.id}`} className="text-gray-800 font-medium hover:text-green-600">
                        {item.name}
                      </Link>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-gray-700 text-center">
                    {formatCurrency(item.price)}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal and remove */}
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="font-medium text-gray-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Xóa sản phẩm"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart actions */}
            <div className="p-4 bg-gray-50 border-t flex flex-wrap gap-4 justify-between items-center">
              <div className="flex items-center space-x-2">
                <Link
                  to="/products"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 font-medium flex items-center"
              >
                <TrashIcon className="w-4 h-4 mr-1" />
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>{shippingCost > 0 ? formatCurrency(shippingCost) : 'Miễn phí'}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(cartTotal + shippingCost)}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2">
                {cartTotal >= 500000 ? (
                  <span className="text-green-600">✓ Đơn hàng của bạn đủ điều kiện để được miễn phí vận chuyển!</span>
                ) : (
                  <>
                    Đơn hàng từ <strong>500,000₫</strong> sẽ được miễn phí vận chuyển. 
                    Bạn cần mua thêm <strong>{formatCurrency(500000 - cartTotal)}</strong> để được miễn phí vận chuyển.
                  </>
                )}
              </p>
            </div>

            {/* Coupon */}
            <div className="mb-6">
              <form onSubmit={handleApplyCoupon} className="flex">
                <input
                  type="text"
                  placeholder="Mã giảm giá"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border rounded-l-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-200 transition-colors text-sm"
                >
                  Áp dụng
                </button>
              </form>
            </div>

            <Link
              to="/checkout"
              className="bg-green-600 text-white font-medium py-3 px-6 rounded-md hover:bg-green-700 transition-colors block w-full text-center"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;