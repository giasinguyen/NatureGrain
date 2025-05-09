import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Hàm kiểm tra trạng thái đăng nhập
  const checkAuth = async (skipCache = false) => {
    try {
      setLoading(true);
      
      // Nếu không bỏ qua cache và có thông tin người dùng trong sessionStorage
      if (!skipCache) {
        const cachedUserInfo = sessionStorage.getItem('userInfo');
        if (cachedUserInfo) {
          const userInfo = JSON.parse(cachedUserInfo);
          // Sử dụng cache trước để tránh màn hình trắng
          setCurrentUser(userInfo);
        }
      }
      
      // Luôn xác thực với server để đảm bảo thông tin người dùng là mới nhất
      const user = await authService.getCurrentUser();
      
      if (user) {
        const userInfo = {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles
        };
        
        // Cập nhật cache trong sessionStorage
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        setCurrentUser(userInfo);
      } else {
        // Nếu không có thông tin người dùng từ server, xóa cache
        handleClearAuth();
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      // Chỉ xóa thông tin đăng nhập nếu lỗi 401 Unauthorized
      if (error.response && error.response.status === 401) {
        handleClearAuth();
      }
      // Giữ nguyên thông tin đăng nhập từ cache đối với các lỗi khác 
      // (ví dụ: mất kết nối internet tạm thời)
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  // Kiểm tra xác thực khi component được mount
  useEffect(() => {
    checkAuth();
    
    // Thêm một listener để kiểm tra lại trạng thái đăng nhập sau khi tab trở nên active
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth(true); // Bỏ qua cache khi tab trở lại
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Helper function to clear all auth data
  const handleClearAuth = () => {
    sessionStorage.removeItem('userInfo');
    setCurrentUser(null);
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await authService.login(username, password);
      
      // The backend returns user info directly in the response with JWT in cookies
      if (response && response.data) {
        const userInfo = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          roles: response.data.roles
        };
        
        // Lưu thông tin trong sessionStorage
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        setCurrentUser(userInfo);
        
        toast.success('Đăng nhập thành công!');
        return true;
      } else {
        toast.error('Đăng nhập thất bại! Vui lòng kiểm tra thông tin đăng nhập.');
        return false;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại!';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      // Add role array with default user role
      const requestData = {
        ...userData,
        role: ["user"]
      };
      
      const response = await authService.register(requestData);
      
      if (response && response.status === 200) {
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        return true;
      } else {
        toast.error(response.data?.message || 'Đăng ký thất bại!');
        return false;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại!';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Call logout API to clear cookie on server
    authService.logout().then(() => {
      handleClearAuth();
      toast.info('Đã đăng xuất thành công');
    }).catch(error => {
      console.error('Logout failed:', error);
      // Still clear local state even if API call fails
      handleClearAuth();
    });
  };
  
  // Hàm thử lại xác thực - hữu ích khi gặp lỗi 401
  const retryAuth = async () => {
    return checkAuth(true); // Bỏ qua cache khi thử lại xác thực
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    retryAuth,
    isAuthenticated: !!currentUser,
    authChecked // Biến này giúp các component biết rằng đã hoàn tất kiểm tra xác thực
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;