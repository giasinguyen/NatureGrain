import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, ShieldCheckIcon, 
  CalendarIcon, CreditCardIcon, HeartIcon, KeyIcon, ShoppingCartIcon 
} from '@heroicons/react/24/outline';
import { userService, fileService } from '../../services/api';
import AvatarUpload from '../../components/ui/AvatarUpload';

const ProfilePage = () => {
  const { currentUser, isAuthenticated, retryAuth } = useAuth();  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    avatar: null
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Load user profile data
  useEffect(() => {
    const fetchFullUserData = async () => {
      if (currentUser) {
        try {
          // Set the data we already have from currentUser
          setProfileData({
            username: currentUser.username || '',
            email: currentUser.email || '',
            firstname: currentUser.firstname || '',
            lastname: currentUser.lastname || '',
            phone: currentUser.phone || '',
            address: currentUser.address || '',
            country: currentUser.country || '',
            state: currentUser.state || '',
            avatar: currentUser.avatar || null
          });
          
          // Fetch additional profile data from server
          const response = await userService.getUserByUsername(currentUser.username);
          if (response && response.data) {
            const userData = response.data;
            setProfileData(prevData => ({
              ...prevData,
              firstname: userData.firstname || prevData.firstname,
              lastname: userData.lastname || prevData.lastname,
              phone: userData.phone || prevData.phone,
              address: userData.address || prevData.address,
              country: userData.country || prevData.country,
              state: userData.state || prevData.state,
              avatar: userData.avatar || prevData.avatar
            }));
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
          toast.error('Không thể tải thông tin người dùng');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchFullUserData();
  }, [currentUser]);

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Nếu có avatar mới, upload trước
      if (avatarFile) {
        try {
          console.log("Uploading avatar file:", avatarFile.name, avatarFile.size);
          const uploadResponse = await fileService.uploadAvatar(avatarFile);
          
          if (uploadResponse && uploadResponse.data) {
            console.log("Avatar upload response:", uploadResponse.data);
            
            // Xử lý cả hai trường hợp: Base64 data URL hoặc đường dẫn thông thường
            if (uploadResponse.data.message) {
              if (uploadResponse.data.message.includes(':')) {
                // Trường hợp cũ: "Avatar cập nhật thành công: /api/avatar/123"
                profileData.avatar = uploadResponse.data.message.split(': ')[1];
              } else if (uploadResponse.data.message.startsWith('data:')) {
                // Trường hợp Data URL trực tiếp trong response
                profileData.avatar = uploadResponse.data.message;
              } else {
                // Chỉ là thông báo thành công, avatar đã được cập nhật trong DB
                console.log('Avatar updated successfully in DB');
              }
            }
          }
        } catch (uploadError) {
          console.error('Failed to upload avatar:', uploadError);
          toast.error('Không thể tải lên avatar');
          // Tiếp tục cập nhật thông tin khác ngay cả khi avatar thất bại
        }
      }
      
      // Cập nhật thông tin người dùng
      const updateResponse = await userService.updateUserProfile(profileData);
      
      if (updateResponse && updateResponse.data) {
        toast.success('Thông tin đã được cập nhật thành công!');
        setIsEditing(false);
        
        // Cập nhật thông tin người dùng trong context
        // Yêu cầu Auth context refresh thông tin người dùng
        if (typeof retryAuth === 'function') {
          retryAuth(true);
        }
      }
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
              {/* Sidebar with user info */}              <div className="md:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-col items-center">
                    {isEditing ? (
                      <AvatarUpload 
                        currentAvatar={profileData.avatar} 
                        onAvatarChange={handleAvatarChange}
                      />
                    ) : (
                      <AvatarUpload 
                        currentAvatar={profileData.avatar} 
                        onAvatarChange={() => {}} 
                        previewOnly={true}
                      />
                    )}
                    
                    <h2 className="text-xl font-semibold mt-4">
                      {profileData.firstname ? `${profileData.firstname} ${profileData.lastname}` : 'Chưa cập nhật tên'}
                    </h2>
                    <p className="text-gray-600 mt-1">{profileData.username}</p>
                    
                    <div className="mt-2 flex items-center">
                      <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        {currentUser?.roles?.includes('ROLE_ADMIN') ? 'Quản trị viên' : 'Thành viên'}
                      </span>
                    </div>
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
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">Thành viên từ {new Date().getFullYear()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Liên kết nhanh</h3>
                    <div className="space-y-2">
                      <Link to="/user/orders" className="flex items-center text-green-600 hover:text-green-800">
                        <CreditCardIcon className="h-5 w-5 mr-2" />
                        <span>Đơn hàng của bạn</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content - Profile details */}
              <div className="md:col-span-2">
                {isEditing ? (                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                          Tên
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          id="firstname"
                          value={profileData.firstname || ''}
                          onChange={handleChange}
                          className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                          value={profileData.lastname || ''}
                          onChange={handleChange}
                          className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                        value={profileData.email || ''}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                        value={profileData.phone || ''}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 pt-4">Địa chỉ giao hàng</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Quốc gia
                        </label>
                        <select
                          name="country"
                          id="country"
                          value={profileData.country || ''}
                          onChange={handleChange}
                          className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Chọn quốc gia</option>
                          <option value="Vietnam">Việt Nam</option>
                          <option value="Other">Khác</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          Tỉnh/Thành phố
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={profileData.state || ''}
                          onChange={handleChange}
                          className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ chi tiết
                      </label>
                      <textarea
                        name="address"
                        id="address"
                        rows={3}
                        value={profileData.address || ''}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md mr-2 hover:bg-gray-50 transition duration-300"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                      >
                        Lưu thông tin
                      </button>
                    </div>
                  </form>
                ) : (                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Thông tin cá nhân</h3>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tên đăng nhập</p>
                            <p className="mt-1 text-gray-800">{profileData.username}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="mt-1 text-gray-800">{profileData.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tên</p>
                            <p className="mt-1 text-gray-800">{profileData.firstname || '(Chưa cập nhật)'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Họ</p>
                            <p className="mt-1 text-gray-800">{profileData.lastname || '(Chưa cập nhật)'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                            <p className="mt-1 text-gray-800">{profileData.phone || '(Chưa cập nhật)'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Địa chỉ giao hàng</h3>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Quốc gia</p>
                            <p className="mt-1 text-gray-800">{profileData.country || '(Chưa cập nhật)'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tỉnh/Thành phố</p>
                            <p className="mt-1 text-gray-800">{profileData.state || '(Chưa cập nhật)'}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Địa chỉ chi tiết</p>
                            <p className="mt-1 text-gray-800">{profileData.address || '(Chưa cập nhật địa chỉ)'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          onClick={handleEditToggle}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Chỉnh sửa thông tin
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
          {/* Các liên kết hữu ích */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quản lý tài khoản</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/user/orders"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="rounded-full bg-green-100 p-3 mr-3">
                  <ShoppingCartIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Đơn hàng của tôi</h3>
                  <p className="text-sm text-gray-500">Xem lịch sử và tình trạng đơn hàng</p>
                </div>
              </Link>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toast.info('Tính năng đang được phát triển')}>
                <div className="rounded-full bg-blue-100 p-3 mr-3">
                  <HeartIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Danh sách yêu thích</h3>
                  <p className="text-sm text-gray-500">Xem các sản phẩm đã lưu</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toast.info('Tính năng đang được phát triển')}>
                <div className="rounded-full bg-purple-100 p-3 mr-3">
                  <KeyIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Đổi mật khẩu</h3>
                  <p className="text-sm text-gray-500">Cập nhật mật khẩu đăng nhập</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;