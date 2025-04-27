import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService, blogService } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [featuredRes, latestRes, categoriesRes, blogsRes] = await Promise.all([
          productService.getTopRatedProducts(), // /api/product/top-rated
          productService.getLatestProducts(), // /api/product/latest
          categoryService.getListEnabled(), // /api/category/enabled
          blogService.getLatestBlogs(), // /api/blog/latest
        ]);
        
        setFeaturedProducts(featuredRes.data);
        setLatestProducts(latestRes.data);
        setCategories(categoriesRes.data);
        setLatestBlogs(blogsRes.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-green-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/public/banner-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Thực phẩm hữu cơ từ <span className="text-yellow-400">thiên nhiên</span>
            </h1>
            <p className="text-white text-lg mb-8">
              Cung cấp các sản phẩm organic, lành mạnh và chất lượng cao. Chúng tôi cam kết mang đến những sản phẩm tươi ngon nhất từ thiên nhiên đến bàn ăn của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products" 
                className="bg-white text-green-700 font-medium py-3 px-6 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Mua sắm ngay
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
              <Link 
                to="/about" 
                className="bg-transparent text-white border border-white font-medium py-3 px-6 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors text-center"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Danh mục nổi bật */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Danh mục sản phẩm</h2>
            <p className="text-gray-600">Khám phá các sản phẩm organic chất lượng cao</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map(category => (
              <Link 
                key={category.id} 
                to={`/categories/${category.id}`}
                className="group relative overflow-hidden rounded-lg shadow-md bg-white aspect-[4/3]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <img 
                  src={category.image || `/category-${category.id}.jpg`} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                  <p className="text-gray-200 text-sm mt-1">
                    {category.productCount || '10+'} sản phẩm
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/categories"
              className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
            >
              Xem tất cả danh mục
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Sản phẩm nổi bật */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
            <Link 
              to="/products"
              className="text-green-600 font-medium hover:text-green-700 hidden sm:flex items-center"
            >
              Xem tất cả
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-8 sm:hidden">
            <Link 
              to="/products"
              className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
            >
              Xem tất cả sản phẩm
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Banner quảng cáo */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Khám phá sự khác biệt với thực phẩm organic</h2>
              <p className="text-green-100 mb-6">
                Thực phẩm hữu cơ không chỉ tốt cho sức khỏe của bạn mà còn tốt cho môi trường. Chúng tôi cam kết cung cấp những sản phẩm organic chất lượng cao.
              </p>
              <Link 
                to="/about" 
                className="inline-block bg-white text-green-700 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors"
              >
                Tìm hiểu thêm
              </Link>
            </div>
            
            <div className="md:w-1/3">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0 text-green-300" />
                  <span>100% Nguyên liệu hữu cơ từ thiên nhiên</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0 text-green-300" />
                  <span>Không thuốc trừ sâu, không hóa chất độc hại</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0 text-green-300" />
                  <span>Được chứng nhận tiêu chuẩn organic quốc tế</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0 text-green-300" />
                  <span>Giao hàng nhanh chóng, đảm bảo độ tươi ngon</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sản phẩm mới */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Sản phẩm mới</h2>
            <Link 
              to="/products?sort=latest"
              className="text-green-600 font-medium hover:text-green-700 hidden sm:flex items-center"
            >
              Xem tất cả
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-8 sm:hidden">
            <Link 
              to="/products?sort=latest"
              className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
            >
              Xem tất cả sản phẩm mới
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      {latestBlogs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Bài viết mới nhất</h2>
              <Link 
                to="/blogs"
                className="text-green-600 font-medium hover:text-green-700 hidden sm:flex items-center"
              >
                Xem tất cả
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestBlogs.map(blog => (
                <Link 
                  key={blog.id} 
                  to={`/blog/${blog.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={blog.image || '/blog-placeholder.jpg'} 
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-5">
                    <div className="text-xs text-gray-500 mb-2">{new Date(blog.createdDate).toLocaleDateString('vi-VN')}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{blog.summary || blog.content.substring(0, 120) + '...'}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-8 sm:hidden">
              <Link 
                to="/blogs"
                className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
              >
                Xem tất cả bài viết
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-gray-600">Những đánh giá từ khách hàng đã trải nghiệm sản phẩm</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
              <p className="text-gray-700 mb-4">
                "Tôi đã sử dụng các sản phẩm organic từ NatureGrain và cảm thấy rất hài lòng. Rau củ luôn tươi ngon, và dịch vụ giao hàng rất nhanh chóng. Sẽ tiếp tục ủng hộ cửa hàng trong tương lai!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="/testimonial-1.jpg" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Nguyễn Thị Mai</h4>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
              <p className="text-gray-700 mb-4">
                "Là một người quan tâm đến sức khỏe gia đình, tôi luôn lựa chọn những sản phẩm organic. NatureGrain đã đáp ứng được yêu cầu của tôi với chất lượng sản phẩm tuyệt vời và giá cả hợp lý."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="/testimonial-2.jpg" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Trần Văn Minh</h4>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
              <p className="text-gray-700 mb-4">
                "Tôi rất thích cách NatureGrain đóng gói các sản phẩm, rất chuyên nghiệp và thân thiện với môi trường. Hơn nữa, các sản phẩm organic của họ có hương vị tự nhiên và rất ngon."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="/testimonial-3.jpg" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Lê Thị Hương</h4>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Đăng ký nhận tin</h2>
            <p className="text-green-100 mb-8">
              Đăng ký để nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và các mẹo sống xanh.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className="flex-1 py-3 px-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button 
                type="submit" 
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-full transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;