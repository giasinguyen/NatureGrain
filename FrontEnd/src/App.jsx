import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/layout/Layout";
import './App.css'
// Lazy loading các trang để tối ưu hiệu suất
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Trang chủ
const HomePage = lazy(() => import("./pages/HomePage"));
// Trang sản phẩm
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
// Trang danh mục
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CategoryDetailPage = lazy(() => import("./pages/CategoryDetailPage"));
// Trang blog
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
// Trang tìm kiếm
const SearchPage = lazy(() => import("./pages/SearchPage"));
// Trang giỏ hàng và thanh toán
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
// Trang xác thực
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
// Trang người dùng
const ProfilePage = lazy(() => import("./pages/user/ProfilePage"));
const OrdersPage = lazy(() => import("./pages/user/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/user/OrderDetailPage"));
// Trang tĩnh
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <Routes>
                {/* Trang chủ */}
                <Route path="/" element={<HomePage />} />

                {/* Trang sản phẩm */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />

                {/* Trang danh mục */}
                <Route path="/categories" element={<CategoriesPage />} />
                <Route
                  path="/categories/:id"
                  element={<CategoryDetailPage />}
                />

                {/* Trang blog */}
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blog/:id" element={<BlogDetailPage />} />

                {/* Trang tìm kiếm */}
                <Route path="/search" element={<SearchPage />} />

                {/* Trang giỏ hàng và thanh toán */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* Trang xác thực */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Trang người dùng */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/order/:id" element={<OrderDetailPage />} />

                {/* Trang tĩnh */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Trang 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
