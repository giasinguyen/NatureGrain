import { useState, useEffect } from 'react';

/**
 * Custom hook để fetch dữ liệu từ API
 * @param {Function} fetchFunction - Hàm fetch dữ liệu, trả về Promise
 * @param {Array} dependencies - Các dependencies để trigger re-fetch 
 * @param {Object|Array} initialData - Dữ liệu ban đầu (mặc định là null)
 * @returns {Object} - { data, loading, error, refetch }
 */
const useFetch = (fetchFunction, dependencies = [], initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch dữ liệu
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      setData(result.data);
      return result.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu khi component mount hoặc dependencies thay đổi
  useEffect(() => {
    fetchData();
  }, dependencies);

  // Cho phép gọi lại fetch từ bên ngoài
  const refetch = () => fetchData();

  return { data, loading, error, refetch };
};

export default useFetch;