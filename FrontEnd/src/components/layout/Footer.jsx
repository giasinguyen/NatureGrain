import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Trong thực tế, gửi email đến API
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail('');
      // Reset form sau 5 giây
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                className="h-8 w-auto" 
                src="/logo.png" 
                alt="NatureGrain Logo"
                onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/150x50?text=NatureGrain"}}
              />
              <span className="ml-2 text-xl font-bold text-white">NatureGrain</span>
            </div>
            <p className="text-gray-400 mb-4">
              NatureGrain cung cấp các sản phẩm ngũ cốc và thực phẩm hữu cơ chất lượng cao, 
              được chọn lọc kỹ lưỡng từ các nguồn cung cấp đáng tin cậy.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.66.254 1.216.598 1.772 1.153.555.556.9 1.113 1.154 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772c-.556.555-1.113.9-1.772 1.154-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15c-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Liên kết nhanh</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Thông tin liên hệ</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                <a href="tel:+84123456789" className="text-gray-400 hover:text-white">
                  0123 456 789
                </a>
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                <a href="mailto:contact@naturegrain.com" className="text-gray-400 hover:text-white">
                  contact@naturegrain.com
                </a>
              </li>
            </ul>

            {/* Business hours */}
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2 text-white">Giờ làm việc</h3>
              <p className="text-gray-400">Thứ 2 - Thứ 6: 8:00 - 17:30</p>
              <p className="text-gray-400">Thứ 7: 8:00 - 12:00</p>
              <p className="text-gray-400">Chủ nhật: Đóng cửa</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Đăng ký nhận tin</h2>
            <p className="text-gray-400 mb-4">
              Đăng ký để nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Đăng ký
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 text-green-400 text-sm">
                  Cảm ơn bạn đã đăng ký!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            © {currentYear} NatureGrain. Tất cả các quyền được bảo lưu.
          </p>
          <div className="mt-4 sm:mt-0">
            <p className="text-gray-400 text-sm">
              Thiết kế bởi{' '}
              <a href="/" className="text-primary-500 hover:text-primary-400">
                NatureGrain Team
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}