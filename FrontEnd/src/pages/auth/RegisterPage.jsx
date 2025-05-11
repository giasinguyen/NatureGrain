import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear general registration error when user changes input
    if (registrationError) {
      setRegistrationError('');
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
    }
    
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'Vui lòng nhập tên';
    }
    
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Vui lòng nhập họ';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản dịch vụ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setRegistrationError('');
      
      try {
        // Format data for API
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstname: formData.firstname,
          lastname: formData.lastname
        };
        
        await register(userData);
        
        // Navigate to login page after successful registration
        navigate('/login', { 
          state: { 
            registrationSuccess: true,
            username: formData.username 
          } 
        });
      } catch (error) {
        // Handle registration failure
        setRegistrationError(
          error.response?.data?.message || 
          'Đăng ký thất bại. Vui lòng thử lại sau.'
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img 
                  src="/Naturegrain.png" 
                  alt="NatureGrain Logo" 
                  className="h-20 w-auto" 
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h1>
              <p className="text-gray-600 mt-2">
                Tạo tài khoản để mua sắm dễ dàng hơn và nhận nhiều ưu đãi
              </p>
            </div>
            
            {/* Registration error message */}
            {registrationError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md mb-6">
                {registrationError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username and Email */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label 
                    htmlFor="username" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên đăng nhập *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                      placeholder="Nhập tên đăng nhập"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
                
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                      placeholder="Nhập email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
              
              {/* Password fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mật khẩu *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label 
                    htmlFor="confirmPassword" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Xác nhận mật khẩu *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                      placeholder="Nhập lại mật khẩu"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
              
              {/* Personal Info */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label 
                    htmlFor="firstname" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên *
                  </label>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={formData.firstname}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${
                      errors.firstname ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập tên"
                  />
                  {errors.firstname && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
                  )}
                </div>
                
                <div>
                  <label 
                    htmlFor="lastname" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ *
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={formData.lastname}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${
                      errors.lastname ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập họ"
                  />
                  {errors.lastname && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
                  )}
                </div>
              </div>
              
              {/* Terms and conditions */}
              <div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                      Tôi đồng ý với{' '}
                      <Link to="/terms" className="text-green-600 hover:text-green-500">
                        Điều khoản dịch vụ
                      </Link>{' '}
                      và{' '}
                      <Link to="/privacy" className="text-green-600 hover:text-green-500">
                        Chính sách bảo mật
                      </Link>
                    </label>
                  </div>
                </div>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
                )}
              </div>
              
              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
              </div>
            </form>
            
            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;