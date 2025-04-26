import { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon, 
  UserIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is on the home page
  const isHomePage = location.pathname === '/';

  // Navigation items
  const navigation = [
    { name: 'Trang chủ', href: '/', current: false },
    { name: 'Sản phẩm', href: '/products', current: false },
    { name: 'Danh mục', href: '/categories', current: false },
    { name: 'Blog', href: '/blogs', current: false },
    { name: 'Về chúng tôi', href: '/about', current: false },
    { name: 'Liên hệ', href: '/contact', current: false },
  ];

  // Dropdown menu for user profile
  const userNavigation = [
    { name: 'Tài khoản', href: '/profile' },
    { name: 'Đơn hàng', href: '/orders' },
    { name: 'Sản phẩm yêu thích', href: '/wishlist' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate cart items count
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled || !isHomePage ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      {/* Top bar */}
      <div className="bg-primary-700 text-white py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-xs md:text-sm">Miễn phí vận chuyển cho đơn hàng từ 300.000đ</p>
          <div className="text-xs md:text-sm space-x-4">
            <a href="tel:+84123456789" className="hover:text-primary-200">Hotline: 0123 456 789</a>
            <a href="mailto:contact@naturegrain.com" className="hover:text-primary-200">Email: contact@naturegrain.com</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <Disclosure as="nav" className={`${isScrolled || !isHomePage ? 'py-2' : 'py-4'} transition-all duration-300`}>
        {({ open }) => (
          <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Link to="/" className="flex items-center">
                    <img 
                      className="h-8 w-auto sm:h-10" 
                      src="/logo.png" 
                      alt="NatureGrain Logo"
                      onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/150x50?text=NatureGrain"}}
                    />
                    <span className={`ml-2 text-xl font-bold ${isScrolled || !isHomePage ? 'text-primary-700' : 'text-white'}`}>
                      NatureGrain
                    </span>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          location.pathname === item.href
                            ? 'text-primary-700 bg-primary-50'
                            : `${isScrolled || !isHomePage ? 'text-gray-700 hover:text-primary-700' : 'text-white hover:text-primary-200'}`
                        } transition-colors duration-300`}
                        aria-current={location.pathname === item.href ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Search, Cart, and Profile */}
                <div className="flex items-center">
                  {/* Search */}
                  <div className="hidden sm:block relative mr-4">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className={`w-64 py-1.5 pl-3 pr-8 rounded-full text-sm focus:outline-none ${
                          isScrolled || !isHomePage 
                          ? 'bg-gray-100 border border-gray-300 text-gray-900'
                          : 'bg-white/20 border border-white/30 text-white placeholder-white/70'
                        }`}
                      />
                      <button 
                        type="submit"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <MagnifyingGlassIcon className={`h-4 w-4 ${isScrolled || !isHomePage ? 'text-gray-600' : 'text-white'}`} />
                      </button>
                    </form>
                  </div>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className={`relative p-2 rounded-full ${
                      isScrolled || !isHomePage ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'
                    } transition-colors`}
                  >
                    <span className="sr-only">Shopping cart</span>
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartItemsCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full text-white">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  {user ? (
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className={`flex items-center p-2 rounded-full ${
                          isScrolled || !isHomePage ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'
                        } transition-colors`}>
                          <span className="sr-only">Open user menu</span>
                          <UserIcon className="h-6 w-6" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                          <div className="border-b border-gray-200 px-4 py-2">
                            <p className="text-sm font-medium text-gray-900">Xin chào, {user.fullName || user.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  to={item.href}
                                  className={`${
                                    active ? 'bg-gray-100' : ''
                                  } block px-4 py-2 text-sm text-gray-700`}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                              >
                                Đăng xuất
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <Link
                      to="/login"
                      className={`ml-3 p-2 rounded-full ${
                        isScrolled || !isHomePage ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'
                      } transition-colors`}
                    >
                      <UserIcon className="h-6 w-6" />
                    </Link>
                  )}

                  {/* Mobile menu button */}
                  <div className="md:hidden ml-3">
                    <Disclosure.Button className={`p-2 rounded-md ${
                      isScrolled || !isHomePage ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : 'text-white bg-white/20 hover:bg-white/30'
                    } focus:outline-none`}>
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <Disclosure.Panel className="md:hidden bg-white shadow-lg">
              {/* Mobile search */}
              <div className="px-4 pt-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button 
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </form>
              </div>

              {/* Mobile navigation */}
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.href
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-current={location.pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>

              {/* Mobile user menu */}
              {user ? (
                <div className="pt-4 pb-3 border-t border-gray-300">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-lg font-bold">
                        {user.fullName ? user.fullName.charAt(0) : user.username.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.fullName || user.username}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        to={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </Disclosure.Button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-300">
                  <div className="space-y-1 px-2">
                    <Disclosure.Button
                      as={Link}
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Đăng nhập
                    </Disclosure.Button>
                    <Disclosure.Button
                      as={Link}
                      to="/register"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Đăng ký
                    </Disclosure.Button>
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </header>
  );
}