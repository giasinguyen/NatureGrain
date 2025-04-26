import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { productService, categoryService, blogService } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState({
    featured: true,
    latest: true,
    categories: true,
    blogs: true
  });

  // Fetch dữ liệu khi component được render
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sản phẩm nổi bật (top-rated)
        productService.getTopRatedProducts()
          .then(response => {
            setFeaturedProducts(response.data);
            setLoading(prev => ({ ...prev, featured: false }));
          })
          .catch(error => {
            console.error('Error fetching featured products:', error);
            setLoading(prev => ({ ...prev, featured: false }));
          });

        // Fetch sản phẩm mới nhất
        productService.getLatestProducts()
          .then(response => {
            setLatestProducts(response.data);
            setLoading(prev => ({ ...prev, latest: false }));
          })
          .catch(error => {
            console.error('Error fetching latest products:', error);
            setLoading(prev => ({ ...prev, latest: false }));
          });

        // Fetch danh mục
        categoryService.getCategories()
          .then(response => {
            setCategories(response.data);
            setLoading(prev => ({ ...prev, categories: false }));
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
            setLoading(prev => ({ ...prev, categories: false }));
          });

        // Fetch bài viết blog mới nhất
        blogService.getLatestBlogs()
          .then(response => {
            setLatestBlogs(response.data);
            setLoading(prev => ({ ...prev, blogs: false }));
          })
          .catch(error => {
            console.error('Error fetching latest blogs:', error);
            setLoading(prev => ({ ...prev, blogs: false }));
          });

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading({
          featured: false,
          latest: false,
          categories: false,
          blogs: false
        });
      }
    };

    fetchData();
  }, []);

  // Format date for blog posts
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-r from-primary-800 to-primary-600 pt-16 pb-20 px-4 sm:px-6 lg:pt-20 lg:pb-24 lg:px-8">
        <div className="container mx-auto relative z-10">
          <div className="max-w-xl mx-auto lg:max-w-none lg:flex items-center justify-between">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:mt-6">
                Thực phẩm lành mạnh <span className="block text-primary-200">từ thiên nhiên</span>
              </h1>
              <p className="mt-3 text-base text-primary-100 sm:mt-5 sm:text-xl">
                Trải nghiệm những sản phẩm từ thiên nhiên, lành mạnh và bổ dưỡng. 
                Chúng tôi cam kết mang đến những trải nghiệm tiêu dùng tốt nhất cho khách hàng.
              </p>
              <div className="mt-8 sm:mt-10">
                <Link 
                  to="/products" 
                  className="btn-primary py-3 px-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Khám phá ngay
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1576072115075-67de7b49e225?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                alt="Organic groceries" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
        {/* Decorative blob */}
        <div className="hidden lg:block absolute top-0 right-0 -mt-20 -mr-20">
          <svg width="404" height="384" fill="none" viewBox="0 0 404 384">
            <defs>
              <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-primary-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)" />
          </svg>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-4 sm:py-20 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Danh mục sản phẩm
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Khám phá các sản phẩm từ thiên nhiên đa dạng
            </p>
          </div>

          {loading.categories ? (
            <div className="mt-12">
              <LoadingSpinner size="lg" className="mx-auto" />
            </div>
          ) : (
            <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 4).map((category) => (
                <Link 
                  key={category.id} 
                  to={`/categories/${category.id}`}
                  className="group block overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image || `https://via.placeholder.com/400x200?text=${category.name}`}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    <ChevronRightIcon className="h-5 w-5 text-primary-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link 
              to="/categories"
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
            >
              Xem tất cả danh mục
              <ChevronRightIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Sản phẩm nổi bật
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Những sản phẩm được yêu thích nhất
            </p>
          </div>

          {loading.featured ? (
            <LoadingSpinner size="lg" className="mx-auto" />
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-gray-500">Không có sản phẩm nổi bật.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="btn-outline px-6 py-3"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Promo */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-primary-100">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="badge-primary inline-block mb-4">Ưu đãi đặc biệt</div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
                  Giảm 20% cho đơn hàng đầu tiên
                </h2>
                <p className="text-gray-500 mb-8">
                  Nhập mã <span className="font-bold text-primary-600">NATUREFIRST</span> để được giảm 20% cho đơn hàng đầu tiên của bạn. Áp dụng cho tất cả sản phẩm.
                </p>
                <Link
                  to="/products"
                  className="btn-primary px-6 py-3 w-fit"
                >
                  Mua ngay
                </Link>
              </div>
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1594489304122-a50fdb143d05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Organic products promotion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Sản phẩm mới nhất
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Khám phá các sản phẩm mới nhất của chúng tôi
            </p>
          </div>

          {loading.latest ? (
            <LoadingSpinner size="lg" className="mx-auto" />
          ) : latestProducts.length === 0 ? (
            <p className="text-center text-gray-500">Không có sản phẩm mới.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {latestProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:py-20 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Tại sao chọn NatureGrain?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao
            </p>
          </div>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {/* Benefit 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sản phẩm tự nhiên 100%</h3>
              <p className="text-gray-600">
                Tất cả sản phẩm của chúng tôi đều được sản xuất từ nguyên liệu tự nhiên, không chứa hóa chất độc hại.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Giao hàng nhanh chóng</h3>
              <p className="text-gray-600">
                Chúng tôi cam kết giao hàng nhanh chóng và đảm bảo trong thời gian ngắn nhất.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-600">
                Chúng tôi luôn đặt chất lượng sản phẩm lên hàng đầu và cam kết đáp ứng các tiêu chuẩn nghiêm ngặt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Bài viết mới nhất
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Cập nhật các kiến thức về sức khỏe và dinh dưỡng
            </p>
          </div>

          {loading.blogs ? (
            <LoadingSpinner size="lg" className="mx-auto" />
          ) : latestBlogs.length === 0 ? (
            <p className="text-center text-gray-500">Không có bài viết mới.</p>
          ) : (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
              {latestBlogs.slice(0, 3).map((blog) => (
                <Link 
                  key={blog.id} 
                  to={`/blog/${blog.id}`}
                  className="group block overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image || `https://via.placeholder.com/400x200?text=${blog.title}`}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {formatDate(blog.createdDate)}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {blog.shortDescription || blog.content?.substring(0, 120) + '...'}
                    </p>
                    <div className="mt-4 flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                      Đọc thêm
                      <ChevronRightIcon className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/blogs"
              className="btn-outline px-6 py-3"
            >
              Xem tất cả bài viết
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary-700 py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Đăng ký nhận thông tin
            </h2>
            <p className="mt-3 text-xl text-primary-100 sm:mt-4">
              Nhận thông tin về sản phẩm mới, khuyến mãi và các bài viết bổ ích
            </p>
            <form className="mt-8 sm:flex justify-center">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs border-white rounded-md"
                placeholder="Nhập địa chỉ email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}