import { useState, useCallback, useEffect } from 'react';

/**
 * Convert timeframe string to appropriate numeric timespan
 * @param {string} timeframe - 'week', 'month', or 'year'
 * @returns {number} - Numeric timespan in days
 */
const getTimespanFromTimeframe = (timeframe) => {
  switch (timeframe) {
    case 'week':
      return 7;
    case 'month':
      return 30;
    case 'year':
      return 365;
    default:
      return 30;
  }
};

/**
 * Custom hook for fetching analytics data
 * @param {string} timeframe - 'week', 'month', or 'year'
 */
export const useAnalyticsData = (timeframe = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch analytics data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching analytics data for timeframe: ${timeframe}`);
      
      // Convert timeframe to numeric timespan for backend APIs
      const timespan = getTimespanFromTimeframe(timeframe);
      console.log(`Converted timeframe "${timeframe}" to timespan: ${timespan}`);
      
      // Use new advanced analytics service with transformed data
      const { advancedAnalyticsService } = await import('../../../services/advancedAnalytics');
      
      // Fetch all needed data in parallel for performance
      const [
        revenueData,
        customerData,
        productData,
        orderData,
        trafficData
      ] = await Promise.all([
        advancedAnalyticsService.getRevenueAnalytics(timeframe, timespan), // Pass both timeframe and timespan
        advancedAnalyticsService.getCustomerAnalytics(timespan), // Pass numeric timespan
        advancedAnalyticsService.getProductAnalytics(5), // Pass default limit of 5
        advancedAnalyticsService.getOrderAnalytics(timeframe), // Pass timeframe string
        advancedAnalyticsService.getTrafficAnalytics(timespan) // Pass numeric timespan
      ]);
      
      console.log('API responses received:', { revenueData, customerData, orderData, productData, trafficData });
      
      // Data is already transformed by advancedAnalyticsService
      const processedData = {
        revenue: revenueData,
        users: {
          current: customerData.totalCustomers,
          newUsers: customerData.newCustomers,
          growth: customerData.growth,
          trend: customerData.trend
        },
        orders: orderData,
        products: productData,
        retention: {
          rate: customerData.retentionRate || 0,
          trend: customerData.retentionTrend || []
        }
      };

      console.log('Processed Data:', processedData);
      setData(processedData);    } catch (err) {
      console.error('Analytics data fetch error:', err);
      setError(err.message);
      
      // Final fallback to mock data for development
      console.log('Using mock data fallback');
      setData({
        revenue: {
          current: 2450000,
          growth: 12.5,
          trend: [
            { date: '2024-01-01', value: 180000 },
            { date: '2024-01-02', value: 220000 },
            { date: '2024-01-03', value: 190000 },
            { date: '2024-01-04', value: 250000 },
            { date: '2024-01-05', value: 280000 },
            { date: '2024-01-06', value: 310000 },
            { date: '2024-01-07', value: 295000 }
          ]
        },
        users: {
          current: 1284,
          newUsers: 142,
          growth: 8.2,
          trend: [
            { date: '2024-01-01', value: 1200 },
            { date: '2024-01-02', value: 1210 },
            { date: '2024-01-03', value: 1225 },
            { date: '2024-01-04', value: 1240 },
            { date: '2024-01-05', value: 1260 },
            { date: '2024-01-06', value: 1275 },
            { date: '2024-01-07', value: 1284 }
          ]
        },
        orders: {
          current: 89,
          completed: 67,
          pending: 15,
          cancelled: 7,
          growth: 15.3
        },
        products: {
          topSelling: [
            { name: 'Gạo ST25', sales: 450, revenue: 2250000 },
            { name: 'Gạo Jasmine', sales: 320, revenue: 1600000 },
            { name: 'Gạo Tám Xoan', sales: 280, revenue: 1680000 }
          ],
          categories: [
            { name: 'Gạo thơm', value: 45 },
            { name: 'Gạo tẻ', value: 30 },
            { name: 'Gạo nàng hương', value: 25 }
          ],
          totalViews: 15420
        },
        retention: {
          rate: 68.5,
          trend: [
            { date: '2024-01-01', value: 65 },
            { date: '2024-01-02', value: 66.5 },
            { date: '2024-01-03', value: 67 },
            { date: '2024-01-04', value: 68 },
            { date: '2024-01-05', value: 68.5 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, fetchData };
};

/**
 * Custom hook for real-time metrics
 */
export const useRealTimeMetrics = (isLiveMode = true) => {
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    onlineUsers: 0,
    activeOrders: 0,
    recentSales: 0,
    conversionRate: 0
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());  // Real-time metrics fetching
  const fetchRealTimeMetrics = useCallback(async () => {
    if (!isLiveMode) return;
    
    try {
      // Note: Real-time metrics are not available from backend, using mock data
      setRealTimeMetrics({
        onlineUsers: Math.floor(45 + Math.random() * 25),
        activeOrders: Math.floor(12 + Math.random() * 8),
        recentSales: Math.floor(150000 + Math.random() * 50000),
        conversionRate: (2.5 + Math.random() * 1.5)
      });
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Real-time metrics fetch error:', err);
      // Fallback to mock data
      setRealTimeMetrics({
        onlineUsers: Math.floor(45 + Math.random() * 25),
        activeOrders: Math.floor(12 + Math.random() * 8),
        recentSales: Math.floor(150000 + Math.random() * 50000),
        conversionRate: (2.5 + Math.random() * 1.5)
      });
      setLastUpdate(new Date());
    }
  }, [isLiveMode]);

  // Real-time data effect
  useEffect(() => {
    fetchRealTimeMetrics(); // Initial fetch
    
    const interval = setInterval(() => {
      fetchRealTimeMetrics();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchRealTimeMetrics]);

  return { realTimeMetrics, lastUpdate };
};
