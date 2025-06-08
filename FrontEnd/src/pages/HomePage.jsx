import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService, blogService } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  ArrowRightIcon, 
  CheckCircleIcon,
  TruckIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UsersIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon,
  ShoppingCartIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    satisfaction: 0
  });
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const statsRef = useRef(null);
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
        
        // Animate stats counter
        animateStats();
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  // Stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isStatsVisible) {
          setIsStatsVisible(true);
          animateStats();
        }
      },
      { threshold: 0.5 }
    );

    const currentStatsRef = statsRef.current;
    if (currentStatsRef) {
      observer.observe(currentStatsRef);
    }

    return () => {
      if (currentStatsRef) {
        observer.unobserve(currentStatsRef);
      }
    };
  }, [isStatsVisible]);

  const animateStats = () => {
    const targets = { customers: 5000, products: 500, orders: 15000, satisfaction: 98 };
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setStats({
        customers: Math.floor(targets.customers * progress),
        products: Math.floor(targets.products * progress),
        orders: Math.floor(targets.orders * progress),
        satisfaction: Math.floor(targets.satisfaction * progress)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setEmailInput('');
    setIsNewsletterSubmitting(false);
    alert('Đã đăng ký thành công!');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }
    return (
    <div>
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/public/banner-bg.jpg')] bg-cover bg-center opacity-10"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium">
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  100% Organic & Natural
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  Thực phẩm hữu cơ từ{' '}
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                    thiên nhiên
                  </span>
                </h1>
                <p className="text-xl text-green-100 leading-relaxed">
                  Cung cấp các sản phẩm organic, lành mạnh và chất lượng cao. 
                  Chúng tôi cam kết mang đến những sản phẩm tươi ngon nhất từ thiên nhiên đến bàn ăn của bạn.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products" 
                  className="group bg-gradient-to-r from-yellow-400 to-amber-500 text-green-800 font-semibold py-4 px-8 rounded-full hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                >
                  Mua sắm ngay
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/about" 
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all duration-300 text-center"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/30 to-green-300/30 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <PuzzlePieceIcon className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">100%</div>
                      <div className="text-green-200 text-sm">Organic</div>
                    </div>
                    <div className="text-center">
                      <ShieldCheckIcon className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">Chứng nhận</div>
                      <div className="text-green-200 text-sm">Quốc tế</div>
                    </div>
                    <div className="text-center">
                      <TruckIcon className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">Giao nhanh</div>
                      <div className="text-green-200 text-sm">24h</div>
                    </div>
                    <div className="text-center">
                      <HeartIcon className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">Tươi ngon</div>
                      <div className="text-green-200 text-sm">Đảm bảo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section ref={statsRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <UsersIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stats.customers.toLocaleString()}+</div>
              <div className="text-gray-600">Khách hàng hài lòng</div>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <PuzzlePieceIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stats.products}+</div>
              <div className="text-gray-600">Sản phẩm organic</div>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 group-hover:bg-amber-200 transition-colors">
                <ShoppingCartIcon className="w-8 h-8 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stats.orders.toLocaleString()}+</div>
              <div className="text-gray-600">Đơn hàng thành công</div>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 group-hover:bg-emerald-200 transition-colors">
                <StarIcon className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stats.satisfaction}%</div>
              <div className="text-gray-600">Độ hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <GlobeAltIcon className="w-4 h-4 mr-2" />
              Khám phá danh mục
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Danh mục sản phẩm</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá bộ sưu tập đa dạng các sản phẩm organic chất lượng cao được tuyển chọn kỹ lưỡng
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.slice(0, 4).map((category, index) => (
              <Link 
                key={category.id} 
                to={`/categories/${category.id}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg bg-white aspect-[4/5] transform hover:scale-105 transition-all duration-500 hover:shadow-2xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-yellow-400/20 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <img 
                  src={category.image || `/category-${category.id}.jpg`} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <h3 className="text-white text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-200 text-sm mb-3">
                      {category.productCount || '10+'} sản phẩm có sẵn
                    </p>
                    <div className="flex items-center text-yellow-400 text-sm font-medium">
                      Khám phá ngay
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/categories"
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Xem tất cả danh mục
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
        {/* Featured Products with Modern Design */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="inline-flex items-center bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <StarIcon className="w-4 h-4 mr-2" />
                Được yêu thích nhất
              </div>
              <h2 className="text-4xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
              <p className="text-gray-600 mt-2">Những sản phẩm được khách hàng đánh giá cao nhất</p>
            </div>
            <Link 
              to="/products"
              className="hidden md:inline-flex items-center text-green-600 font-semibold hover:text-green-700 hover:underline transition-all"
            >
              Xem tất cả
              <ArrowRightIcon className="w-5 h-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 md:hidden">
            <Link 
              to="/products"
              className="inline-flex items-center bg-green-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              Xem tất cả sản phẩm
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Features Banner */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full blur-3xl opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <PuzzlePieceIcon className="w-4 h-4 mr-2" />
                  Cam kết chất lượng
                </div>
                <h2 className="text-4xl font-bold mb-6">
                  Khám phá sự khác biệt với thực phẩm organic
                </h2>
                <p className="text-green-100 text-lg leading-relaxed mb-8">
                  Thực phẩm hữu cơ không chỉ tốt cho sức khỏe của bạn mà còn tốt cho môi trường. 
                  Chúng tôi cam kết cung cấp những sản phẩm organic chất lượng cao với quy trình 
                  sản xuất nghiêm ngặt và bền vững.
                </p>
                <Link 
                  to="/about" 
                  className="inline-flex items-center bg-white text-green-700 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Tìm hiểu thêm
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full mb-4">
                  <PuzzlePieceIcon className="w-6 h-6 text-green-800" />
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Organic</h3>
                <p className="text-green-200">Nguyên liệu hữu cơ từ thiên nhiên, không hóa chất độc hại</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full mb-4">
                  <ShieldCheckIcon className="w-6 h-6 text-green-800" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Chứng nhận</h3>
                <p className="text-green-200">Được chứng nhận tiêu chuẩn organic quốc tế</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full mb-4">
                  <TruckIcon className="w-6 h-6 text-green-800" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Giao hàng nhanh</h3>
                <p className="text-green-200">Giao hàng nhanh chóng, đảm bảo độ tươi ngon</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full mb-4">
                  <HeartIcon className="w-6 h-6 text-green-800" />
                </div>
                <h3 className="text-xl font-semibold mb-2">An toàn</h3>
                <p className="text-green-200">Không thuốc trừ sâu, an toàn cho sức khỏe</p>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/* Latest Products */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <SparklesIcon className="w-4 h-4 mr-2" />
                Mới ra mắt
              </div>
              <h2 className="text-4xl font-bold text-gray-800">Sản phẩm mới</h2>
              <p className="text-gray-600 mt-2">Khám phá những sản phẩm organic mới nhất</p>
            </div>
            <Link 
              to="/products?sort=latest"
              className="hidden md:inline-flex items-center text-green-600 font-semibold hover:text-green-700 hover:underline transition-all"
            >
              Xem tất cả
              <ArrowRightIcon className="w-5 h-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {latestProducts.map((product, index) => (
              <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 md:hidden">
            <Link 
              to="/products?sort=latest"
              className="inline-flex items-center bg-green-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              Xem tất cả sản phẩm mới
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Blog Section */}
      {latestBlogs.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <GlobeAltIcon className="w-4 h-4 mr-2" />
                Blog & Tin tức
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Bài viết mới nhất</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Cập nhật những thông tin mới nhất về thực phẩm organic và lối sống lành mạnh
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestBlogs.map((blog, index) => (
                <Link 
                  key={blog.id} 
                  to={`/blog/${blog.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img 
                      src={blog.image || '/blog-placeholder.jpg'} 
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <time>{new Date(blog.createdDate).toLocaleDateString('vi-VN')}</time>
                      <span className="mx-2">•</span>
                      <span>5 phút đọc</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed">
                      {blog.summary || blog.content.substring(0, 120) + '...'}
                    </p>
                    <div className="flex items-center text-green-600 font-medium mt-4 group-hover:text-green-700">
                      Đọc thêm
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/blogs"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Xem tất cả bài viết
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}
        {/* Enhanced Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <HeartIcon className="w-4 h-4 mr-2" />
              Khách hàng yêu thích
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hàng ngàn khách hàng đã tin tương và lựa chọn sản phẩm của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "Tôi đã sử dụng các sản phẩm organic từ NatureGrain và cảm thấy rất hài lòng. 
                Rau củ luôn tươi ngon, và dịch vụ giao hàng rất nhanh chóng. Sẽ tiếp tục ủng hộ 
                cửa hàng trong tương lai!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-4 ring-green-100">
                  <img src="/testimonial-1.jpg" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Nguyễn Thị Mai</h4>
                  <p className="text-sm text-gray-500">Khách hàng thân thiết</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "Là một người quan tâm đến sức khỏe gia đình, tôi luôn lựa chọn những sản phẩm organic. 
                NatureGrain đã đáp ứng được yêu cầu của tôi với chất lượng sản phẩm tuyệt vời và giá cả hợp lý."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-4 ring-blue-100">
                  <img src="/testimonial-2.jpg" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Trần Văn Minh</h4>
                  <p className="text-sm text-gray-500">Khách hàng VIP</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
              <div className="flex items-center mb-6">
                {[...Array(4)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <StarIcon className="w-5 h-5 text-gray-300" />
              </div>
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "Tôi rất thích cách NatureGrain đóng gói các sản phẩm, rất chuyên nghiệp và thân thiện 
                với môi trường. Hơn nữa, các sản phẩm organic của họ có hương vị tự nhiên và rất ngon."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-4 ring-purple-100">
                  <img src="/testimonial-3.jpg" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Lê Thị Hương</h4>
                  <p className="text-sm text-gray-500">Khách hàng mới</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Newsletter */}
      <section className="py-20 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-yellow-400/20 text-yellow-300 px-6 py-3 rounded-full text-sm font-medium mb-8">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Nhận thông tin độc quyền
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Đăng ký nhận tin tức mới nhất
            </h2>
            <p className="text-xl text-green-100 mb-12 leading-relaxed">
              Đăng ký để nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt, 
              các mẹo sống xanh và những câu chuyện thú vị từ trang trại hữu cơ của chúng tôi.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <input 
                  type="email" 
                  placeholder="Nhập địa chỉ email của bạn" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full py-4 px-6 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-400/30 bg-white shadow-lg text-lg"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isNewsletterSubmitting}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-green-800 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNewsletterSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-800 mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  'Đăng ký ngay'
                )}
              </button>
            </form>
            
            <p className="text-green-200 text-sm mt-6">
              * Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và không spam
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;