import { useState, useEffect } from 'react';
import { 
  ShoppingBagIcon, UserGroupIcon, CurrencyDollarIcon, 
  ShoppingCartIcon, ArrowUpIcon, ArrowDownIcon,
  ChartBarIcon, ChevronRightIcon, PresentationChartLineIcon,
  ClockIcon, CalendarIcon, ArrowTrendingUpIcon,
  CakeIcon, HeartIcon, DocumentTextIcon, BellIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/api';
import AdminDebugger from '../../components/admin/AdminDebugger';
import StatCard from '../../components/admin/StatCard';
import WelcomeCard from '../../components/admin/WelcomeCard';
import RecentActivityFeed from '../../components/admin/RecentActivityFeed';
import SalesChart from '../../components/admin/charts/SalesChart';
import CategoryChart from '../../components/admin/charts/CategoryChart';
import OrderStatusChart from '../../components/admin/charts/OrderStatusChart';

// Format date for orders - handles both createAt and createdAt fields
const formatOrderDate = (order) => {
  const dateString = order.createAt || order.createdAt;
  if (!dateString) return "Không có ngày";
  
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch (error) {
    console.error("Error formatting date:", error, dateString);
    return "Ngày không hợp lệ";
  }
};

// Format price for orders - handles both totalPrice and totalAmount fields
const formatOrderPrice = (order) => {
  const price = order.totalPrice || order.totalAmount || 0;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    recentOrders: [],
    topProducts: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Đang tải dữ liệu dashboard...");
        
        let statsData = {};
        let recentOrders = [];
        let topProducts = [];
        
        try {
          // Thử gọi API chính
          const statsRes = await dashboardService.getStats();
          statsData = statsRes.data || {};
          console.log("Dữ liệu stats:", statsData);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu stats:", error);
          // Mock data nếu API lỗi
          statsData = {
            totalProducts: 24,
            totalUsers: 150,
            totalRevenue: 45600000,
            totalOrders: 89,
            revenueChange: 12,
            orderChange: 8
          };
        }
        
        try {
          // Thử gọi API đơn hàng gần đây
          const recentOrdersRes = await dashboardService.getRecentOrders();
          recentOrders = recentOrdersRes.data || [];
          console.log("Dữ liệu đơn hàng gần đây:", recentOrders);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu đơn hàng gần đây:", error);
          // Mock data nếu API lỗi
          recentOrders = [
            {
              id: 1,
              firstname: "Nguyễn",
              lastname: "Văn A",
              email: "nguyenvana@example.com",
              createAt: new Date(),
              totalPrice: 1200000,
              status: "COMPLETED"
            },
            {
              id: 2,
              firstname: "Trần",
              lastname: "Thị B",
              email: "tranthib@example.com",
              createAt: new Date(),
              totalPrice: 850000,
              status: "PENDING"
            },
            {
              id: 3,
              firstname: "Lê",
              lastname: "Văn C",
              email: "levanc@example.com",
              createAt: new Date(),
              totalPrice: 2100000,
              status: "COMPLETED"
            }
          ];
        }
        
        try {
          // Thử gọi API sản phẩm nổi bật
          const topProductsRes = await dashboardService.getTopProducts();
          topProducts = topProductsRes.data || [];
          console.log("Dữ liệu sản phẩm nổi bật:", topProducts);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu sản phẩm nổi bật:", error);
          // Mock data nếu API lỗi
          topProducts = [
            {
              id: 1,
              name: "Organic Broccoli",
              category: { id: 1, name: "Organic Vegetables" },
              price: 35000,
              quantity: 50,
              images: []
            },
            {
              id: 2,
              name: "Fresh Apples",
              category: { id: 2, name: "Fresh Fruits" },
              price: 28000,
              quantity: 100,
              images: []
            },
            {
              id: 3,
              name: "Brown Rice",
              category: { id: 3, name: "Whole Grains" },
              price: 45000,
              quantity: 75,
              images: []
            }
          ];
        }
        
        setStats({
          totalProducts: statsData.totalProducts || 0,
          totalUsers: statsData.totalUsers || 0,
          totalRevenue: statsData.totalRevenue || 0,
          totalOrders: statsData.totalOrders || 0,
          revenueChange: statsData.revenueChange || 0,
          orderChange: statsData.orderChange || 0,
          recentOrders: recentOrders,
          topProducts: topProducts,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Lỗi chung khi tải dữ liệu dashboard:', error);
        setStats(prevStats => ({
          ...prevStats,
          loading: false,
          error: 'Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.'
        }));
      }
    };

    fetchDashboardData();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md">
        {stats.error}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <WelcomeCard />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-medium text-gray-700 flex items-center">
          <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
          Tổng quan hệ thống
          <div className="relative ml-2 group">
            <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 
                          opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Thông tin tổng quan về hoạt động hệ thống. Nhấp vào biểu đồ để xem chi tiết hơn.
            </div>
          </div>
        </h2>
        <Link 
          to="/admin/analytics" 
          className="flex items-center px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PresentationChartLineIcon className="w-4 h-4 mr-2" />
          Phân tích nâng cao
          <ChevronRightIcon className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Tổng sản phẩm" 
          value={stats.totalProducts} 
          icon={ShoppingBagIcon}
          color="blue"
        />
        <StatCard 
          title="Người dùng" 
          value={stats.totalUsers} 
          icon={UserGroupIcon}
          color="purple"
          change={3.5}
        />
        <StatCard 
          title="Doanh thu" 
          value={stats.totalRevenue} 
          icon={CurrencyDollarIcon}
          color="green"
          change={stats.revenueChange || 2.5}
          prefix=""
          suffix=" ₫"
          formatValue={(val) => new Intl.NumberFormat('vi-VN').format(val)}
        />
        <StatCard 
          title="Đơn hàng" 
          value={stats.totalOrders}
          icon={ShoppingCartIcon}
          color="red"
          change={stats.orderChange || 1.8}
        />
      </div>

      {/* Dashboard Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Charts - Take up 2/3 of the width on large screens */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
              Biểu đồ doanh thu
              <div className="relative ml-2 group">
                <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 
                            opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  Biểu đồ thể hiện doanh thu theo thời gian. Sử dụng để theo dõi xu hướng bán hàng.
                </div>
              </div>
            </h2>
            <SalesChart days={7} />
          </div>
            {/* Category & Order Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                Phân loại sản phẩm
                <div className="relative ml-2 group">
                  <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 
                              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    Biểu đồ thể hiện tỉ lệ các loại sản phẩm trong danh mục hàng hóa.
                  </div>
                </div>
              </h2>
              <CategoryChart />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                Trạng thái đơn hàng
                <div className="relative ml-2 group">
                  <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 
                              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    Biểu đồ thể hiện tỉ lệ các trạng thái đơn hàng hiện tại.
                  </div>
                </div>
              </h2>
              <OrderStatusChart />
            </div>
          </div>
        </div>
          {/* Activity Feed - Take up 1/3 of the width on large screens */}
        <div>
          <RecentActivityFeed />
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <ShoppingCartIcon className="h-5 w-5 mr-2 text-gray-500" />
            Đơn hàng gần đây
            <div className="relative ml-2 group">
              <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 
                          opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                Các đơn hàng được đặt gần đây nhất trong hệ thống.
              </div>
            </div>
          </h2>
          <Link 
            to="/admin/orders" 
            className="text-sm text-green-600 hover:text-green-700 flex items-center mt-2 sm:mt-0"
          >
            Xem tất cả đơn hàng
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {/* Table for desktop */}
        <div className="hidden sm:block overflow-hidden border border-gray-200 rounded-lg">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.firstname} {order.lastname}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatOrderDate(order)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatOrderPrice(order)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'COMPLETED' ? 'Hoàn thành' :
                       order.status === 'PENDING' ? 'Đang xử lý' :
                       order.status === 'CANCELLED' ? 'Đã hủy' : order.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-sm text-center text-gray-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Cards for mobile */}
        <div className="sm:hidden space-y-4">
          {stats.recentOrders.map((order) => (
            <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-500">Đơn hàng #{order.id}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'COMPLETED' ? 'Hoàn thành' :
                     order.status === 'PENDING' ? 'Đang xử lý' :
                     order.status === 'CANCELLED' ? 'Đã hủy' : order.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Khách hàng:</span>
                    <span className="text-sm font-medium text-gray-900">{order.firstname} {order.lastname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Ngày đặt:</span>
                    <span className="text-sm text-gray-900">{formatOrderDate(order)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tổng tiền:</span>
                    <span className="text-sm font-medium text-gray-900">{formatOrderPrice(order)}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link to={`/admin/orders/${order.id}`} className="text-sm text-green-600 hover:text-green-700 flex items-center justify-center">
                    Xem chi tiết đơn hàng
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {stats.recentOrders.length === 0 && (
            <div className="bg-white shadow rounded-lg overflow-hidden p-8 text-center">
              <DocumentTextIcon className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Không có đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <ShoppingBagIcon className="h-5 w-5 mr-2 text-gray-500" />
            Sản phẩm nổi bật
          </h2>
          <Link 
            to="/admin/products" 
            className="text-sm text-green-600 hover:text-green-700 flex items-center mt-2 sm:mt-0"
          >
            Quản lý sản phẩm
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {/* Products table for desktop */}
        <div className="hidden sm:block overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Sản phẩm
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Danh mục
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Giá
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Số lượng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.topProducts.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            className="object-cover w-10 h-10 rounded-full" 
                            src={`/static/photos/${product.images[0]?.url}`} 
                            alt={product.name} 
                          />
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 text-white bg-gray-300 rounded-full">
                            <ShoppingBagIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.quantity}</div>
                  </td>
                </tr>
              ))}
              
              {stats.topProducts.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-500">
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Products cards for mobile */}
        <div className="sm:hidden space-y-4">
          {stats.topProducts.map((product) => (
            <div key={product.id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 w-12 h-12">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        className="object-cover w-12 h-12 rounded-md" 
                        src={`/static/photos/${product.images[0]?.url}`} 
                        alt={product.name} 
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 text-white bg-gray-300 rounded-md">
                        <ShoppingBagIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.category?.name || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Giá:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Số lượng:</span>
                    <span className="text-sm text-gray-900">{product.quantity}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link to={`/admin/products/${product.id}`} className="text-sm text-green-600 hover:text-green-700 flex items-center justify-center">
                    Xem chi tiết sản phẩm
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {stats.topProducts.length === 0 && (
            <div className="bg-white shadow rounded-lg overflow-hidden p-8 text-center">
              <ShoppingBagIcon className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Không có sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Debugger - chỉ hiển thị cho admin */}
      <div className="mt-8">
        <AdminDebugger />
      </div>
    </div>
  );
};

export default Dashboard;
