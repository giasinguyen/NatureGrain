import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Xử lý hiệu ứng thu gọn header khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
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

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-green-700 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center text-sm space-x-4">
            <span className="flex items-center">
              <PhoneIcon className="w-4 h-4 mr-2" />
              <a href="tel:+84977123456" className="hover:underline">034.899.6487</a>
            </span>
            <span className="flex items-center">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              <a href="mailto:info@naturegrain.com" className="hover:underline">giasinguyentran@gmail.com</a>
            </span>
          </div>
          <div className="flex items-center text-sm space-x-4">
            {currentUser ? (
              <span>Xin chào, <strong>{currentUser.username || 'Khách hàng'}</strong></span>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Đăng nhập</Link>
                <Link to="/register" className="hover:underline">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="ml-2 font-bold text-xl sm:text-2xl text-gray-800">
                Nature<span className="text-green-600">Grain</span>
              </span>
            </Link>

            {/* Search bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-green-600"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Right side navigation - Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/cart" className="flex items-center text-gray-700 hover:text-green-600 relative">
                <ShoppingCartIcon className="w-6 h-6" />
                <span className="ml-1">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User menu dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-green-600"
                >
                  <UserIcon className="w-6 h-6" />
                  <span className="ml-1">{currentUser ? 'Tài khoản' : 'Đăng nhập'}</span>
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                    {currentUser ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Thông tin tài khoản
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Đơn hàng của tôi
                        </Link>
                        {currentUser.isAdmin && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Quản trị hệ thống
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Đăng nhập
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Đăng ký
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <Link to="/cart" className="mr-4 text-gray-700 hover:text-green-600 relative">
                <ShoppingCartIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-600"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-gray-50 border-t border-b border-gray-200 hidden lg:block">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center space-x-8">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block py-3 font-medium hover:text-green-600 ${isActive ? 'text-green-600' : 'text-gray-700'}`
                }
              >
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `block py-3 font-medium hover:text-green-600 ${isActive ? 'text-green-600' : 'text-gray-700'}`
                }
              >
                Sản phẩm
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `block py-3 font-medium hover:text-green-600 ${isActive ? 'text-green-600' : 'text-gray-700'}`
                }
              >
                Danh mục
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blogs"
                className={({ isActive }) =>
                  `block py-3 font-medium hover:text-green-600 ${isActive ? 'text-green-600' : 'text-gray-700'}`
                }
              >
                Tin tức
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `block py-3 font-medium hover:text-green-600 ${isActive ? 'text-green-600' : 'text-gray-700'}`
                }
              >
                Giới thiệu
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `block py-3 font-medium hover:text-green-600 ${isActive ? 'text-green-600' : 'text-gray-700'}`
                }
              >
                Liên hệ
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="font-bold text-lg">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-green-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* Search bar - Mobile */}
            <div className="p-4 border-b border-gray-200">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 text-gray-600"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
            
            {/* User account - Mobile */}
            <div className="p-4 border-b border-gray-200">
              {currentUser ? (
                <div>
                  <div className="font-medium mb-2">Xin chào, {currentUser.username}</div>
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="block text-gray-700 hover:text-green-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Thông tin tài khoản
                    </Link>
                    <Link
                      to="/orders"
                      className="block text-gray-700 hover:text-green-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đơn hàng của tôi
                    </Link>
                    {currentUser.isAdmin && (
                      <Link
                        to="/admin"
                        className="block text-gray-700 hover:text-green-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Quản trị hệ thống
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block text-red-600 hover:text-red-700"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="block py-2 px-4 bg-green-600 text-white rounded-md text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
            
            {/* Navigation links - Mobile */}
            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block font-medium ${isActive ? 'text-green-600' : 'text-gray-700'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Trang chủ
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/products"
                    className={({ isActive }) =>
                      `block font-medium ${isActive ? 'text-green-600' : 'text-gray-700'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sản phẩm
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/categories"
                    className={({ isActive }) =>
                      `block font-medium ${isActive ? 'text-green-600' : 'text-gray-700'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Danh mục
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/blogs"
                    className={({ isActive }) =>
                      `block font-medium ${isActive ? 'text-green-600' : 'text-gray-700'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tin tức
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `block font-medium ${isActive ? 'text-green-600' : 'text-gray-700'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giới thiệu
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `block font-medium ${isActive ? 'text-green-600' : 'text-gray-700'}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Liên hệ
                  </NavLink>
                </li>
              </ul>
            </nav>
            
            {/* Contact info - Mobile */}
            <div className="p-4 bg-gray-50 mt-auto">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-2 text-green-600" />
                  <a href="tel:+84977123456">0977.123.456</a>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 mr-2 text-green-600" />
                  <a href="mailto:info@naturegrain.com">info@naturegrain.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;