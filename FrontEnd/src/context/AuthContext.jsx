import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa (từ token)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const user = await authService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
          } else {
            // Invalid token - clear it
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await authService.login(username, password);
      
      // The backend returns user info directly in the response with JWT in cookies
      if (response && response.data) {
        // Store user ID in localStorage for persistence
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('username', response.data.username);
        
        // Set the current user with the response data
        setCurrentUser({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          roles: response.data.roles
        });
        
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
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      setCurrentUser(null);
      toast.info('Đã đăng xuất thành công');
    }).catch(error => {
      console.error('Logout failed:', error);
      // Still clear local state even if API call fails
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      setCurrentUser(null);
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