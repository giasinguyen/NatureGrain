import { useState, useEffect } from 'react';
import { 
  ShoppingBagIcon, UserGroupIcon, CurrencyDollarIcon, 
  ShoppingCartIcon, ArrowSmUpIcon as ArrowUpIcon, ArrowSmDownIcon as ArrowDownIcon 
} from '@heroicons/react/24/outline';
import { productService, orderService, userService } from '../../services/api';

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
        // In a production environment, you'd create a dedicated dashboard API endpoint
        // that returns all of this data in one request for better performance
        
        // For now, we'll make separate calls to existing endpoints
        const productsRes = await productService.getProducts();
        const ordersRes = await orderService.getOrders();
        
        // Calculate stats from responses
        const products = productsRes.data || [];
        const orders = ordersRes.data || [];
        
        // Calculate revenue from orders
        const revenue = orders.reduce((total, order) => {
          // This assumes your order object has a totalAmount field
          // Adjust based on your actual data structure
          return total + (order.totalAmount || 0);
        }, 0);
        
        // Sort orders by date to get recent ones
        const sortedOrders = [...orders].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Get most expensive products as "top" products
        const sortedProducts = [...products].sort((a, b) => b.price - a.price);
        
        setStats({
          totalProducts: products.length,
          totalUsers: 100, // Mock data as we don't have a user listing endpoint yet
          totalRevenue: revenue,
          totalOrders: orders.length,
          recentOrders: sortedOrders.slice(0, 5),
          topProducts: sortedProducts.slice(0, 5),
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
            {typeof value === 'number' && title.includes('Revenue') 
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) 
              : value}
          </div>
        </div>
        <div className={`p-3 rounded-full ${title.includes('Products') ? 'bg-blue-100' : 
          title.includes('Users') ? 'bg-yellow-100' :
          title.includes('Revenue') ? 'bg-green-100' : 'bg-purple-100'}`}>
          <Icon className={`w-6 h-6 ${title.includes('Products') ? 'text-blue-600' : 
            title.includes('Users') ? 'text-yellow-600' :
            title.includes('Revenue') ? 'text-green-600' : 'text-purple-600'}`} />
        </div>
      </div>
      
      {change !== undefined && (
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
      <div className="flex items-center justify-center h-full">
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
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Tổng sản phẩm" 
          value={stats.totalProducts} 
          icon={ShoppingBagIcon}
          change={12}
          isPositive={true}
        />
        <StatCard 
          title="Người dùng" 
          value={stats.totalUsers} 
          icon={UserGroupIcon}
          change={5}
          isPositive={true}
        />
        <StatCard 
          title="Doanh thu" 
          value={stats.totalRevenue} 
          icon={CurrencyDollarIcon}
          change={8}
          isPositive={true}
        />
        <StatCard 
          title="Đơn hàng" 
          value={stats.totalOrders} 
          icon={ShoppingCartIcon}
          change={3}
          isPositive={false}
        />
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
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount || 0)}
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
    </div>
  );
};

export default Dashboard;