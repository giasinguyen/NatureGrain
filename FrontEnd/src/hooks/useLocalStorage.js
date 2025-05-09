import { useState, useEffect } from 'react';

/**
 * Custom hook để lưu trữ và đồng bộ state với localStorage
 * @param {string} key - Khóa để lưu trữ trong localStorage
 * @param {any} initialValue - Giá trị ban đầu
 * @returns {Array} - [storedValue, setValue] tương tự như useState
 */
const useLocalStorage = (key, initialValue) => {
  // Hàm để lấy giá trị từ localStorage hoặc sử dụng initialValue
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State để lưu trữ giá trị
  const [storedValue, setStoredValue] = useState(readValue);

  // Hàm để cập nhật cả state và localStorage
  const setValue = (value) => {
    try {
      // Cho phép value là một function như setState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Lưu vào state
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Đồng bộ với các tab/window khác
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        setStoredValue(JSON.parse(event.newValue || JSON.stringify(initialValue)));
      }
    };
    
    // Đăng ký event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Hủy đăng ký khi component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;