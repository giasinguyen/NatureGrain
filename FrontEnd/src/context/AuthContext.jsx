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
        const user = authService.getCurrentUser();
        setCurrentUser(user);
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
      localStorage.setItem('token', response.data.token);
      
      // Cập nhật thông tin người dùng hiện tại
      setCurrentUser(authService.getCurrentUser());
      toast.success('Đăng nhập thành công!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    toast.info('Đã đăng xuất');
  };

  const hasRole = (role) => {
    if (!currentUser || !currentUser.roles) return false;
    return currentUser.roles.includes(role);
  };

  const isAdmin = () => {
    return hasRole('ROLE_ADMIN');
  };

  const isModerator = () => {
    return hasRole('ROLE_MODERATOR');
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isModerator,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;