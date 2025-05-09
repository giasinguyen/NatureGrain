import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

// Đối tượng lưu trữ cache toàn cục
const globalCache = new Map();

/**
 * Hook custom để xử lý API fetch với caching
 * @param {Function} fetchFunction - Hàm fetch API trả về một Promise
 * @param {Array} dependencies - Mảng các dependencies quyết định khi nào fetch lại
 * @param {Object} options - Cấu hình các tùy chọn
 * @param {boolean} options.enableCache - Bật/tắt caching
 * @param {number} options.cacheDuration - Thời gian cache hợp lệ (ms)
 * @param {boolean} options.fetchOnMount - Có fetch khi component mount hay không
 */
export const useCachedFetch = (
  fetchFunction,
  dependencies = [],
  {
    enableCache = true,
    cacheDuration = 5 * 60 * 1000, // 5 phút mặc định
    fetchOnMount = true,
  } = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tạo cache key từ fetch function và dependencies
  const generateCacheKey = useCallback(() => {
    const functionName = fetchFunction.name || 'anonymous';
    const depsString = dependencies.map(dep => String(dep)).join('|');
    return `${functionName}:${depsString}`;
  }, [fetchFunction, dependencies]);

  const fetchData = useCallback(async (options = {}) => {
    const { force = false } = options;
    const cacheKey = generateCacheKey();
    
    // Kiểm tra cache nếu được bật và không phải force refresh
    if (enableCache && !force) {
      const cachedData = globalCache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < cacheDuration) {
        setData(cachedData.data);
        setLoading(false);
        setError(null);
        return cachedData.data;
      }
    }

    setLoading(true);

    try {
      const response = await fetchFunction();
      const responseData = response.data;

      // Lưu vào cache nếu được bật
      if (enableCache) {
        globalCache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now(),
        });
      }

      setData(responseData);
      setError(null);
      return responseData;
    } catch (err) {
      setError(err);
      // Không hiển thị toast ở đây vì Axios interceptors đã xử lý
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, cacheDuration, enableCache, generateCacheKey]);

  // Xóa cache cho API hiện tại
  const invalidateCache = useCallback(() => {
    const cacheKey = generateCacheKey();
    globalCache.delete(cacheKey);
  }, [generateCacheKey]);

  // Fetch dữ liệu khi dependencies thay đổi hoặc component mount
  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [...dependencies, fetchOnMount]);

  return { data, loading, error, refetch: fetchData, invalidateCache };
};

/**
 * Hook để clear toàn bộ cache API
 */
export const useApiCache = () => {
  const clearAllCache = useCallback(() => {
    globalCache.clear();
  }, []);

  return { clearAllCache };
};

export default useCachedFetch;
