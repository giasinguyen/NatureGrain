import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook để xử lý lỗi một cách tập trung
 * @returns {Object} - { handleError, errorMessage, clearError }
 */
const useError = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Xử lý lỗi và hiển thị thông báo phù hợp
   * @param {Error|Object} error - Đối tượng lỗi, có thể là Error object hoặc response từ axios
   * @param {string} defaultMessage - Thông báo mặc định nếu không xác định được lỗi 
   * @param {boolean} showToast - Có hiển thị toast thông báo hay không, mặc định là true
   */
  const handleError = useCallback((error, defaultMessage = 'Có lỗi xảy ra', showToast = true) => {
    let message = defaultMessage;

    // Xử lý lỗi từ axios
    if (error.response) {
      const { response } = error;
      message = response.data?.message || `Lỗi ${response.status}: ${defaultMessage}`;
    } 
    // Xử lý lỗi mạng
    else if (error.request) {
      message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
    } 
    // Xử lý lỗi JavaScript thông thường
    else if (error.message) {
      message = error.message;
    }

    // Hiển thị toast nếu cần
    if (showToast) {
      toast.error(message);
    }

    // Lưu thông báo lỗi vào state
    setErrorMessage(message);
    
    return message;
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return { handleError, errorMessage, clearError };
};

export default useError;