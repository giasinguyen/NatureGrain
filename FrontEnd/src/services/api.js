import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8080/api';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important: Allows cookies to be sent and received
});

// Biến để theo dõi có đang redirect hay không
let isRedirecting = false;

// Interceptor response để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
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
        // Solução alternativa em caso de falha: buscar blogs normais e filtrar
        return api.get('/blog')
          .then(response => {
            const blogs = response.data || [];
            // Ordenar por ID (presumindo que IDs mais altos são mais recentes)
            const sortedBlogs = [...blogs].sort((a, b) => b.id - a.id);
            // Pegar apenas os 3 primeiros
            return { data: sortedBlogs.slice(0, 3) };
          })
          .catch(secondError => {
            console.error('Backup fetch for blogs also failed:', secondError);
            return { data: [] }; // Retornar array vazio như último recurso
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