import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import './App.css'
// Lazy loading các trang để tối ưu hiệu suất
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { useAuth } from "./context/AuthContext";

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

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProductsManagement = lazy(() => import("./pages/admin/ProductsManagement"));
const CategoriesManagement = lazy(() => import("./pages/admin/CategoriesManagement"));
const OrdersManagement = lazy(() => import("./pages/admin/OrdersManagement"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

// AppContent component with routes
function AppContent() {
  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };
  
  // Admin Route component that checks for admin role
  const AdminRoute = ({ children }) => {
    const { currentUser, isAuthenticated, loading } = useAuth();
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }
    
    if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="products" element={<ProductsManagement />} />
                  <Route path="categories" element={<CategoriesManagement />} />
                  <Route path="orders" element={<OrdersManagement />} />
                  {/* Add more admin routes as needed */}
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </AdminLayout>
            </Suspense>
          </AdminRoute>
        }
      />
      
      {/* User Routes */}
      <Route 
        path="/*"
        element={
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
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Trang danh mục */}
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/categories/:id" element={<CategoryDetailPage />} />

                {/* Trang blog */}
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blog/:id" element={<BlogDetailPage />} />

                {/* Trang tìm kiếm */}
                <Route path="/search" element={<SearchPage />} />

                {/* Trang giỏ hàng và thanh toán */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />

                {/* Trang xác thực */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Trang người dùng */}
                <Route path="/user/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/user/orders" element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/user/order/:id" element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                } />

                {/* Redirect old profile paths to new ones */}
                <Route path="/profile" element={<Navigate to="/user/profile" replace />} />
                <Route path="/orders" element={<Navigate to="/user/orders" replace />} />
                <Route path="/order/:id" element={<Navigate to="/user/order/:id" replace />} />

                {/* Trang tĩnh */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Trang 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
