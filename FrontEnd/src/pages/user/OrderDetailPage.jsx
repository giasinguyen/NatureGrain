import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { analyzeOrderDetails, debugOrderDetails } from '../../utils/orderDetailDebugger';
import { 
  ArrowLeftIcon, 
  ShoppingBagIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  PhoneIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  BugAntIcon
} from '@heroicons/react/24/outline';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { retryAuth, isAuthenticated, authChecked } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Kiểm tra có phải môi trường development
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  // Lưu trữ thông tin đơn hàng trong localStorage để tránh mất dữ liệu khi refresh
  const cacheKey = `order_${id}`;
  
  const saveOrderToCache = useCallback((orderData) => {
    if (orderData) {
      localStorage.setItem(cacheKey, JSON.stringify(orderData));
    }
  }, [cacheKey]);
  
  const loadOrderFromCache = useCallback(() => {
    const cachedOrder = localStorage.getItem(cacheKey);
    if (cachedOrder) {
      try {
        return JSON.parse(cachedOrder);
      } catch (e) {
        console.error("Error parsing cached order:", e);
      }
    }
    return null;
  }, [cacheKey]);

  // Hàm fetch chi tiết đơn hàng
  const fetchOrderDetails = useCallback(async (showLoadingState = true) => {
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
  }, [id, retryAttempts, retryAuth, saveOrderToCache]);
  // Load từ cache ngay lập tức để tránh màn hình trống
  useEffect(() => {
    const cachedOrder = loadOrderFromCache();
    if (cachedOrder) {
      setOrder(cachedOrder);
    }
  }, [loadOrderFromCache]);
  
  // Main effect to fetch order data
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
  }, [authChecked, isAuthenticated, id, fetchOrderDetails, loadOrderFromCache, navigate]);

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
    // Convert status to uppercase and handle null/undefined case
    const normalizedStatus = (status || '').toUpperCase();
    
    switch (normalizedStatus) {
      case 'PENDING':
        return {
          text: 'Đang chờ xử lý',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: <ShoppingBagIcon className="h-5 w-5 mr-1" />,
          description: 'Đơn hàng của bạn đang được xử lý'
        };
      case 'PROCESSING':
        return {
          text: 'Đang xử lý',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: <ShoppingBagIcon className="h-5 w-5 mr-1" />,
          description: 'Đơn hàng của bạn đang được chuẩn bị'
        };
      case 'SHIPPING':
      case 'SHIPPED':
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
      case 'REFUNDED':
        return {
          text: 'Đã hoàn tiền',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          icon: <XCircleIcon className="h-5 w-5 mr-1" />,
          description: 'Đơn hàng đã được hoàn tiền'
        };
      default:
        return {
          text: status || 'Không xác định',
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
  }  const status = getStatusBadge(order.status);
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
          <div className="flex justify-between items-center">
            <div>
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
            
            {isDev && (
              <button 
                onClick={() => {
                  debugOrderDetails(order);
                  const analysis = analyzeOrderDetails(order);
                  console.log('Order Analysis:', analysis);
                  setShowDebugInfo(!showDebugInfo);
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <BugAntIcon className="h-4 w-4 mr-1" />
                {showDebugInfo ? 'Ẩn debug' : 'Debug'}
              </button>
            )}
          </div>
        </div>
        
        {/* Debug Info Panel */}
        {isDev && showDebugInfo && (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6 text-xs overflow-auto max-h-60">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre>{JSON.stringify(analyzeOrderDetails(order), null, 2)}</pre>
          </div>
        )}

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
                </div>                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày đặt hàng:</span>
                  <span>{formatDate(order.createAt)}</span>
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
              </div>              <div className="space-y-3 text-sm">
                <p className="font-medium">{`${order.firstname || ''} ${order.lastname || ''}`}</p>
                <p className="text-gray-600">{`${order.address || ''}, ${order.town || ''}, ${order.state || ''}, ${order.country || ''}`}</p>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{order.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* Payment information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Thanh toán</h2>
              </div>              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tổng tiền hàng:</span>
                  <span>
                    {formatCurrency(order.orderDetails?.reduce((sum, item) => sum + (item.subTotal || (item.price * item.quantity)), 0) || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phí vận chuyển:</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Giảm giá:</span>
                    <span>-{formatCurrency(order.discount || 0)}</span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-medium">
                    <span>Tổng thanh toán:</span>
                    <span className="text-green-600">{formatCurrency(order.totalPrice || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm đã mua</h2>              <div className="divide-y divide-gray-200">
                {order.orderDetails && order.orderDetails.map((item, index) => (
                  <div key={index} className="py-4 flex">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product?.images?.[0]?.url || '/dummy.png'}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={item.product ? `/products/${item.product.id}` : '#'}>
                              {item.name}
                            </Link>
                          </h3>
                          <p className="ml-4">{formatCurrency(item.price)}</p>
                        </div>                        {item.product?.description && (
                          <p className="mt-1 text-sm text-gray-500">{item.product.description.substring(0, 50)}...</p>
                        )}
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">Số lượng: {item.quantity}</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(item.subTotal || (item.price * item.quantity))}
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