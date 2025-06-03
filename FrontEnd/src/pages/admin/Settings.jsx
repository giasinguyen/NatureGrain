import { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  PhotoIcon,
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  UserIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { fileService } from '../../services/api';

const Settings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    avatar: ''
  });

  // Password settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // System settings (mock data - replace with actual settings API)
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'NatureGrain',
    siteDescription: 'Cửa hàng thực phẩm organic tự nhiên',
    contactEmail: 'contact@naturegrain.com',
    contactPhone: '+84 123 456 789',
    address: 'Hà Nội, Việt Nam',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    maintenance: false,
    emailNotifications: true,
    orderNotifications: true,
    newUserNotifications: true
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        username: currentUser.username || '',
        firstname: currentUser.firstname || '',
        lastname: currentUser.lastname || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        country: currentUser.country || '',
        state: currentUser.state || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // await userService.updateProfile(profileData);
      
      // Mock update success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // await userService.changePassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // });
      
      // Mock update success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Đổi mật khẩu thành công');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      setAvatarUploading(true);
      
      // Upload avatar
      const response = await fileService.uploadAvatar(file);
      const avatarUrl = response.data.avatarUrl || response.data.url;
      
      // Update profile data
      setProfileData(prev => ({ ...prev, avatar: avatarUrl }));
      
      toast.success('Tải lên avatar thành công');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Không thể tải lên avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSystemSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // await settingsService.updateSystemSettings(systemSettings);
      
      // Mock update success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Cập nhật cài đặt hệ thống thành công');
    } catch (error) {
      console.error('Error updating system settings:', error);
      toast.error('Không thể cập nhật cài đặt hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Thông tin cá nhân', icon: UserCircleIcon },
    { id: 'password', name: 'Đổi mật khẩu', icon: KeyIcon },
    { id: 'system', name: 'Cài đặt hệ thống', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Thông báo', icon: BellIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý thông tin cá nhân và cài đặt hệ thống
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        {/* Sidebar */}
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full group rounded-md px-3 py-2 flex items-center text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-700 hover:text-green-700 hover:bg-green-50'
                      : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon
                    className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 ${
                      activeTab === tab.id
                        ? 'text-green-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  <span className="truncate">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Thông tin cá nhân
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Cập nhật thông tin tài khoản và avatar của bạn.
                    </p>
                  </div>

                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Avatar
                    </label>
                    <div className="mt-1 flex items-center space-x-5">
                      <div className="flex-shrink-0">
                        {profileData.avatar ? (
                          <img
                            className="h-20 w-20 rounded-full object-cover"
                            src={profileData.avatar}
                            alt="Avatar"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserCircleIcon className="h-12 w-12 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          {avatarUploading ? (
                            <div className="flex items-center">
                              <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                              Đang tải lên...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <PhotoIcon className="w-4 h-4 mr-2" />
                              Thay đổi avatar
                            </div>
                          )}
                        </label>
                        <input
                          id="avatar-upload"
                          name="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleAvatarUpload}
                          disabled={avatarUploading}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, GIF tối đa 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        disabled
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                        Họ
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={profileData.firstname}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstname: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                        Tên
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={profileData.lastname}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastname: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Quốc gia
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={profileData.country}
                        onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="">Chọn quốc gia</option>
                        <option value="VN">Việt Nam</option>
                        <option value="US">Hoa Kỳ</option>
                        <option value="JP">Nhật Bản</option>
                        <option value="KR">Hàn Quốc</option>
                      </select>
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </div>
                    ) : (
                      'Lưu thay đổi'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Đổi mật khẩu
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Cập nhật mật khẩu để bảo vệ tài khoản của bạn.
                    </p>
                  </div>

                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6">
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Mật khẩu hiện tại
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="current-password"
                          id="current-password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        >
                          {showPasswords.current ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        Mật khẩu mới
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="new-password"
                          id="new-password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        >
                          {showPasswords.new ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Xác nhận mật khẩu mới
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirm-password"
                          id="confirm-password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPasswords.confirm ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ShieldCheckIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Lưu ý bảo mật
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Mật khẩu phải có ít nhất 6 ký tự</li>
                            <li>Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                            <li>Không sử dụng thông tin cá nhân dễ đoán</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                        Đang đổi...
                      </div>
                    ) : (
                      'Đổi mật khẩu'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <form onSubmit={handleSystemSettingsSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cài đặt hệ thống
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Cấu hình thông tin website và hệ thống.
                    </p>
                  </div>

                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                        Tên website
                      </label>
                      <input
                        type="text"
                        name="siteName"
                        id="siteName"
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                        Email liên hệ
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        id="contactEmail"
                        value={systemSettings.contactEmail}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                        Mô tả website
                      </label>
                      <textarea
                        name="siteDescription"
                        id="siteDescription"
                        rows={3}
                        value={systemSettings.siteDescription}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                        Số điện thoại liên hệ
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        id="contactPhone"
                        value={systemSettings.contactPhone}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                        Đơn vị tiền tệ
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={systemSettings.currency}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, currency: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="VND">VND (Việt Nam Đồng)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Địa chỉ công ty
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={systemSettings.address}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, address: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6">
                      <div className="flex items-center">
                        <input
                          id="maintenance"
                          name="maintenance"
                          type="checkbox"
                          checked={systemSettings.maintenance}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenance: e.target.checked }))}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="maintenance" className="ml-2 block text-sm text-gray-900">
                          Chế độ bảo trì
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">Kích hoạt để tạm ngưng hoạt động của website.</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </div>
                    ) : (
                      'Lưu cài đặt'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSystemSettingsSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cài đặt thông báo
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Cấu hình các loại thông báo mà bạn muốn nhận.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Thông báo qua email</div>
                          <div className="text-sm text-gray-500">Nhận thông báo về các hoạt động quan trọng qua email</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemSettings.emailNotifications}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ShoppingCartIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Thông báo đơn hàng mới</div>
                          <div className="text-sm text-gray-500">Được thông báo khi có đơn hàng mới</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemSettings.orderNotifications}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, orderNotifications: e.target.checked }))}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Thông báo người dùng mới</div>
                          <div className="text-sm text-gray-500">Được thông báo khi có người dùng mới đăng ký</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemSettings.newUserNotifications}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, newUserNotifications: e.target.checked }))}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </div>
                    ) : (
                      'Lưu cài đặt'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
