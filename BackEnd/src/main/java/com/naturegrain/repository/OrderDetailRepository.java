package com.naturegrain.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.naturegrain.entity.OrderDetail;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail,Long> {    // Find order details by product id - using explicit JPQL to avoid property not found error
    @Query("SELECT od FROM OrderDetail od WHERE od.product.id = :productId")
    List<OrderDetail> findByProductId(@Param("productId") Long productId);
    
    // Find order details by order id
    List<OrderDetail> findByOrderId(Long orderId);
    
    // Find top selling products
    @Query(value = "SELECT product_id, SUM(quantity) as total FROM order_details GROUP BY product_id ORDER BY total DESC LIMIT ?1", nativeQuery = true)
    List<Object[]> findTopSellingProducts(int limit);
    
    // Find product sales by category
    @Query(value = "SELECT c.name, SUM(od.quantity) as total_quantity, SUM(od.price * od.quantity) as total_revenue " +
           "FROM order_details od " +
           "JOIN product p ON od.product_id = p.id " +
           "JOIN category c ON p.category_id = c.id " +
           "GROUP BY c.name", nativeQuery = true)
    List<Object[]> findSalesByCategory();
    
    // Find sales by time period
    @Query(value = "SELECT DATE(o.create_at) as sale_date, SUM(od.quantity) as total_quantity, " +
           "SUM(od.price * od.quantity) as total_revenue " +
           "FROM order_details od " +
           "JOIN orders o ON od.order_id = o.id " +
           "WHERE o.create_at BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(o.create_at) " +
           "ORDER BY sale_date", nativeQuery = true)
    List<Object[]> findSalesByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    // Find customer purchase frequency
    @Query(value = "SELECT u.id, u.username, COUNT(DISTINCT o.id) as order_count, " +
           "SUM(od.price * od.quantity) as total_spent " +
           "FROM order_details od " +
           "JOIN orders o ON od.order_id = o.id " +
           "JOIN users u ON o.user_id = u.id " +
           "GROUP BY u.id, u.username " +
           "ORDER BY total_spent DESC", nativeQuery = true)
    List<Object[]> findCustomerPurchaseFrequency();
    
    // Find sales performance by time of day
    @Query(value = "SELECT HOUR(o.create_at) as hour_of_day, COUNT(DISTINCT o.id) as order_count, " +
           "SUM(od.price * od.quantity) as total_revenue " +
           "FROM order_details od " +
           "JOIN orders o ON od.order_id = o.id " +
           "GROUP BY HOUR(o.create_at) " +
           "ORDER BY hour_of_day", nativeQuery = true)
    List<Object[]> findSalesByHourOfDay();
    
    // Find average order processing time
    @Query(value = "SELECT AVG(TIMESTAMPDIFF(HOUR, o.create_at, o.update_at)) as avg_processing_hours " +
           "FROM orders o " +
           "WHERE o.status = 'COMPLETED' AND o.create_at IS NOT NULL AND o.update_at IS NOT NULL", 
           nativeQuery = true)
    Double findAverageOrderProcessingTime();
    
    // Find product performance trends over time
    @Query(value = "SELECT p.id, p.name, DATE(o.create_at) as sale_date, SUM(od.quantity) as quantity_sold, " +
           "SUM(od.price * od.quantity) as revenue " +
           "FROM order_details od " +
           "JOIN product p ON od.product_id = p.id " +
           "JOIN orders o ON od.order_id = o.id " +
           "WHERE o.create_at BETWEEN :startDate AND :endDate " +
           "GROUP BY p.id, p.name, DATE(o.create_at) " +
           "ORDER BY p.id, sale_date", nativeQuery = true)
    List<Object[]> findProductPerformanceTrends(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    // Find order distribution by status and date
    @Query(value = "SELECT DATE(o.create_at) as order_date, o.status, COUNT(o.id) as order_count " +
           "FROM orders o " +
           "WHERE o.create_at BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(o.create_at), o.status " +
           "ORDER BY order_date", nativeQuery = true)
    List<Object[]> findOrderStatusDistributionByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    // Find customer retention trends
    @Query(value = "SELECT DATE_FORMAT(first_purchase.first_date, '%Y-%m') as month, " +
           "COUNT(DISTINCT first_purchase.user_id) as new_customers, " +
           "COUNT(DISTINCT repeat_purchase.user_id) as returning_customers " +
           "FROM (" +
           "  SELECT user_id, MIN(DATE(create_at)) as first_date " +
           "  FROM orders " +
           "  GROUP BY user_id" +
           ") first_purchase " +
           "LEFT JOIN (" +
           "  SELECT o.user_id, o.id " +
           "  FROM orders o " +
           "  JOIN (" +
           "    SELECT user_id, MIN(id) as first_order_id " +
           "    FROM orders " +
           "    GROUP BY user_id" +
           "  ) first_orders ON o.user_id = first_orders.user_id AND o.id != first_orders.first_order_id" +
           ") repeat_purchase ON first_purchase.user_id = repeat_purchase.user_id " +
           "WHERE first_purchase.first_date BETWEEN :startDate AND :endDate " +
           "GROUP BY month " +
           "ORDER BY month", nativeQuery = true)
    List<Object[]> findCustomerRetentionTrends(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    // Find revenue by product category
    @Query(value = "SELECT c.name as category, SUM(od.price * od.quantity) as revenue, " +
           "COUNT(DISTINCT o.id) as order_count " +
           "FROM order_details od " +
           "JOIN product p ON od.product_id = p.id " +
           "JOIN category c ON p.category_id = c.id " +
           "JOIN orders o ON od.order_id = o.id " +
           "WHERE o.create_at BETWEEN :startDate AND :endDate " +
           "GROUP BY c.name " +
           "ORDER BY revenue DESC", nativeQuery = true)
    List<Object[]> findRevenueByCategory(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    // Find average time between orders for returning customers
    @Query(value = "SELECT u.id, u.username, " +
           "AVG(DATEDIFF(o.create_at, prev_order.create_at)) as avg_days_between_orders " +
           "FROM orders o " +
           "JOIN users u ON o.user_id = u.id " +
           "JOIN orders prev_order ON prev_order.user_id = o.user_id AND prev_order.id != o.id " +
           "AND prev_order.create_at < o.create_at " +
           "GROUP BY u.id, u.username " +
           "HAVING COUNT(o.id) > 1", nativeQuery = true)
    List<Object[]> findAverageTimeBetweenOrders();
    
    // Find product cross-selling relationships
    @Query(value = "SELECT p1.id as product1_id, p1.name as product1_name, " +
           "p2.id as product2_id, p2.name as product2_name, COUNT(*) as frequency " +
           "FROM order_details od1 " +
           "JOIN order_details od2 ON od1.order_id = od2.order_id AND od1.product_id != od2.product_id " +
           "JOIN product p1 ON od1.product_id = p1.id " +
           "JOIN product p2 ON od2.product_id = p2.id " +
           "GROUP BY p1.id, p1.name, p2.id, p2.name " +
           "ORDER BY frequency DESC " +
           "LIMIT :limit", nativeQuery = true)
    List<Object[]> findProductCrossSellRelationships(@Param("limit") int limit);
}
