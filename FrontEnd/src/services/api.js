import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important: Allows cookies to be sent and received
});

// Interceptor response để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Xử lý các mã lỗi phổ biến
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - Đăng xuất và chuyển hướng đến trang đăng nhập
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        default:
          // Các lỗi khác
          console.error('API error:', response.data);
      }
    } else {
      console.error('Network error:', error);
    }
    
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: async () => {
    try {
      // Get current user data from backend - using cookies for authentication
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      return null;
    }
  }
};

// Product Services
export const productService = {
  // User facing endpoints
  getProducts: (params) => {
    // Check filter params and use appropriate endpoints
    if (params && params.category) {
      return api.get(`/product/category/${params.category}`);
    } 
    else if (params && params.minPrice !== undefined && params.maxPrice !== undefined) {
      // Using range endpoint with default category id=0 if none specified
      const categoryId = params.category || 0;
      return api.get(`/product/range?id=${categoryId}&min=${params.minPrice}&max=${params.maxPrice}`);
    } 
    else {
      // Default to getting all products
      return api.get('/product/');
    }
  },
  getProduct: (id) => {
    console.log(`Fetching product with ID: ${id}`);
    return api.get(`/product/${id}`);
  },
  getTopRatedProducts: () => api.get('/product/top-rated'),
  getLatestProducts: () => api.get('/product/latest'),
  searchProducts: (query) => api.get(`/product/search?keyword=${query}`),
  getProductsByCategory: (categoryId) => api.get(`/product/category/${categoryId}`),
  findRelatedProduct: (id) => api.get(`/product/related/${id}`),
  
  // Admin endpoints
  createProduct: (productData) => api.post('/product/create', productData),
  updateProduct: (id, productData) => api.put(`/product/${id}`, productData),
  deleteProduct: (id) => api.delete(`/product/${id}`),
};

// Category Services
export const categoryService = {
  // User facing endpoints
  getCategories: () => api.get('/category/'),
  getListEnabled: () => api.get('/category/enabled'),
  getCategory: (id) => api.get(`/category/${id}`),
  
  // Admin endpoints
  createCategory: (categoryData) => api.post('/category/create', categoryData),
  updateCategory: (id, categoryData) => api.put(`/category/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/category/${id}`),
  enableCategory: (id) => api.put(`/category/${id}/enable`),
};

// Blog Services
export const blogService = {
  // User facing endpoints
  getBlogs: (params) => api.get('/blog', { params }),
  getBlog: (id) => api.get(`/blog/${id}`),
  getLatestBlogs: () => {
    return api.get('/blog/newest?limit=3')
      .catch(error => {
        console.error('Error fetching latest blogs:', error);
        // Return empty array as fallback
        return { data: [] };
      });
  },
  
  // Admin endpoints
  createBlog: (blogData) => api.post('/blog/create', blogData),
  updateBlog: (id, blogData) => api.put(`/blog/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/blog/${id}`),
};

// Order Services
export const orderService = {
  // User facing endpoints
  createOrder: (orderData) => api.post('/order/create', orderData),
  getOrders: () => api.get('/order'),
  getOrder: (id) => api.get(`/order/${id}`),
  cancelOrder: (id) => api.put(`/order/${id}/cancel`),
  
  // Admin endpoints
  updateOrderStatus: (id, status) => api.put(`/order/${id}/status`, { status }),
  getAllOrders: () => api.get('/order/all'),
  getOrdersByStatus: (status) => api.get(`/order/status/${status}`),
};

// User Services
export const userService = {
  // User facing endpoints
  getUserProfile: () => api.get('/user/profile'),
  updateUserProfile: (userData) => api.put('/user/profile', userData),
  changePassword: (passwordData) => api.put('/user/change-password', passwordData),
  
  // Admin endpoints
  getAllUsers: () => api.get('/user/all'),
  getUserById: (id) => api.get(`/user/${id}`),
  updateUserRole: (id, role) => api.put(`/user/${id}/role`, { role }),
};

// Contact Services
export const contactService = {
  submitContactForm: (contactData) => api.post('/contact', contactData),
  getContactInfo: () => api.get('/contact/info')
};

// About Page Services
export const aboutService = {
  getAboutPageData: () => api.get('/about')
};

// Dashboard Services (Admin)
export const dashboardService = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getSalesData: (period) => api.get(`/admin/dashboard/sales?period=${period}`),
};

export default api;