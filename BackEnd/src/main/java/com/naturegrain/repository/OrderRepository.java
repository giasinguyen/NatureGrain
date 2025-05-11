package com.naturegrain.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.naturegrain.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
    
    @Query(value ="Select * from Orders where user_id = :id order by id desc",nativeQuery = true)
    List<Order> getOrderByUser(long id);
    
    // Find recent orders for dashboard
    List<Order> findTop5ByOrderByCreateAtDesc();
    
    // Find orders created after a specific date
    List<Order> findByCreateAtAfter(Date date);
    
    // Find orders within a date range
    List<Order> findByCreateAtBetween(Date startDate, Date endDate);
    
    // Count orders by status
    @Query(value = "SELECT status, COUNT(*) as count FROM orders GROUP BY status", nativeQuery = true)
    List<Object[]> countOrdersByStatus();
    
    // Get order growth by time period
    @Query(value = "SELECT DATE_FORMAT(create_at, :dateFormat) as period, COUNT(*) as count " +
           "FROM orders " +
           "WHERE create_at BETWEEN :startDate AND :endDate " +
           "GROUP BY period " +
           "ORDER BY period", nativeQuery = true)
    List<Object[]> getOrderGrowthByTimePeriod(@Param("dateFormat") String dateFormat, 
                                             @Param("startDate") Date startDate, 
                                             @Param("endDate") Date endDate);
    
    // Find average time to process orders by status
    @Query(value = "SELECT status, AVG(TIMESTAMPDIFF(HOUR, create_at, update_at)) as avg_hours " +
           "FROM orders " +
           "WHERE create_at IS NOT NULL AND update_at IS NOT NULL " +
           "GROUP BY status", nativeQuery = true)
    List<Object[]> findAverageProcessingTimeByStatus();
    
    // Find orders with high processing time
    @Query(value = "SELECT o.id, o.total_price, o.status, " +
           "TIMESTAMPDIFF(HOUR, o.create_at, o.update_at) as processing_hours, " +
           "u.username as customer " +
           "FROM orders o " +
           "JOIN users u ON o.user_id = u.id " +
           "WHERE o.create_at IS NOT NULL AND o.update_at IS NOT NULL " +
           "AND TIMESTAMPDIFF(HOUR, o.create_at, o.update_at) > :hourThreshold " +
           "ORDER BY processing_hours DESC", nativeQuery = true)
    List<Object[]> findOrdersWithHighProcessingTime(@Param("hourThreshold") int hourThreshold);
    
    // Find customer order value distribution
    @Query(value = "SELECT " +
           "CASE " +
           "  WHEN total_price < 100000 THEN 'Under 100K' " +
           "  WHEN total_price BETWEEN 100000 AND 300000 THEN '100K-300K' " +
           "  WHEN total_price BETWEEN 300001 AND 500000 THEN '300K-500K' " +
           "  WHEN total_price BETWEEN 500001 AND 1000000 THEN '500K-1M' " +
           "  ELSE 'Over 1M' " +
           "END as price_range, " +
           "COUNT(*) as order_count, " +
           "SUM(total_price) as total_revenue " +
           "FROM orders " +
           "WHERE create_at BETWEEN :startDate AND :endDate " +
           "GROUP BY price_range " +
           "ORDER BY MIN(total_price)", nativeQuery = true)
    List<Object[]> findOrderValueDistribution(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
