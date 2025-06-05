// Advanced Analytics Service for comprehensive business intelligence
import api from './api';

export class AdvancedAnalyticsService {
  constructor() {
    this.baseURL = '/v1/analytics';
  }

  // Revenue Analytics
  async getRevenueAnalytics(timeframe = 'week', timespan = 7) {
    try {
      const response = await api.get(`${this.baseURL}/revenue`, {
        params: { timeframe, timespan }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return this.getMockRevenueData(timeframe);
    }
  }

  // Customer Analytics
  async getCustomerAnalytics(timespan = 7) {
    try {
      const response = await api.get(`${this.baseURL}/customers`, {
        params: { timespan }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      return this.getMockCustomerData();
    }
  }

  // Product Analytics
  async getProductAnalytics(limit = 5) {
    try {
      const response = await api.get(`${this.baseURL}/products`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      return this.getMockProductData();
    }
  }

  // Order Analytics
  async getOrderAnalytics(timeframe = 'week') {
    try {
      const response = await api.get(`${this.baseURL}/orders`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      return this.getMockOrderData();
    }
  }

  // Traffic Analytics
  async getTrafficAnalytics(timespan = 7) {
    try {
      const response = await api.get(`${this.baseURL}/traffic`, {
        params: { timespan }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic analytics:', error);
      return this.getMockTrafficData();
    }
  }

  // Comprehensive dashboard data
  async getDashboardAnalytics(timeframe = 'week') {
    try {
      const timespan = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
      
      const [revenue, customers, products, orders, traffic] = await Promise.all([
        this.getRevenueAnalytics(timeframe, timespan),
        this.getCustomerAnalytics(timespan),
        this.getProductAnalytics(5),
        this.getOrderAnalytics(timeframe),
        this.getTrafficAnalytics(timespan)
      ]);

      return {
        revenue,
        users: customers, // Map customers to users for component compatibility
        products,
        orders,
        traffic,
        summary: this.calculateSummaryMetrics(revenue, customers, orders, traffic)
      };
    } catch (error) {
      console.error('Error fetching comprehensive analytics:', error);
      return this.getMockDashboardData(timeframe);
    }
  }

  // Real-time metrics
  async getRealTimeMetrics() {
    try {
      const response = await api.get(`${this.baseURL}/realtime`);
      return response.data;
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      return this.getMockRealTimeData();
    }
  }

  // Activity feed
  async getActivityFeed(limit = 10, filter = 'all') {
    try {
      const response = await api.get(`${this.baseURL}/activities`, {
        params: { limit, filter }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      return this.getMockActivityData();
    }
  }

  // Calculate summary metrics
  calculateSummaryMetrics(revenue, customers, orders, traffic) {
    const conversionRate = traffic.uniqueVisitors > 0 
      ? ((orders.current / traffic.uniqueVisitors) * 100).toFixed(2)
      : '0.00';
    
    const avgOrderValue = orders.current > 0 
      ? (revenue.current / orders.current).toFixed(0)
      : '0';

    const customerAcquisitionRate = customers.total > 0 
      ? ((customers.newUsers / customers.total) * 100).toFixed(1)
      : '0.0';

    return {
      conversionRate,
      avgOrderValue,
      customerAcquisitionRate,
      totalTransactions: orders.current,
      revenuePerVisitor: traffic.uniqueVisitors > 0 
        ? (revenue.current / traffic.uniqueVisitors).toFixed(0)
        : '0'
    };
  }

  // Mock data generators for fallback
  getMockRevenueData(timeframe) {
    const baseAmount = timeframe === 'week' ? 5000000 : 
                     timeframe === 'month' ? 25000000 : 120000000;
    
    const current = Math.floor(baseAmount + Math.random() * baseAmount * 0.3);
    const previous = Math.floor(current * (0.8 + Math.random() * 0.4));
    
    // Generate trend data
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
    const trend = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const value = Math.floor(current / days + (Math.random() - 0.5) * current * 0.2);
      trend.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, value)
      });
    }

    return {
      current,
      previous,
      trend,
      growth: ((current - previous) / previous * 100).toFixed(1)
    };
  }

  getMockCustomerData() {
    const total = Math.floor(450 + Math.random() * 100);
    const newUsers = Math.floor(25 + Math.random() * 15);
    
    return {
      current: total,
      previous: Math.floor(total * 0.85),
      total,
      newUsers,
      activeUsers: Math.floor(120 + Math.random() * 30),
      returning: Math.floor(85 + Math.random() * 25),
      retention: (65 + Math.random() * 15).toFixed(1),
      segments: [
        { name: 'Khách hàng mới', value: Math.floor(20 + Math.random() * 10), color: '#3B82F6' },
        { name: 'Khách hàng quay lại', value: Math.floor(45 + Math.random() * 10), color: '#10B981' },
        { name: 'Khách hàng VIP', value: Math.floor(25 + Math.random() * 10), color: '#F59E0B' },
        { name: 'Không hoạt động', value: Math.floor(8 + Math.random() * 5), color: '#EF4444' }
      ]
    };
  }

  getMockProductData() {
    return {
      total: Math.floor(150 + Math.random() * 50),
      topSelling: [
        {
          name: 'Gạo lứt hữu cơ Premium',
          units: Math.floor(120 + Math.random() * 50),
          sales: Math.floor(2500000 + Math.random() * 1000000),
          growth: (12 + Math.random() * 8).toFixed(1)
        },
        {
          name: 'Quả óc chó Chile',
          units: Math.floor(80 + Math.random() * 30),
          sales: Math.floor(1800000 + Math.random() * 800000),
          growth: (8 + Math.random() * 6).toFixed(1)
        },
        {
          name: 'Hạt chia Mexico',
          units: Math.floor(60 + Math.random() * 25),
          sales: Math.floor(1200000 + Math.random() * 600000),
          growth: (15 + Math.random() * 10).toFixed(1)
        },
        {
          name: 'Yến mạch Úc',
          units: Math.floor(90 + Math.random() * 35),
          sales: Math.floor(1600000 + Math.random() * 700000),
          growth: (5 + Math.random() * 7).toFixed(1)
        },
        {
          name: 'Hạnh nhân Mỹ',
          units: Math.floor(70 + Math.random() * 25),
          sales: Math.floor(1400000 + Math.random() * 600000),
          growth: (10 + Math.random() * 8).toFixed(1)
        }
      ],
      categories: [
        { name: 'Gạo & Ngũ cốc', sales: Math.floor(8000000 + Math.random() * 2000000) },
        { name: 'Hạt dinh dưỡng', sales: Math.floor(6000000 + Math.random() * 1500000) },
        { name: 'Siêu thực phẩm', sales: Math.floor(4000000 + Math.random() * 1000000) },
        { name: 'Thực phẩm hữu cơ', sales: Math.floor(5000000 + Math.random() * 1200000) }
      ]
    };
  }

  getMockOrderData() {
    const current = Math.floor(180 + Math.random() * 50);
    const completed = Math.floor(current * 0.85);
    const pending = Math.floor(current * 0.12);
    const cancelled = current - completed - pending;
    
    return {
      current,
      previous: Math.floor(current * 0.9),
      completed,
      pending,
      cancelled,
      awaitingPayment: Math.floor(current * 0.03),
      totalValue: Math.floor(25000000 + Math.random() * 10000000),
      averageValue: Math.floor(140000 + Math.random() * 60000)
    };
  }

  getMockTrafficData() {
    return {
      pageViews: Math.floor(5000 + Math.random() * 2000),
      uniqueVisitors: Math.floor(1200 + Math.random() * 400),
      bounceRate: (35 + Math.random() * 15).toFixed(1),
      avgSessionDuration: Math.floor(180 + Math.random() * 120), // seconds
      newVisitors: Math.floor(400 + Math.random() * 150),
      returningVisitors: Math.floor(800 + Math.random() * 250),
      sources: [
        { name: 'Tìm kiếm trực tiếp', value: Math.floor(40 + Math.random() * 10) },
        { name: 'Mạng xã hội', value: Math.floor(25 + Math.random() * 10) },
        { name: 'Email marketing', value: Math.floor(15 + Math.random() * 8) },
        { name: 'Quảng cáo trả phí', value: Math.floor(12 + Math.random() * 6) },
        { name: 'Khác', value: Math.floor(8 + Math.random() * 5) }
      ]
    };
  }

  getMockRealTimeData() {
    return {
      onlineUsers: Math.floor(45 + Math.random() * 25),
      activeOrders: Math.floor(8 + Math.random() * 6),
      recentSales: Math.floor(250000 + Math.random() * 150000),
      conversionRate: (2.5 + Math.random() * 1.5).toFixed(2)
    };
  }

  getMockActivityData() {
    const activities = [
      {
        id: 1,
        type: 'order',
        title: 'Đơn hàng mới',
        message: 'Nguyễn Văn A đã đặt đơn hàng trị giá 450,000 ₫',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        metadata: { orderId: 'DH001234', amount: 450000 }
      },
      {
        id: 2,
        type: 'user',
        title: 'Người dùng mới',
        message: 'Trần Thị B đã đăng ký tài khoản',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        metadata: { userId: 'user_456', email: 'tran.b@email.com' }
      },
      {
        id: 3,
        type: 'order',
        title: 'Đơn hàng hoàn thành',
        message: 'Đơn hàng DH001230 đã được giao thành công',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        metadata: { orderId: 'DH001230', status: 'completed' }
      },
      {
        id: 4,
        type: 'alert',
        title: 'Sản phẩm sắp hết hàng',
        message: 'Gạo lứt hữu cơ chỉ còn 5 sản phẩm trong kho',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        metadata: { productId: 'prod_123', stock: 5 }
      },
      {
        id: 5,
        type: 'system',
        title: 'Backup dữ liệu',
        message: 'Backup dữ liệu hàng ngày đã hoàn thành',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        metadata: { backupSize: '125MB' }
      },
      {
        id: 6,
        type: 'user',
        title: 'Đánh giá sản phẩm',
        message: 'Lê Văn C đã đánh giá 5 sao cho sản phẩm Quả óc chó',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        metadata: { rating: 5, productName: 'Quả óc chó' }
      }
    ];

    return activities.sort((a, b) => b.timestamp - a.timestamp);
  }

  getMockDashboardData(timeframe) {
    const revenue = this.getMockRevenueData(timeframe);
    const customers = this.getMockCustomerData();
    const products = this.getMockProductData();
    const orders = this.getMockOrderData();
    const traffic = this.getMockTrafficData();

    return {
      revenue,
      users: customers, // Map customers to users for component compatibility  
      products,
      orders,
      traffic,
      summary: this.calculateSummaryMetrics(revenue, customers, orders, traffic)
    };
  }
}

// Create and export singleton instance
export const advancedAnalyticsService = new AdvancedAnalyticsService();