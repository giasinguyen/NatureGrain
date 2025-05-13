import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  MagnifyingGlassIcon as SearchIcon, XCircleIcon, EyeIcon, 
  FunnelIcon as FilterIcon, CheckCircleIcon, XMarkIcon as XIcon,
  ArrowUpIcon, ArrowDownIcon
} from '@heroicons/react/24/outline';
import { orderService } from '../../services/api';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // Default sort option

  const statusOptions = [
    { value: 'PENDING', label: 'Đang xử lý' },
    { value: 'PROCESSING', label: 'Đang chuẩn bị' },
    { value: 'SHIPPING', label: 'Đang vận chuyển' },
    { value: 'COMPLETED', label: 'Đã hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'highest_price', label: 'Giá cao nhất' },
    { value: 'lowest_price', label: 'Giá thấp nhất' }
  ];
  
  // Fetch orders on component mount and when sort option changes
  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);
  
  // Fetch all orders with sorting
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders(sortBy);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // View order details
  const handleViewDetails = (order) => {
    setCurrentOrder(order);
    setOrderStatus(order.status);
    setShowModal(true);
  };

  // Update order status
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await orderService.updateOrderStatus(currentOrder.id, orderStatus);
      toast.success('Cập nhật trạng thái đơn hàng thành công');
      
      // Refresh orders list
      fetchOrders();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = (
      order.id.toString().includes(searchTerm) ||
      `${order.firstname} ${order.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm)
    );
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPING':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status label
  const formatStatus = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Đã hoàn thành';
      case 'PENDING': return 'Đang xử lý';
      case 'PROCESSING': return 'Đang chuẩn bị';
      case 'SHIPPING': return 'Đang vận chuyển';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Không có ngày";
    
    try {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      const date = new Date(dateString);
      
      // Kiểm tra xem ngày có hợp lệ không
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "Ngày không hợp lệ";
      }
      
      return date.toLocaleDateString('vi-VN', options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Lỗi định dạng ngày";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý Đơn hàng</h1>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng (ID, email, tên khách hàng...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <SearchIcon className="absolute w-5 h-5 text-gray-400 top-2.5 left-3" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5"
            >
              <XCircleIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        {/* Sort By */}
        <div className="relative md:w-1/5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {sortBy.includes('highest_price') ? 
            <ArrowUpIcon className="absolute w-5 h-5 text-gray-400 top-2.5 left-3" /> : 
            <ArrowDownIcon className="absolute w-5 h-5 text-gray-400 top-2.5 left-3" />}
        </div>
        
        <div className="relative md:w-1/5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Tất cả trạng thái</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FilterIcon className="absolute w-5 h-5 text-gray-400 top-2.5 left-3" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Khách hàng
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Ngày đặt
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Tổng tiền
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Trạng thái
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-sm text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                    <span className="ml-2">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-sm text-center text-gray-500">
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.firstname} {order.lastname}
                    </div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                    <div className="text-sm text-gray-500">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.createdAt || order.createAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount || order.totalPrice || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${getStatusBadgeClass(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {showModal && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative w-full max-w-4xl mx-auto my-6">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  Chi tiết đơn hàng #{currentOrder.id}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700">Thông tin khách hàng</h4>
                    <div className="p-4 border border-gray-200 rounded-md">
                      <p className="mb-1 text-sm">
                        <span className="font-medium">Họ tên:</span> {currentOrder.firstname} {currentOrder.lastname}
                      </p>
                      <p className="mb-1 text-sm">
                        <span className="font-medium">Email:</span> {currentOrder.email}
                      </p>
                      <p className="mb-1 text-sm">
                        <span className="font-medium">Điện thoại:</span> {currentOrder.phone}
                      </p>
                      <p className="mb-1 text-sm">
                        <span className="font-medium">Địa chỉ:</span> {currentOrder.address}, {currentOrder.town}, {currentOrder.state}, {currentOrder.country}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700">Thông tin đơn hàng</h4>
                    <div className="p-4 border border-gray-200 rounded-md">
                      <p className="mb-1 text-sm">
                        <span className="font-medium">Ngày đặt:</span> {formatDate(currentOrder.createdAt || currentOrder.createAt)}
                      </p>
                      <p className="mb-1 text-sm">
                        <span className="font-medium">Tổng tiền:</span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentOrder.totalAmount || currentOrder.totalPrice || 0)}
                      </p>
                      <p className="mb-1 text-sm">
                        <span className="font-medium">Ghi chú:</span> {currentOrder.note || 'Không có'}
                      </p>
                      
                      <form onSubmit={handleUpdateStatus} className="mt-4">
                        <div className="mb-2">
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Trạng thái đơn hàng
                          </label>
                          <select
                            value={orderStatus}
                            onChange={(e) => setOrderStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="w-full px-4 py-2 mt-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                          disabled={loading}
                        >
                          {loading ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                <h4 className="mb-2 text-sm font-medium text-gray-700">Danh sách sản phẩm</h4>
                <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Sản phẩm
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Giá
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Số lượng
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Tổng tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentOrder.orderDetails?.map((detail, index) => (
                        <tr key={index} className="transition-colors hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10">
                                {detail.product?.images && detail.product.images.length > 0 ? (
                                  <img 
                                    className="object-cover w-10 h-10 rounded-full" 
                                    src={`/static/photos/${detail.product.images[0]?.url}`} 
                                    alt={detail.product.name} 
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-10 h-10 text-white bg-gray-300 rounded-full">
                                    <span className="text-xs">No img</span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {detail.product?.name || 'Sản phẩm đã xóa'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{detail.quantity}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price * detail.quantity)}
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {!currentOrder.orderDetails?.length && (
                        <tr>
                          <td colSpan="4" className="px-4 py-3 text-sm text-center text-gray-500">
                            Không có thông tin sản phẩm
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end p-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;