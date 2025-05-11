import { useState, useEffect } from 'react';
import { 
  ShoppingBagIcon, UserGroupIcon, CurrencyDollarIcon, 
  ShoppingCartIcon, ArrowUpIcon, ArrowDownIcon,
  ChartBarIcon, ChevronRightIcon, PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import { dashboardService } from '../../services/api';
import { Link } from 'react-router-dom';
import SalesChart from '../../components/admin/SalesChart';
import CategoryChart from '../../components/admin/CategoryChart';
import { CustomerRetentionChart, OrderStatusDistributionChart } from '../../components/admin/AnalyticsCharts';
import AdminDebugger from '../../components/admin/AdminDebugger';

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

  const StatCard = ({ title, value, icon: Icon, change, isPositive }) => (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-500">{title}</div>
          <div className="text-2xl font-semibold text-gray-800">
            {typeof value === 'number' && title.includes('Doanh thu') 
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) 
              : value}
          </div>
        </div>
        <div className={`p-3 rounded-full ${title.includes('sản phẩm') ? 'bg-blue-100' : 
          title.includes('dùng') ? 'bg-yellow-100' :
          title.includes('Doanh thu') ? 'bg-green-100' : 'bg-purple-100'}`}>
          <Icon className={`w-6 h-6 ${title.includes('sản phẩm') ? 'text-blue-600' : 
            title.includes('dùng') ? 'text-yellow-600' :
            title.includes('Doanh thu') ? 'text-green-600' : 'text-purple-600'}`} />
        </div>
      </div>
        {change !== null && change !== undefined && (
        <div className="flex items-center mt-4">
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-red-500" />
          )}
          <span className={`ml-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {change}%
          </span>
          <span className="ml-2 text-xs text-gray-500">So với tháng trước</span>
        </div>
      )}
    </div>
  );

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
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Tổng sản phẩm" 
          value={stats.totalProducts} 
          icon={ShoppingBagIcon}
          change={null} 
          isPositive={true}
        />
        <StatCard 
          title="Người dùng" 
          value={stats.totalUsers} 
          icon={UserGroupIcon}
          change={null} 
          isPositive={true}
        />
        <StatCard 
          title="Doanh thu" 
          value={stats.totalRevenue} 
          icon={CurrencyDollarIcon}
          change={stats.revenueChange}
          isPositive={stats.revenueChange >= 0}
        />
        <StatCard 
          title="Đơn hàng" 
          value={stats.totalOrders} 
          icon={ShoppingCartIcon}
          change={stats.orderChange}
          isPositive={stats.orderChange >= 0}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <SalesChart />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryChart />
          <OrderStatusDistributionChart />
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-gray-800">Đơn hàng gần đây</h2>
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
                      {new Date(order.createAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
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
      </div>

      {/* Top Products */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-gray-800">Sản phẩm nổi bật</h2>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
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
      </div>

      {/* Admin Debugger - chỉ hiển thị cho admin */}
      <div className="mt-8">
        <AdminDebugger />
      </div>
    </div>
  );
};

export default Dashboard;