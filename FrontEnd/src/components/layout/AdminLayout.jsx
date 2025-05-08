import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, ShoppingBagIcon, UsersIcon, DocumentTextIcon, 
  Cog6ToothIcon as CogIcon, ArrowRightOnRectangleIcon as LogoutIcon,
  Bars3Icon as MenuIcon, XMarkIcon as XIcon, ChevronDownIcon,
  ChartBarIcon, TagIcon, ShoppingCartIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Check if user is admin
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  if (!isAdmin) {
    // Redirect to login if not admin
    setTimeout(() => {
      navigate('/login');
    }, 100);
    return <div className="flex items-center justify-center h-screen">Bạn không có quyền truy cập trang này</div>;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Sản phẩm', href: '/admin/products', icon: ShoppingBagIcon },
    { name: 'Danh mục', href: '/admin/categories', icon: TagIcon },
    { name: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCartIcon },
    { name: 'Người dùng', href: '/admin/users', icon: UsersIcon },
    { name: 'Bài viết', href: '/admin/blogs', icon: DocumentTextIcon },
    { name: 'Cấu hình', href: '/admin/settings', icon: CogIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="relative flex flex-col w-full max-w-xs pb-4 bg-white">
          <div className="absolute top-0 right-0 pt-2 -mr-12">
            <button
              className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XIcon className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="flex items-center px-4 pt-5 pb-3">
            <img src="/dummy.png" alt="Logo" className="w-auto h-8" />
            <span className="ml-2 text-xl font-semibold text-gray-800">NatureGrain Admin</span>
          </div>
          
          <div className="flex-1 h-0 mt-5 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 ${
                        isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1 h-0 bg-white border-r border-gray-200">
            <div className="flex items-center px-4 py-4">
              <img src="/dummy.png" alt="Logo" className="w-auto h-8" />
              <span className="ml-2 text-xl font-semibold text-gray-800">NatureGrain</span>
            </div>
            
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 px-3 space-y-1 bg-white">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <div className="relative z-10 flex flex-shrink-0 h-16 bg-white shadow">
          <button
            className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          
          <div className="flex justify-between flex-1 px-4">
            <div className="flex flex-1">
              <div className="flex items-center flex-shrink-0 pl-3">
                <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center ml-4 md:ml-6">
              <div className="relative ml-3">
                <div>
                  <button
                    className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="sr-only">Mở menu người dùng</span>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                        {currentUser?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="ml-2 text-gray-700">{currentUser?.username}</span>
                      <ChevronDownIcon className="w-5 h-5 ml-1 text-gray-400" />
                    </div>
                  </button>
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Trang chủ
                    </Link>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <LogoutIcon className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;