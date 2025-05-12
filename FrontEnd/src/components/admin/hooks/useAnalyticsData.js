import { useState, useEffect } from 'react';

/**
 * Helper function to generate mock data for analytics fallbacks
 * @param {String} type - Type of mock data to generate
 * @returns {Object} - Mock data object
 */
export const generateMockData = (type) => {
  switch (type) {
    case 'orderProcessing':
      return {
        averageProcessingHours: 2.5,
        averageProcessingDays: 1.2,
        byStatus: [
          { status: 'New', hours: 0 },
          { status: 'Processing', hours: 1.5 },
          { status: 'Shipped', hours: 24 },
          { status: 'Delivered', hours: 36 }
        ],
        trends: {
          last30Days: 2.5,
          last60Days: 2.7,
          changePercent: -7.4
        }
      };
    case 'customerInsights':
      return {
        customers: [...Array(10)].map((_, i) => ({
          id: i + 1,
          name: `Khách hàng ${i + 1}`,
          totalSpend: 5000000 - (i * 300000),
          orderCount: 15 - i,
          avgOrderValue: 333333 + (i * 20000)
        })),
        metrics: {
          totalCustomers: 120,
          averageLifetimeValue: 2950000,
          averageOrderFrequency: 3.2,
          averageOrderValue: 350000,
          newCustomersLastMonth: 15,
          customerRetention: 0.78
        }
      };
    default:
      return {};
  }
};

/**
 * Custom hook for fetching analytics data
 * @param {Function} dataFetcher - Function that fetches data
 * @param {any} defaultValue - Default value for data state
 * @param {Array} deps - Dependencies array for useEffect
 * @returns {Object} - Object with data, loading and error states
 */
const useAnalyticsData = (dataFetcher, defaultValue = null, deps = []) => {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dataFetcher();
        if (isMounted) {
          setData(response.data);
          setUsedFallback(false);
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        if (isMounted) {
          setError(err);
          // Use the default value as fallback data on error
          setUsedFallback(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, loading, error, usedFallback };
};

export default useAnalyticsData;
