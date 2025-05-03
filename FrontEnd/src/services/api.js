import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor request để xử lý token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Kiểm tra token hết hạn
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token đã hết hạn, chuyển hướng về trang đăng nhập
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject('Token expired');
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
          localStorage.removeItem('token');
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
  login: (username, password) => api.post('/auth/signin', { username, password }),
  register: (userData) => api.post('/auth/signup', userData),
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null;
  },
};

// Product Services
export const productService = {
  // Update to match available endpoints
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
};

// Category Services
export const categoryService = {
  getCategories: () => api.get('/category/enabled'),
  getListEnabled: () => {
    return api.get('/category/enabled');
  },
  getCategory: (id) => api.get(`/category/${id}`),
};

// Blog Services
export const blogService = {
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
};

// Order Services
export const orderService = {
  createOrder: (orderData) => api.post('/order', orderData),
  getOrders: () => api.get('/order'),
  getOrder: (id) => api.get(`/order/${id}`),
  cancelOrder: (id) => api.put(`/order/${id}/cancel`),
};

// User Services
export const userService = {
  getUserProfile: () => api.get('/user/profile'),
  updateUserProfile: (userData) => api.put('/user/profile', userData),
  changePassword: (passwordData) => api.put('/user/change-password', passwordData),
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

export default api;