import { useCallback, useState, useEffect } from 'react';

/**
 * Custom hook for fetching analytics data with fallback mechanisms
 */
const useAnalyticsData = (timeframe = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch analytics data with multiple fallback mechanisms
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching analytics data for timeframe: ${timeframe}`);
      
      // Dynamic imports to reduce initial bundle size
      const { analyticsService } = await import('../../../services/api');
      
      // Fetch all needed data in parallel for performance
      const [
        salesTrends, 
        userGrowth, 
        productPerformance, 
        orderStatus, 
        customerRetention
      ] = await Promise.all([
        analyticsService.getSalesTrends(timeframe === 'week' ? 'daily' : timeframe === 'month' ? 'weekly' : 'monthly'),
        analyticsService.getUserGrowth(timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365),
        analyticsService.getProductPerformance(),
        analyticsService.getOrderStatusDistribution(),
        analyticsService.getCustomerRetention()
      ]);
      
      console.log('API responses received:', { salesTrends, userGrowth, orderStatus, productPerformance });
      
      // Process and normalize data to handle different API response structures
      const processedData = {
        revenue: {
          current: salesTrends?.totalRevenue || salesTrends?.data?.reduce((sum, item) => sum + (item.sales || item.revenue || 0), 0) || 0,
          growth: salesTrends?.growthRate || salesTrends?.summary?.growthRate || 0,
          trend: salesTrends?.trends || salesTrends?.data?.map(item => ({
            date: item.period || item.date,
            value: item.sales || item.revenue || 0
          })) || []
        },
        users: {
          current: userGrowth?.totalUsers || userGrowth?.reduce?.((sum, item) => sum + (item.totalUsers || 0), 0) || 0,
          newUsers: userGrowth?.newUsers || userGrowth?.reduce?.((sum, item) => sum + (item.newUsers || 0), 0) || 0,
          growth: userGrowth?.growthRate || 0,
          trend: userGrowth?.trends || userGrowth?.map?.(item => ({
            date: item.date,
            value: item.totalUsers || 0
          })) || []
        },
        orders: {
          current: orderStatus?.total || orderStatus?.reduce?.((sum, item) => sum + (item.count || 0), 0) || 0,
          completed: orderStatus?.completed || orderStatus?.find?.(item => item.status === 'COMPLETED')?.count || 0,
          pending: orderStatus?.pending || orderStatus?.find?.(item => item.status === 'PENDING')?.count || 0,
          cancelled: orderStatus?.cancelled || orderStatus?.find?.(item => item.status === 'CANCELLED')?.count || 0,
          growth: orderStatus?.growthRate || 0
        },
        products: {
          topSelling: productPerformance?.topProducts || productPerformance || [],
          categories: productPerformance?.categories || [],
          totalViews: productPerformance?.totalViews || 0
        },
        retention: {
          rate: customerRetention?.rate || customerRetention?.summary?.customerRetentionRate || 0,
          trend: customerRetention?.trend || []
        }
      };

      console.log('Processed Data:', processedData);
      setData(processedData);
    } catch (err) {
      console.error('Analytics data fetch error:', err);
      setError(err.message);
      
      // Try fallback with advancedAnalyticsService if primary API fails
      try {
        console.log('Trying fallback with advancedAnalyticsService...');
        const { advancedAnalyticsService } = await import('../../../services/advancedAnalytics');
        const fallbackData = await advancedAnalyticsService.getDashboardAnalytics(timeframe);
        console.log('Fallback data:', fallbackData);
        setData(fallbackData);
        return;
      } catch (fallbackErr) {
        console.error('Fallback analytics service also failed:', fallbackErr);
      }
      
      // Final fallback to mock data
      console.log('Using final mock data fallback');
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

  return {
    data,
    loading,
    error,
    refreshData: fetchData
  };
};

export default useAnalyticsData;
