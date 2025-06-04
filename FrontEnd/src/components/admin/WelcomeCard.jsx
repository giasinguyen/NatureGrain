import { useAuth } from '../../context/AuthContext';

const WelcomeCard = () => {
  const { currentUser } = useAuth();
  const userName = currentUser ? (currentUser.firstname || currentUser.username || 'Admin') : 'Admin';
  
  // Get time of day based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-lg mb-6">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {currentUser && currentUser.avatar ? (
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={currentUser.avatar}
                alt={userName}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl font-medium text-green-700">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800">{getGreeting()}, {userName}!</h2>
            <p className="mt-1 text-gray-600">
              Chào mừng trở lại với bảng điều khiển quản trị. Đây là tổng quan công việc hôm nay của bạn.
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
              <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span>
              Hệ thống hoạt động bình thường
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
