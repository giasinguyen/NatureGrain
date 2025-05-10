import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const AvatarUpload = ({ currentAvatar, onAvatarChange, previewOnly = false }) => {
  // eslint-disable-next-line
  const [avatar, setAvatar] = useState(null); // Giữ biến này vì được sử dụng trong các hàm
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    // Nếu có avatar từ props, hiển thị nó
    if (currentAvatar) {
      // Nếu avatar là Data URL, sử dụng trực tiếp 
      if (currentAvatar.startsWith('data:')) {
        setPreview(currentAvatar);
        console.log('Using Data URL directly for avatar');
      }
      // Nếu avatar là URL đầy đủ, sử dụng trực tiếp
      else if (currentAvatar.startsWith('http')) {
        setPreview(currentAvatar);
        console.log('Using full URL for avatar');
      } 
      // Nếu avatar là API endpoint để lấy avatar từ database (/api/avatar/123)
      else if (currentAvatar.includes('/api/avatar/')) {
        setPreview(`${import.meta.env.VITE_API_URL}${currentAvatar}`);
        console.log('Using API endpoint for avatar:', `${import.meta.env.VITE_API_URL}${currentAvatar}`);
      } 
      // Trường hợp khác (đường dẫn cũ đến file)
      else {
        setPreview(`${import.meta.env.VITE_API_URL}${currentAvatar}`);
        console.log('Using default path for avatar');
      }
    }
  }, [currentAvatar]);
  
  const handleSelectFile = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Kiểm tra xem file có phải là hình ảnh
    if (!file.type.match('image.*')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }
    
    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }
    
    setAvatar(file);
    
    // Tạo preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Gọi callback để xử lý file
    onAvatarChange(file);
  };
  
  const handleRemoveAvatar = () => {
    setAvatar(null);
    setPreview(null);
    fileInputRef.current.value = '';
    onAvatarChange(null);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/dummy.png';
              }}
            />
          ) : (
            <span className="text-gray-400 text-5xl">👤</span>
          )}
        </div>
        
        {!previewOnly && (
          <>
            {preview && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-700 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={handleSelectFile}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
            >
              <ArrowUpTrayIcon className="w-5 h-5 text-green-600" />
            </button>
          </>
        )}
      </div>
      
      {!previewOnly && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          <p>Nhấn vào biểu tượng để thay đổi</p>
          <p>Tối đa 5MB (JPG, PNG)</p>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
