import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems: cart, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    firstname: currentUser?.fullName?.split(' ')[0] || '',
    lastname: currentUser?.fullName?.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    country: 'Việt Nam',
    town: '',
    state: '',
    postCode: '',
    note: '',
    paymentMethod: 'COD' // Default payment method
  });

  // Shipping cost
  const shippingCost = 30000; // 30.000 VND
  const freeShippingThreshold = 500000; // Free shipping for orders above 500.000 VND
  
  // Calculate actual shipping cost
  const actualShippingCost = cartTotal >= freeShippingThreshold ? 0 : shippingCost;
  
  // Calculate total with shipping
  const orderTotal = cartTotal + actualShippingCost;

  // Validate cart is not empty
  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cart, navigate, orderSuccess]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // // Basic validation
    // if (!formData.firstname || !formData.lastname || !formData.email || !formData.phone || 
    //     !formData.address || !formData.town || !formData.state) {
    //   setError('Vui lòng điền đầy đủ thông tin cần thiết.');
    //   return;
    // }

    try {
      setLoading(true);
      setError(null);
        // Format orderDetails as required by backend
      const orderDetails = cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        productId: item.id // Add product ID to link order detail with product
      }));

      // Create order object in the format expected by backend
      const orderData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        address: formData.address,
        town: formData.town,
        state: formData.state,
        postCode: parseInt(formData.postCode) || 0,
        note: formData.note,
        totalPrice: orderTotal,
        username: currentUser?.username,
        orderDetails: orderDetails
      };

      console.log('Sending order data:', orderData);
      
      // Call API to create order using the correct endpoint
      const response = await orderService.createOrder(orderData);      console.log('Order response:', response);
      
      // Handle successful order
      if (response && response.status === 200) {
        setOrderSuccess(true);
        
        // Get order ID from response or generate placeholder
        const orderId = response.data && response.data.id 
          ? response.data.id 
          : `ORD-${Math.floor(Math.random() * 10000)}`;
        
        setOrderId(orderId);
        
        // Save order data to localStorage for reference
        try {
          localStorage.setItem(`order_${orderId}`, JSON.stringify(response.data));
        } catch (err) {
          console.warn('Failed to save order to localStorage:', err);
        }
        
        // Clear cart
        clearCart();
        
        toast.success('Đặt hàng thành công!');
        
        // If payment method is VNPAY, we would redirect to VNPAY here
        if (formData.paymentMethod === 'VNPAY') {
          // This is a placeholder for future VNPAY implementation
          // window.location.href = response.data.paymentUrl;
          alert('VNPAY thanh toán sẽ được triển khai trong tương lai!');
        }
      } else {
        setError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.');
      toast.error('Đặt hàng thất bại!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Đang xử lý đơn hàng của bạn...</p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua sắm tại NatureGrain.</p>
            <p className="text-gray-600">Mã đơn hàng của bạn là: <span className="font-medium">{orderId}</span></p>
          </div>
          
          <div className="border-t border-b py-4 my-4">
            <p className="text-center text-gray-700">
              Chúng tôi đã gửi email xác nhận đơn hàng đến <span className="font-medium">{formData.email}</span>.
              <br />Vui lòng kiểm tra email và theo dõi trạng thái đơn hàng của bạn.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <button 
              onClick={() => navigate('/user/orders')} 
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              Xem đơn hàng của tôi
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-8 text-center">Thanh toán</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="fullName">
                      Họ và tên <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="email">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="phone">
                      Số điện thoại <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Delivery Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Thông tin giao hàng</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1" htmlFor="city">
                        Tỉnh/Thành phố <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1" htmlFor="district">
                        Quận/Huyện <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1" htmlFor="ward">
                        Phường/Xã <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="ward"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="address">
                      Địa chỉ <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="note">
                      Ghi chú
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                      placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="cod" className="ml-3 block text-gray-800">
                      Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="vnpay"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={formData.paymentMethod === 'VNPAY'}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="vnpay" className="ml-3 block text-gray-800">
                      Thanh toán qua VNPAY
                      <span className="ml-2 inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                        Sắp ra mắt
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="lg:hidden">
                <h3 className="text-lg font-medium mb-4">Tóm tắt đơn hàng</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between py-2 border-b">
                    <span>Tạm tính:</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Phí vận chuyển:</span>
                    <span>{actualShippingCost === 0 
                      ? 'Miễn phí' 
                      : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(actualShippingCost)
                    }</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold">
                    <span>Tổng cộng:</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderTotal)}</span>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {formData.paymentMethod === 'VNPAY' ? 'Thanh toán với VNPAY' : 'Đặt hàng'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <img
                    src={item.image?.url || '/dummy.png'}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-800 font-medium">{item.name}</h3>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-600">
                        SL: {item.quantity}
                      </span>
                      <span className="text-gray-800 font-medium">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="text-gray-800">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="text-gray-800">
                  {actualShippingCost === 0 
                    ? <span className="text-green-600">Miễn phí</span> 
                    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(actualShippingCost)
                  }
                </span>
              </div>
              {actualShippingCost === 0 && (
                <div className="text-xs text-green-600 mb-3">
                  Miễn phí vận chuyển cho đơn hàng trên {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(freeShippingThreshold)}
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-300 text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderTotal)}</span>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-600">
              <p>
                <span className="font-medium">Lưu ý:</span> Thời gian giao hàng dự kiến từ 2-5 ngày làm việc tùy thuộc vào địa điểm giao hàng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;