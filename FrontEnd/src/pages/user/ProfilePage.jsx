import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    if (currentUser) {
      // Set the data we already have from currentUser
      setProfileData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        firstname: currentUser.firstname || '',
        lastname: currentUser.lastname || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
      
      // In a real application, you might want to fetch additional profile data
      // that wasn't included in the initial authentication
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would call your API to update the user profile
      // await userService.updateProfile(profileData);
      
      toast.success('Thông tin đã được cập nhật thành công!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      console.error('Failed to update profile:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Bạn chưa đăng nhập</h2>
          <p className="text-center text-gray-600 mb-6">
            Vui lòng đăng nhập để xem thông tin cá nhân của bạn.
          </p>
          <div className="flex justify-center">
            <Link
              to="/login"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Thông tin tài khoản</h1>
              <button
                onClick={handleEditToggle}
                className={`mt-4 md:mt-0 px-4 py-2 rounded-md text-sm font-medium ${
                  isEditing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } transition duration-300`}
              >
                {isEditing ? 'Hủy' : 'Chỉnh sửa thông tin'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sidebar with user info */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                      <UserIcon className="h-12 w-12 text-gray-600" />
                    </div>
                    <h2 className="text-xl font-semibold">{profileData.firstname} {profileData.lastname}</h2>
                    <p className="text-gray-600 mt-1">{profileData.username}</p>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">{profileData.email}</span>
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">{profileData.phone}</span>
                      </div>
                    )}
                    {profileData.address && (
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">{profileData.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main content - Profile details */}
              <div className="md:col-span-2">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                          Tên
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          id="firstname"
                          value={profileData.firstname}
                          onChange={handleChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                          Họ
                        </label>
                        <input
                          type="text"
                          name="lastname"
                          id="lastname"
                          value={profileData.lastname}
                          onChange={handleChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      <textarea
                        name="address"
                        id="address"
                        rows={3}
                        value={profileData.address}
                        onChange={handleChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                      >
                        Lưu thông tin
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h3>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tên đăng nhập</p>
                            <p className="mt-1">{profileData.username}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="mt-1">{profileData.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tên</p>
                            <p className="mt-1">{profileData.firstname || '(Chưa cập nhật)'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Họ</p>
                            <p className="mt-1">{profileData.lastname || '(Chưa cập nhật)'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                            <p className="mt-1">{profileData.phone || '(Chưa cập nhật)'}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Địa chỉ giao hàng</h3>
                        <p className="mt-2">{profileData.address || '(Chưa cập nhật địa chỉ)'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Order history link */}
        <div className="mt-6">
          <Link
            to="/user/orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Xem lịch sử đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;