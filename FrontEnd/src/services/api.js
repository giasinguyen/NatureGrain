import axios from 'axios';
import { toast } from 'react-toastify';
import { getImageUrlWithCacheBuster } from '../utils/imageUtils';

// Sử dụng biến môi trường nếu có, nếu không dùng giá trị mặc định
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Timeouts
const DEFAULT_TIMEOUT = 30000; // 30 seconds default
const IMAGE_OPERATION_TIMEOUT = 90000; // 90 seconds for image operations

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Allows cookies to be sent and received
  timeout: DEFAULT_TIMEOUT,
});

// Create a separate instance for image operations with longer timeout
const imageApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: IMAGE_OPERATION_TIMEOUT,
});

// Add retry mechanism for image API requests
imageApi.interceptors.response.use(null, async (error) => {
  const config = error.config;
  
  // Only retry GET requests for images, not mutations
  if (config && config.method === 'get' && config.url.includes('images') && (!config.retry || config.retry < 3)) {
    config.retry = (config.retry || 0) + 1;
    
    // Add exponential backoff delay
    const delay = Math.pow(2, config.retry) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Add cache busting parameter to avoid cached errors
    if (config.url.includes('?')) {
      config.url = `${config.url}&t=${Date.now()}`;
    } else {
      config.url = `${config.url}?t=${Date.now()}`;
    }
    
    console.log(`Retrying image request (attempt ${config.retry}): ${config.url}`);
    return imageApi(config);
  }
  
  return Promise.reject(error);
});

// Biến để theo dõi có đang redirect hay không
let isRedirecting = false;

// Interceptor request để log và xử lý request
api.interceptors.request.use(
  (config) => {
    // Log chi tiết request trong development mode
    const isDev = import.meta.env.DEV || import.meta.env.VITE_ENV === 'development';
    
    if (isDev) {
      console.log(`🚀 API Request [${config.method.toUpperCase()}]:`, config.url);
      if (config.params && Object.keys(config.params).length) {
        console.log('Request params:', config.params);
      }
      if (config.data) {
        console.log('Request payload:', config.data);
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
  (response) => {
    const isDev = import.meta.env.DEV || import.meta.env.VITE_ENV === 'development';
    
    if (isDev) {
      console.log(`✅ API Response [${response.config.method.toUpperCase()}]:`, response.config.url);
      if (response.data && typeof response.data === 'object') {
        console.log('Response data:', response.data);
      }
    }
    
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Xử lý các mã lỗi phổ biến
    if (response) {
      const errorMessage = response.data?.message || 'Có lỗi xảy ra';
      
      switch (response.status) {
        case 400:
          // Bad Request
          toast.error(`Yêu cầu không hợp lệ: ${errorMessage}`);
          break;
        case 401:
          // Unauthorized - Đăng xuất và chuyển hướng đến trang đăng nhập
          sessionStorage.removeItem('userInfo');
          
          // Tránh hiển thị nhiều thông báo và nhiều lần redirect
          if (!isRedirecting) {
            isRedirecting = true;
            toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
            
            // Tránh redirect nếu đã ở trang đăng nhập để tránh vòng lặp
            if (!window.location.pathname.includes('/login')) {
              setTimeout(() => {
                window.location.href = '/login';
                isRedirecting = false;
              }, 2000);
            } else {
              isRedirecting = false;
            }
          }
          break;
        case 403:
          // Forbidden
          toast.error('Bạn không có quyền truy cập tài nguyên này');
          break;
        case 404:
          // Not found
          toast.error(`Không tìm thấy: ${errorMessage}`);
          break;
        case 500:
          // Server error
          toast.error('Lỗi máy chủ, vui lòng thử lại sau');
          break;
        default:
          // Các lỗi khác
          toast.error(`Lỗi (${response.status}): ${errorMessage}`);
      }
      
      console.error('API error:', response.data);
    } else {
      // Network error hoặc lỗi không có response
      toast.error('Không thể kết nối đến máy chủ, vui lòng kiểm tra kết nối mạng');
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
      // Không xóa session ở đây, để cho AuthContext xử lý
      throw error; // Rethrow để AuthContext xử lý
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
  updateProduct: (id, productData) => api.put(`/product/update/${id}`, productData),
  deleteProduct: (id) => api.delete(`/product/delete/${id}`),
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
        // Giải pháp thay thế trong trường hợp lỗi: lấy danh sách blog và lọc
        return api.get('/blog')
          .then(response => {
            const blogs = response.data || [];
            // Sắp xếp theo ID (giả định rằng ID cao hơn là mới nhất)
            const sortedBlogs = [...blogs].sort((a, b) => b.id - a.id);
            // Chỉ lấy 3 blog đầu tiên
            return { data: sortedBlogs.slice(0, 3) };
          })
          .catch(secondError => {
            console.error('Fetch blog dự phòng cũng thất bại:', secondError);
            return { data: [] }; // Trả về mảng rỗng như lựa chọn cuối cùng
          });
      });
  },
  
  // Admin endpoints
  createBlog: (blogData) => api.post('/blog/create', blogData),
  updateBlog: (id, blogData) => api.put(`/blog/update/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/blog/delete/${id}`),
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
  getAllOrders: (sortBy = 'newest') => api.get(`/order/all?sortBy=${sortBy}`),
  getOrdersByStatus: (status) => api.get(`/order/status/${status}`),
};

// User Services
export const userService = {
  // User facing endpoints
  getUserByUsername: (username) => api.get(`/user/?username=${username}`),
  updateUserProfile: (userData) => api.put('/user/update', userData),
  changePassword: (passwordData) => api.put('/user/password', passwordData),
  
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

// File Upload Services
export const fileService = {
  // Upload avatar - Sử dụng API mới để lưu vào database dưới dạng Base64
  uploadAvatar: (file) => {
    // Kiểm tra file
    if (!file) {
      console.error('No file provided to uploadAvatar');
      return Promise.reject(new Error('No file provided'));
    }
    
    console.log('Uploading avatar file:', file.name, file.type, file.size);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Debug log formData
    console.log('FormData created with file:', file.name);
    
    // Vẫn giữ url cũ để tương thích, nhưng bên backend sẽ chuyển hướng sang API mới
    return api.post('/files/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log('Avatar upload success:', response);
      return response;
    }).catch(error => {
      console.error('Avatar upload error:', error);
      throw error;
    });
  },
  
  // Upload product images with optimized handling and longer timeout - USING CLOUDINARY
  uploadProductImages: (files) => {
    const formData = new FormData();
    // Support both single file and array of files
    if (Array.isArray(files)) {
      files.forEach(file => formData.append('files', file));
    } else {
      formData.append('files', files);
    }
    
    // Use longer timeout for image uploads (90 seconds)
    return api.post('/cloudinary/product-images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 90000,
      onUploadProgress: progressEvent => {
        console.log(`Upload progress: ${Math.round((progressEvent.loaded * 100) / progressEvent.total)}%`);
      }
    }).catch(error => {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout: Image upload took too long. Try uploading smaller or fewer images.');
      }
      throw error;
    });
  },
  
  // Get all product images (for admin) with retry mechanism
  getAllProductImages: () => imageApi.get('/product-images/all'),
  
  // Get images for a specific product with retry mechanism and cache busting
  getProductImages: (productId) => {
    if (!productId) return Promise.resolve({ data: [] });
    // Add cache busting parameter to avoid ERR_CONTENT_LENGTH_MISMATCH errors
    const url = getImageUrlWithCacheBuster(`/product/${productId}/images`);
    return imageApi.get(url);
  },
    // Set main image for product (expects imageId as first in the array)
    setMainProductImage: (productId, imageIds) => {
      // Only proceed if we have product ID and image IDs
      if (!productId || !imageIds || imageIds.length === 0) {
        return Promise.resolve({ success: false, message: "Missing required data" });
      }
      
      // First get the current product data to maintain all fields
      return productService.getProduct(productId)
        .then(response => {
          const product = response.data;
          if (!product) {
            throw new Error("Product not found");
          }
          
          // Now update with the new image IDs but keeping all other product data
          return imageApi.put(`/product/update/${productId}`, {
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            categoryId: product.category?.id || 1,
            imageIds: imageIds
          });
        })
        .catch(error => {
          console.error("Error in setMainProductImage:", error);
          return Promise.reject(error);
        });
    },
  
  // Delete product image - support both legacy and Cloudinary APIs
  deleteProductImage: (id) => {
    // Try Cloudinary endpoint first, fall back to legacy if needed
    return api.delete(`/cloudinary/${id}`).catch(error => {
      console.log('Cloudinary delete failed, trying legacy endpoint:', error);
      return api.delete(`/product-images/delete/${id}`);
    });
  },
  
  // Legacy method for backward compatibility
  uploadProductImage: (file) => {
    const formData = new FormData();
    formData.append('files', file);
    
    // Use Cloudinary endpoint
    return api.post('/cloudinary/product-images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Get Cloudinary image by ID
  getCloudinaryImage: (id) => api.get(`/cloudinary/${id}`),
  
  // Lấy URL avatar từ id người dùng
  getAvatarUrl: (userId) => {
    if (!userId) return null;
    return `${API_URL}/avatar/${userId}`;
  }
};

// Dashboard Services (Admin)
export const dashboardService = {
  getStats: () => api.get("/dashboard/stats"),
  getRecentOrders: (limit = 5) => api.get(`/dashboard/recent-orders?limit=${limit}`),
  getTopProducts: (limit = 5) => api.get(`/dashboard/top-products?limit=${limit}`),
  getSalesChartData: (days = 7) => api.get(`/dashboard/sales-chart?days=${days}`),
  getCategoryBreakdown: () => api.get("/dashboard/category-breakdown")
};

// Analytics Services (Admin)
export const analyticsService = {
  // Basic analytics
  getSalesTrends: (timeframe = "daily", timespan = 30) => 
    api.get(`/analytics/sales-trends?timeframe=${timeframe}&timespan=${timespan}`),
  getUserGrowth: (days = 30) => api.get(`/analytics/user-growth?days=${days}`),
  getCustomerRetention: () => api.get("/analytics/customer-retention"),
  getProductPerformance: () => api.get("/analytics/product-performance"),
  getOrderStatusDistribution: () => api.get("/analytics/order-status-distribution"),
  // Advanced analytics
  getSalesByHour: () => api.get("/analytics/sales-by-hour"),
  getCustomerInsights: () => api.get("/analytics/customer-insights"),
  getSalesByDateRange: (startDate, endDate) => 
    api.get(`/analytics/sales-by-date-range${startDate ? `?startDateStr=${startDate}${endDate ? `&endDateStr=${endDate}` : ""}` : ""}`),
  getOrderProcessingTime: () => api.get("/analytics/order-processing-time"),
  
  // Export functionality
  exportSalesReport: (days = 30, format = "csv") => 
    api.get(`/analytics/export-report?days=${days}&format=${format}`, { responseType: format === "csv" ? "blob" : "json" })
};

// Advanced Analytics Services (Admin)
export const advancedAnalyticsService = {
  // Customer Analysis
  getRfmAnalysis: () => api.get("/advanced-analytics/rfm-analysis"),
  getBasketAnalysis: (limit = 20) => api.get(`/advanced-analytics/basket-analysis?limit=${limit}`),
  getFunnelAnalysis: () => api.get("/advanced-analytics/funnel-analysis"),
  getUserCohortAnalysis: () => api.get("/advanced-analytics/user-cohort-analysis"),
  getUserCohortData: () => api.get("/advanced-analytics/user-cohort-analysis"), // Alias for backward compatibility
  getCustomerLifetimeValue: () => api.get("/advanced-analytics/customer-lifetime-value"),
  getCustomerInsights: () => api.get("/advanced-analytics/customer-insights"),
  // Trend Analysis
  getSeasonalTrends: (timeframe, year) => api.get(`/advanced-analytics/seasonal-trends?timeframe=${timeframe || "monthly"}&year=${year || new Date().getFullYear()}`),
  getSalesTrends: () => api.get("/advanced-analytics/sales-trends"),
  getCategoryPerformance: (startDate, endDate) => 
    api.get(`/advanced-analytics/category-performance${startDate ? `?startDateStr=${startDate}${endDate ? `&endDateStr=${endDate}` : ""}` : ""}`),
  getDayHourHeatmap: (metric = "orders") => api.get(`/advanced-analytics/day-hour-heatmap?metric=${metric}`),
  getOrderCompletionRate: (days = 30) => api.get(`/advanced-analytics/order-completion-rate?days=${days}`),
  getOrderCompletionRates: (days = 30) => api.get(`/advanced-analytics/order-completion-rate?days=${days}`), // Alias for backward compatibility
  getSalesByHour: () => api.get("/advanced-analytics/sales-by-hour"),
  getOrderProcessingTime: () => api.get("/advanced-analytics/order-processing-time"),
  getSalesByDateRange: (startDate, endDate) => api.get(`/advanced-analytics/sales-by-date?startDate=${startDate || ""}&endDate=${endDate || ""}`)
};

export default api;