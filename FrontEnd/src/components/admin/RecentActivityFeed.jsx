import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  UserIcon,
  DocumentTextIcon,
  PencilIcon,
  ChatBubbleLeftIcon,
  ExclamationCircleIcon,
  BellIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Import the advanced analytics service for real data
import { AdvancedAnalyticsService } from '../../services/advancedAnalytics';

const RecentActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map backend activity types to frontend types
  const mapActivityType = (backendType) => {
    const typeMap = {
      'ORDER_CREATED': 'order',
      'ORDER_COMPLETED': 'order',
      'ORDER_CANCELLED': 'order',
      'ORDER': 'order',
      'USER_REGISTERED': 'user',
      'USER_UPDATED': 'user',
      'USER': 'user',
      'PRODUCT_CREATED': 'product',
      'PRODUCT_UPDATED': 'product', 
      'PRODUCT_DELETED': 'product',
      'PRODUCT': 'product',
      'BLOG_CREATED': 'blog',
      'BLOG_UPDATED': 'blog',
      'BLOG': 'blog',
      'COMMENT_CREATED': 'comment',
      'COMMENT': 'comment',
      'SYSTEM_ALERT': 'alert',
      'SYSTEM_MAINTENANCE': 'system'
    };
    return typeMap[backendType] || 'system';
  };
  useEffect(() => {
    const fetchActivities = async () => {      try {
        setLoading(true);
        // Initialize the advanced analytics service to get real data
        const analyticsService = new AdvancedAnalyticsService();
        const response = await analyticsService.getActivityFeed(10);
        
        // Handle response structure from backend API
        let activityData = [];
        if (response && response.data && Array.isArray(response.data)) {
          // Backend response format: { data: [...], total: number, success: boolean }
          activityData = response.data;
        } else if (Array.isArray(response)) {
          // Direct array response
          activityData = response;
        }
        
        // Map backend data format to frontend format
        const mappedActivities = activityData.map(item => ({
          id: item.id,
          type: mapActivityType(item.activityType || item.entityType), // Map backend type to frontend type
          title: item.title,
          message: item.description,
          timestamp: new Date(item.createdAt),
          user: item.userName,
          metadata: item.metadata
        }));
        
        setActivities(mappedActivities);
        console.log("Activity feed response:", response);
        console.log("Mapped activities:", mappedActivities);
      } catch (err) {
        console.error("Error fetching activity feed:", err);
        setError(err.message);
        
        // Fallback to static mock data if the API call fails
        setActivities([
          { 
            id: 1,
            type: 'order', 
            title: 'Đơn hàng mới',
            message: 'Đơn hàng mới #1234 đã được tạo', 
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            metadata: { orderId: 'DH001234', amount: 450000 },
            user: 'Khách hàng' 
          },
          { 
            id: 2,
            type: 'user', 
            title: 'Người dùng mới',
            message: 'Người dùng mới đăng ký', 
            timestamp: new Date(Date.now() - 25 * 60 * 1000),
            user: 'Nguyễn Văn A' 
          },
          { 
            id: 3,
            type: 'product', 
            title: 'Cập nhật sản phẩm',
            message: 'Sản phẩm "Gạo lứt hữu cơ" được cập nhật', 
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            user: 'Admin' 
          },
          { 
            id: 4,
            type: 'blog', 
            title: 'Bài viết mới',
            message: 'Bài viết mới được đăng', 
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            user: 'Moderator' 
          },
          { 
            id: 5,
            type: 'comment', 
            title: 'Bình luận mới',
            message: 'Bình luận mới trên sản phẩm "Sữa hạt"', 
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            user: 'Trần Thị B' 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    
    // Set up polling interval to refresh activities every 2 minutes
    const interval = setInterval(fetchActivities, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Helper to return the appropriate icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <ShoppingBagIcon className="h-4 w-4 text-blue-600" />
          </div>
        );
      case 'user':
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-green-600" />
          </div>
        );
      case 'product':
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <ShoppingBagIcon className="h-4 w-4 text-purple-600" />
          </div>
        );
      case 'blog':
        return (
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <DocumentTextIcon className="h-4 w-4 text-yellow-600" />
          </div>
        );
      case 'comment':
        return (
          <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
            <ChatBubbleLeftIcon className="h-4 w-4 text-pink-600" />
          </div>
        );
      case 'alert':
        return (
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <ExclamationCircleIcon className="h-4 w-4 text-red-600" />
          </div>
        );
      case 'system':
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <BellIcon className="h-4 w-4 text-gray-600" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <BellIcon className="h-4 w-4 text-gray-600" />
          </div>
        );
    }
  };

  // Format the timestamp to a readable format (e.g., "5 minutes ago")
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    // If older than 7 days, show the actual date
    return date.toLocaleDateString('vi-VN');
  };

  // Display loading state
  if (loading && activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h3>
        </div>
        <div className="flex items-center justify-center p-8">
          <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }
  // We'll display an error notification at the top if there was an error fetching data

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">      <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h3>        <Link 
          to="/admin/activities" 
          className="text-sm text-green-600 hover:text-green-800"
        >
          Xem tất cả
        </Link>
      </div>
      
      {error && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-100">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">
              Không thể tải dữ liệu hoạt động từ API. Đang hiển thị dữ liệu tĩnh.
            </p>
          </div>
        </div>
      )}
      
      <ul className="divide-y divide-gray-200">
        {activities.length > 0 ? (
          activities.map((item, index) => (
            <li key={item.id || index} className="px-4 py-3 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                {getActivityIcon(item.type)}
                <div className="flex-1 min-w-0">
                  {item.title && (
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  )}
                  <p className="text-sm text-gray-500 truncate">
                    {item.message}
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{formatTimestamp(item.timestamp)}</span>
                </div>
              </div>
              {item.metadata && item.type === 'order' && (
                <div className="mt-1 ml-12 text-xs text-gray-500">
                  {item.metadata.orderId && <span className="mr-2">Mã đơn: {item.metadata.orderId}</span>}
                  {item.metadata.amount && (
                    <span>
                      Giá trị: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.metadata.amount)}
                    </span>
                  )}
                </div>
              )}
            </li>
          ))
        ) : (
          <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
            Không có hoạt động nào gần đây
          </li>
        )}
      </ul>
    </div>
  );
};

export default RecentActivityFeed;
