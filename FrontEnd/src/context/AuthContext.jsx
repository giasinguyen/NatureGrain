import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const checkAuth = async () => {
      try {
        // Fetch complete user details from server using the JWT cookie
        const user = await authService.getCurrentUser();
        if (user) {
          const userInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles
          };
          
          // Chỉ lưu thông tin cơ bản trong sessionStorage để tiện sử dụng
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
          setCurrentUser(userInfo);
        } else {
          // Invalid session - clear storage
          handleClearAuth();
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        handleClearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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
        
        // Chỉ lưu thông tin trong sessionStorage cho tiện sử dụng
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

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;