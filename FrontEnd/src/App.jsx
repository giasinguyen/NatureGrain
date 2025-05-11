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
const AnalyticsPage = lazy(() => import("./pages/admin/AnalyticsPage"));
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
        path="/admin"
        element={
          <AdminRoute>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <AdminLayout />
            </Suspense>
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="categories" element={<CategoriesManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        {/* Add more admin routes as needed */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      
      {/* User Routes */}
      <Route path="/*" element={<Layout />}>
        <Route 
          index 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <HomePage />
            </Suspense>
          } 
        />

        {/* Trang sản phẩm */}
        <Route 
          path="products" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <ProductsPage />
            </Suspense>
          } 
        />
        <Route 
          path="products/:id" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <ProductDetailPage />
            </Suspense>
          } 
        />

        {/* Trang danh mục */}
        <Route 
          path="categories" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <CategoriesPage />
            </Suspense>
          } 
        />
        <Route 
          path="categories/:id" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <CategoryDetailPage />
            </Suspense>
          } 
        />

        {/* Trang blog */}
        <Route 
          path="blogs" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <BlogsPage />
            </Suspense>
          } 
        />
        <Route 
          path="blog/:id" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <BlogDetailPage />
            </Suspense>
          } 
        />

        {/* Trang tìm kiếm */}
        <Route 
          path="search" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <SearchPage />
            </Suspense>
          } 
        />

        {/* Trang giỏ hàng và thanh toán */}
        <Route 
          path="cart" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <CartPage />
            </Suspense>
          } 
        />
        <Route 
          path="checkout" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
                <CheckoutPage />
              </Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Trang xác thực */}
        <Route 
          path="login" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <LoginPage />
            </Suspense>
          } 
        />
        <Route 
          path="register" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <RegisterPage />
            </Suspense>
          } 
        />

        {/* Trang người dùng */}
        <Route 
          path="user/profile" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
                <ProfilePage />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="user/orders" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
                <OrdersPage />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="user/order/:id" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
                <OrderDetailPage />
              </Suspense>
            </ProtectedRoute>
          } 
        />

        {/* Redirect old profile paths to new ones */}
        <Route path="profile" element={<Navigate to="/user/profile" replace />} />
        <Route path="orders" element={<Navigate to="/user/orders" replace />} />
        <Route path="order/:id" element={<Navigate to="/user/order/:id" replace />} />

        {/* Trang tĩnh */}
        <Route 
          path="about" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <AboutPage />
            </Suspense>
          } 
        />
        <Route 
          path="contact" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <ContactPage />
            </Suspense>
          } 
        />

        {/* Trang 404 */}
        <Route 
          path="*" 
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
              <NotFoundPage />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;
