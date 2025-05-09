import api from '../services/api';
import { toast } from 'react-toastify';

/**
 * Utility giúp gọi lại API với số lần thử lại và thời gian delay
 * @param {Function} apiCall - Hàm API cần gọi
 * @param {Object} options - Cấu hình
 * @param {number} options.maxRetries - Số lần thử tối đa (mặc định: 3)
 * @param {number} options.baseDelay - Thời gian delay cơ bản giữa các lần thử (ms) (mặc định: 1000)
 * @param {boolean} options.showToast - Hiển thị toast thông báo thử lại (mặc định: true)
 * @returns {Promise} - Promise với kết quả sau cùng
 */
export const withRetry = async (apiCall, options = {}) => {
  const { 
    maxRetries = 3, 
    baseDelay = 1000,
    showToast = true 
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Nếu lỗi không phải do mạng hoặc timeout, không thử lại
      if (error.response || (!error.code && !error.message.includes('timeout'))) {
        throw error;
      }
      
      // Đây là lần thử cuối cùng, không thử lại nữa
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Tính toán thời gian chờ với backoff thuật toán
      const delay = baseDelay * Math.pow(2, attempt);
      
      if (showToast) {
        toast.info(`Đang kết nối lại... (lần ${attempt + 1}/${maxRetries})`);
      }
      
      // Delay trước khi thử lại
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Giới hạn tần suất gọi hàm
 * @param {Function} fn - Hàm cần giới hạn
 * @param {number} limit - Thời gian tối thiểu giữa các lần gọi (ms)
 * @returns {Function} - Hàm đã được giới hạn
 */
export const throttle = (fn, limit = 1000) => {
  let waiting = false;
  let lastArgs = null;
  
  return function throttled(...args) {
    if (waiting) {
      lastArgs = args;
      return;
    }
    
    fn.apply(this, args);
    waiting = true;
    
    setTimeout(() => {
      waiting = false;
      if (lastArgs) {
        throttled.apply(this, lastArgs);
        lastArgs = null;
      }
    }, limit);
  };
};

/**
 * Debounce hàm, chỉ gọi sau một khoảng thời gian không hoạt động
 * @param {Function} fn - Hàm cần debounce
 * @param {number} delay - Thời gian delay (ms)
 * @returns {Function} - Hàm đã được debounce
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export default {
  withRetry,
  throttle,
  debounce
};
