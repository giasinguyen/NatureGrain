import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement newsletter subscription
      alert(`Cảm ơn bạn đã đăng ký nhận tin với email: ${email}`);
      setEmail('');
    }
  };
  
  return (
    <footer className="bg-gray-800 text-gray-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Company */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img src="/logo-white.svg" alt="NatureGrain" className="h-10" />
              <span className="ml-2 font-bold text-xl text-white">
                Nature<span className="text-green-400">Grain</span>
              </span>
            </Link>
            <p className="mb-4 text-gray-300">
              NatureGrain là nhà cung cấp thực phẩm hữu cơ hàng đầu, mang đến những sản phẩm chất lượng cao từ thiên nhiên, đảm bảo an toàn và tốt cho sức khỏe.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-green-400 flex items-center">
                  <ArrowRightIcon className="w-3 h-3 mr-2" />
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-green-400 flex items-center">
                  <ArrowRightIcon className="w-3 h-3 mr-2" />
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-green-400 flex items-center">
                  <ArrowRightIcon className="w-3 h-3 mr-2" />
                  Tin tức
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-400 flex items-center">
                  <ArrowRightIcon className="w-3 h-3 mr-2" />
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/policies/privacy" className="hover:text-green-400 flex items-center">
                  <ArrowRightIcon className="w-3 h-3 mr-2" />
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/policies/terms" className="hover:text-green-400 flex items-center">
                  <ArrowRightIcon className="w-3 h-3 mr-2" />
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/policies/returns" className="hover:text-green-400 flex items-center">
                  <ArrowRightIcon className="w-3 h-3 mr-2" />
                  Chính sách đổi trả
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                <span>123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-start">
                <PhoneIcon className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                <span>
                  Hotline: <a href="tel:+84977123456" className="hover:text-green-400">0977.123.456</a>
                </span>
              </li>
              <li className="flex items-start">
                <EnvelopeIcon className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                <span>
                  Email: <a href="mailto:info@naturegrain.com" className="hover:text-green-400">info@naturegrain.com</a>
                </span>
              </li>
              <li className="flex items-start">
                <ClockIcon className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                <div>
                  <p>Giờ làm việc:</p>
                  <p>Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                  <p>Thứ 7: 8:00 - 12:00</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Đăng ký nhận tin</h3>
            <p className="mb-4 text-gray-300">
              Đăng ký để nhận thông tin mới nhất về sản phẩm, khuyến mãi và các tin tức hữu ích.
            </p>
            <form onSubmit={handleSubscribe}>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 flex-grow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Đăng ký
                </button>
              </div>
            </form>
            <div className="mt-4">
              <img 
                src="/payment-methods.png" 
                alt="Phương thức thanh toán" 
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} NatureGrain - Tất cả các quyền được bảo lưu</p>
          <p className="mt-1">Thiết kế và phát triển bởi Team NatureGrain</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;