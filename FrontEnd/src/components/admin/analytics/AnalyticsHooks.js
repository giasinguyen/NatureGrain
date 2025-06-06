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
 * @param {Object} dateRange - { start: string, end: string } - Optional date range
 */
export const useAnalyticsData = (timeframe = 'month', dateRange = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch analytics data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching analytics data for timeframe: ${timeframe}`, dateRange ? `with date range: ${dateRange.start} to ${dateRange.end}` : '');
      
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
        advancedAnalyticsService.getRevenueAnalytics(timeframe, timespan, dateRange), // Pass date range
        advancedAnalyticsService.getCustomerAnalytics(timespan, dateRange), // Pass date range
        advancedAnalyticsService.getProductAnalytics(5, dateRange), // Pass date range
        advancedAnalyticsService.getOrderAnalytics(timeframe, dateRange), // Pass date range
        advancedAnalyticsService.getTrafficAnalytics(timespan, dateRange) // Pass date range
      ]);
      
      console.log('API responses received:', { revenueData, customerData, orderData, productData, trafficData });      // Data is already transformed by advancedAnalyticsService
      const processedData = {
        revenue: revenueData,
        users: {
          current: customerData.current || customerData.totalCustomers || 0,
          newUsers: customerData.newUsers || 0,
          growth: customerData.growth || 0,
          trend: customerData.trend || [],
          retention: customerData.retention || customerData.retentionRate || 0
        },
        orders: orderData,
        products: productData,
        retention: {
          rate: customerData.retention || customerData.retentionRate || 0,
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
          current: 28825497,
          growth: 6.1,
          trend: [
            { date: '2024-01-01', value: 980000 },
            { date: '2024-01-02', value: 1020000 },
            { date: '2024-01-03', value: 890000 },
            { date: '2024-01-04', value: 1150000 },
            { date: '2024-01-05', value: 1280000 },
            { date: '2024-01-06', value: 1310000 },
            { date: '2024-01-07', value: 1095000 }
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
          current: 211,
          completed: 179,
          pending: 25,
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
      setLoading(false);    }
  }, [timeframe, dateRange]);

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
    todayRevenue: 0,
    revenueGrowth: 0,
    newOrdersToday: 0,
    averageOrderValue: 0,
    activeSessions: 0,
    conversionRate: 0,
    customerSatisfaction: 0,
    lowStockAlerts: 0,
    recentActivityCount: 0,
    peakHours: {
      currentHour: new Date().getHours(),
      peakHour: 14,
      trafficScore: 0
    },
    systemMetrics: {
      responseTime: 0,
      uptime: 0,
      errorRate: 0
    },
    lastUpdated: new Date()
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  // Real-time metrics fetching using advanced analytics service
  const fetchRealTimeMetrics = useCallback(async () => {
    if (!isLiveMode) return;
    
    try {
      // Use the new advanced analytics service
      const { advancedAnalyticsService } = await import('../../../services/advancedAnalytics');
      const metrics = await advancedAnalyticsService.getRealTimeMetrics();
      
      console.log('Fetched real-time metrics:', metrics);
      setRealTimeMetrics(metrics);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Real-time metrics fetch error:', err);
      
      // Fallback to mock data with full structure
      const { advancedAnalyticsService } = await import('../../../services/advancedAnalytics');
      const mockData = advancedAnalyticsService.getMockAdvancedRealTimeData();
      
      console.log('Using mock real-time data:', mockData);
      setRealTimeMetrics(mockData);
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
