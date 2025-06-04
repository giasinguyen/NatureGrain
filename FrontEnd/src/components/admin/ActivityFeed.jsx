import { useState, useEffect } from 'react';
import { CalendarIcon, UserCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const ActivityFeed = ({ activities = [] }) => {
  const [feedItems, setFeedItems] = useState([]);
  
  useEffect(() => {
    if (activities && activities.length) {
      setFeedItems(activities);
    } else {
      // Provide fallback demo activities if none provided
      setFeedItems([
        { 
          type: 'order', 
          message: 'Đơn hàng mới #1234 đã được tạo', 
          time: '10 phút trước',
          user: 'Khách hàng' 
        },
        { 
          type: 'user', 
          message: 'Người dùng mới đăng ký', 
          time: '25 phút trước',
          user: 'Nguyễn Văn A' 
        },
        { 
          type: 'product', 
          message: 'Sản phẩm "Gạo lứt hữu cơ" được cập nhật', 
          time: '45 phút trước',
          user: 'Admin' 
        },
        { 
          type: 'blog', 
          message: 'Bài viết mới được đăng', 
          time: '1 giờ trước',
          user: 'Moderator' 
        },
        { 
          type: 'comment', 
          message: 'Bình luận mới trên sản phẩm "Sữa hạt"', 
          time: '2 giờ trước',
          user: 'Trần Thị B' 
        }
      ]);
    }
  }, [activities]);

  // Helper to return the appropriate icon based on activity type
  const getActivityIcon = (type) => {
    switch(type) {
      case 'order':
        return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>;
      case 'user':
        return <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <UserCircleIcon className="h-4 w-4 text-green-600" />
        </div>;
      case 'product':
        return <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>;
      case 'blog':
        return <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>;
      case 'comment':
        return <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <ClockIcon className="h-4 w-4 text-gray-600" />
        </div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
          Hoạt động gần đây
        </h3>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <ol className="relative border-l border-gray-200">
          {feedItems.map((item, index) => (
            <li key={index} className="mb-6 ml-4">
              <div className="absolute -left-4 mt-1">
                {getActivityIcon(item.type)}
              </div>
              <div className="ml-6">
                <h4 className="text-gray-800 font-medium">{item.message}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <UserCircleIcon className="h-4 w-4" />
                  <span>{item.user}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
        
        {feedItems.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500">Không có hoạt động nào gần đây</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
