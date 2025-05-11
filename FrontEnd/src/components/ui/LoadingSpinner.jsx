const LoadingSpinner = ({ size = 'md', className = '', type = 'border' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  if (type === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        <div className="animate-bounce delay-0 w-3 h-3 bg-green-600 rounded-full"></div>
        <div className="animate-bounce delay-150 w-3 h-3 bg-green-600 rounded-full" style={{animationDelay: '0.2s'}}></div>
        <div className="animate-bounce delay-300 w-3 h-3 bg-green-600 rounded-full" style={{animationDelay: '0.4s'}}></div>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`relative ${className}`}>
        <div className={`${spinnerSize} bg-green-600 opacity-75 rounded-full animate-ping absolute`}></div>
        <div className={`${spinnerSize} bg-green-600 rounded-full relative`}></div>
      </div>
    );
  }

  if (type === 'logo') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img 
          src="/Naturegrain.png" 
          alt="Loading" 
          className="h-16 w-auto animate-pulse mb-4" 
        />
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${spinnerSize} rounded-full border-gray-200 border-t-green-600 animate-spin shadow-md`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;