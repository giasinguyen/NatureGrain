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
        // Check stored user info from sessionStorage first for quick UI display
        const storedUserInfo = sessionStorage.getItem('userInfo');
        
        if (storedUserInfo) {
          // Parse stored user info
          const userInfo = JSON.parse(storedUserInfo);
          
          // Set complete user info from sessionStorage for immediate UI display
          setCurrentUser(userInfo);
          
          // Then fetch complete user details from server to validate session
          try {
            const user = await authService.getCurrentUser();
            if (user) {
              // Update with the latest data from server
              const updatedUserInfo = {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles
              };
              
              // Update localStorage and sessionStorage
              localStorage.setItem('userId', user.id);
              localStorage.setItem('username', user.username);
              sessionStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
              
              // Update state with the latest data
              setCurrentUser(updatedUserInfo);
            } else {
              // Invalid session - clear storage
              handleClearAuth();
            }
          } catch (serverError) {
            // If server validation fails, still keep user logged in with stored data
            console.warn('Server validation failed, using stored credentials:', serverError);
            // We don't logout the user here, we keep using the stored info instead
          }
        } else {
          // Check for userId/username as fallback (backward compatibility)
          const userId = localStorage.getItem('userId');
          const username = localStorage.getItem('username');
          
          if (userId && username) {
            // Set minimal user info first for better UX
            setCurrentUser({
              id: userId,
              username: username,
              loading: true // indicate we're still loading full details
            });
            
            // Then fetch complete user details from server using the cookie
            try {
              const user = await authService.getCurrentUser();
              if (user) {
                const updatedUserInfo = {
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  roles: user.roles
                };
                
                // Update sessionStorage for better persistence
                sessionStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                setCurrentUser(updatedUserInfo);
              } else {
                // Invalid session - clear storage
                handleClearAuth();
              }
            } catch (error) {
              // Clear auth if server validation completely fails
              console.error('Authentication check failed:', error);
              handleClearAuth();
            }
          } else {
            // No stored authentication
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error('Authentication check process failed:', error);
        handleClearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Helper function to clear all auth data
  const handleClearAuth = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    sessionStorage.removeItem('userInfo');
    setCurrentUser(null);
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await authService.login(username, password);
      
      // The backend returns user info directly in the response with JWT in cookies
      if (response && response.data) {
        // Store user ID in localStorage for persistence
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('username', response.data.username);
        
        // Store complete user info for better persistence
        const userInfo = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          roles: response.data.roles
        };
        
        // Store complete user data in sessionStorage
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // Set the current user with the response data
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