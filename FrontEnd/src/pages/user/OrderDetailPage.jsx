import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  ShoppingBagIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  PhoneIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { currentUser, retryAuth, isAuthenticated, authChecked } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);

  // Lưu trữ thông tin đơn hàng trong localStorage để tránh mất dữ liệu khi refresh
  const cacheKey = `order_${id}`;
  
  const saveOrderToCache = (orderData) => {
    if (orderData) {
      localStorage.setItem(cacheKey, JSON.stringify(orderData));
    }
  };
  
  const loadOrderFromCache = () => {
    const cachedOrder = localStorage.getItem(cacheKey);
    if (cachedOrder) {
      try {
        return JSON.parse(cachedOrder);
      } catch (e) {
        console.error("Error parsing cached order:", e);
      }
    }
    return null;
  };

  // Hàm fetch chi tiết đơn hàng
  const fetchOrderDetails = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }
      
      const response = await orderService.getOrder(id);
      const orderData = response.data;
      
      // Lưu đơn hàng vào state và cache
      setOrder(orderData);
      saveOrderToCache(orderData);
      
      // Xóa lỗi nếu có
      setError(null);
      
      return true;
    } catch (err) {
      console.error('Error fetching order details:', err);
      
      // Nếu lỗi là 401 (Unauthorized) và chưa vượt quá số lần thử lại
      if (err.response?.status === 401 && retryAttempts < 2) {
        // Thử xác thực lại
        const retrySuccessful = await retryAuth();
        if (retrySuccessful) {
          setRetryAttempts(prev => prev + 1);
          return fetchOrderDetails(false); // Gọi lại mà không hiển thị trạng thái loading
        }
      }
      
      // Nếu không phải lỗi xác thực hoặc đã thử lại quá nhiều lần
      setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
      return false;
    } finally {
      if (showLoadingState) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Nếu đã hoàn thành kiểm tra xác thực
    if (authChecked) {
      if (isAuthenticated) {
        // Nếu đã xác thực, lấy dữ liệu đơn hàng
        fetchOrderDetails();
      } else {
        // Nếu chưa xác thực, kiểm tra cache trước
        const cachedOrder = loadOrderFromCache();
        if (cachedOrder) {
          setOrder(cachedOrder);
          setLoading(false);
          // Hiển thị thông báo mềm
          toast.info("Hiển thị thông tin đơn hàng từ lưu trữ cục bộ. Vui lòng đăng nhập để cập nhật.");
        } else {
          // Nếu không có cache, chuyển hướng đến trang đăng nhập
          navigate('/login', { state: { from: `/user/orders/${id}` } });
        }
      }
    }
  }, [authChecked, isAuthenticated, id]);
  
  // Load từ cache ngay lập tức để tránh màn hình trống
  useEffect(() => {
    const cachedOrder = loadOrderFromCache();
    if (cachedOrder) {
      setOrder(cachedOrder);
    }
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Get status badge color and text
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          text: 'Đang chờ xử lý',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: <ShoppingBagIcon className="h-5 w-5 mr-1" />,
          description: 'Đơn hàng của bạn đang được xử lý'
        };
      case 'SHIPPING':
        return {
          text: 'Đang giao hàng',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: <TruckIcon className="h-5 w-5 mr-1" />,
          description: 'Đơn hàng đang được vận chuyển đến bạn'
        };
      case 'COMPLETED':
        return {
          text: 'Đã hoàn thành',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: <CheckCircleIcon className="h-5 w-5 mr-1" />,
          description: 'Đơn hàng đã được giao thành công'
        };
      case 'CANCELLED':
        return {
          text: 'Đã hủy',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: <XCircleIcon className="h-5 w-5 mr-1" />,
          description: 'Đơn hàng đã bị hủy'
        };
      default:
        return {
          text: status,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: null,
          description: 'Trạng thái đơn hàng'
        };
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }
    
    try {
      setCancellingOrder(true);
      await orderService.cancelOrder(id);
      toast.success('Đơn hàng đã được hủy thành công');
      
      // Fetch updated order details
      await fetchOrderDetails();
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setCancellingOrder(false);
    }
  };
  
  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    
    // Thử xác thực lại trước khi tải lại dữ liệu
    await retryAuth();
    
    // Sau đó tải lại dữ liệu đơn hàng
    await fetchOrderDetails();
  };

  if (loading && !order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!loading && !isAuthenticated && error && !order) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Phiên đăng nhập đã hết hạn</h2>
              <p className="text-gray-600">Vui lòng đăng nhập lại để xem chi tiết đơn hàng</p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/login', { state: { from: `/user/orders/${id}` } })}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate('/user/orders')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Quay lại danh sách đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
              <p className="text-gray-600">{error || 'Không tìm thấy đơn hàng này'}</p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/user/orders')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Quay lại danh sách đơn hàng
                </button>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị từ cache nếu có, trong khi chờ dữ liệu mới
  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const status = getStatusBadge(order.status);
  const canCancel = order.status === 'PENDING';

  // Hiển thị banner thông báo nếu đang xem dữ liệu cache khi offline
  const isViewingCache = !isAuthenticated && order;
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Offline banner */}
        {isViewingCache && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Bạn đang xem dữ liệu từ bộ nhớ cục bộ. 
                  <button
                    onClick={() => navigate('/login', { state: { from: `/user/orders/${id}` } })}
                    className="ml-2 font-medium text-yellow-700 underline"
                  >
                    Đăng nhập
                  </button>
                  {" "}để cập nhật thông tin mới nhất.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Header with back button */}
        <div className="mb-6">
          <Link 
            to="/user/orders" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-green-600"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Quay lại danh sách đơn hàng
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Chi tiết đơn hàng #{order.id}</h1>
          {loading && <span className="ml-2 text-sm text-gray-500">(Đang cập nhật...)</span>}
        </div>

        {/* Order status section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-medium text-gray-900">Trạng thái đơn hàng</h2>
              <div className="mt-2 flex items-center">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}>
                  {status.icon}
                  {status.text}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{status.description}</p>
            </div>
            {canCancel && isAuthenticated && (
              <button
                onClick={handleCancelOrder}
                disabled={cancellingOrder}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {cancellingOrder ? 'Đang hủy...' : 'Hủy đơn hàng'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order info and shipping details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Thông tin đơn hàng</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã đơn hàng:</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày đặt hàng:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phương thức thanh toán:</span>
                  <span>{order.paymentMethod || 'Thanh toán khi nhận hàng'}</span>
                </div>
              </div>
            </div>
            
            {/* Shipping information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Thông tin giao hàng</h2>
              </div>
              <div className="space-y-3 text-sm">
                <p className="font-medium">{order.fullName || currentUser?.username}</p>
                <p className="text-gray-600">{order.address}</p>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{order.phone}</span>
                </div>
              </div>
            </div>
            
            {/* Payment information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Thanh toán</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tổng tiền hàng:</span>
                  <span>{formatCurrency(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phí vận chuyển:</span>
                  <span>{formatCurrency(order.shippingFee || 0)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Giảm giá:</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-medium">
                    <span>Tổng thanh toán:</span>
                    <span className="text-green-600">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm đã mua</h2>
              <div className="divide-y divide-gray-200">
                {order.orderItems && order.orderItems.map((item, index) => (
                  <div key={index} className="py-4 flex">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product?.image || '/dummy.png'}
                        alt={item.product?.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={`/products/${item.product?.id}`}>
                              {item.product?.name}
                            </Link>
                          </h3>
                          <p className="ml-4">{formatCurrency(item.price)}</p>
                        </div>
                        {item.product?.weight && (
                          <p className="mt-1 text-sm text-gray-500">{item.product.weight}</p>
                        )}
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">Số lượng: {item.quantity}</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;