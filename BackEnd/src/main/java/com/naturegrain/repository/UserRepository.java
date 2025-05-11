package com.naturegrain.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.naturegrain.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
    
    // Find users created after a specific date
    List<User> findByCreateAtAfter(Date date);
    
    // Find users created between two dates
    List<User> findByCreateAtBetween(Date startDate, Date endDate);
    
    // Count users by registration date
    @Query(value = "SELECT DATE_FORMAT(create_at, '%Y-%m-%d') as date, COUNT(*) as count " +
           "FROM user " +
           "WHERE create_at BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE_FORMAT(create_at, '%Y-%m-%d') " +
           "ORDER BY date", nativeQuery = true)
    List<Object[]> countUsersByRegistrationDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    // Count users by registration month
    @Query(value = "SELECT DATE_FORMAT(create_at, '%Y-%m') as month, COUNT(*) as count " +
           "FROM user " +
           "GROUP BY DATE_FORMAT(create_at, '%Y-%m') " +
           "ORDER BY month", nativeQuery = true)
    List<Object[]> countUsersByRegistrationMonth();
    
    // Get user growth by time period (day, week, month, year)
    @Query(value = "SELECT DATE_FORMAT(create_at, :dateFormat) as period, COUNT(*) as count " +
           "FROM user " +
           "WHERE create_at BETWEEN :startDate AND :endDate " +
           "GROUP BY period " +
           "ORDER BY period", nativeQuery = true)
    List<Object[]> getUserGrowthByTimePeriod(@Param("dateFormat") String dateFormat, 
                                           @Param("startDate") Date startDate, 
                                           @Param("endDate") Date endDate);
    
    // Get user count by country
    @Query(value = "SELECT country, COUNT(*) as count " +
           "FROM user " +
           "WHERE country IS NOT NULL AND country != '' " +
           "GROUP BY country " +
           "ORDER BY count DESC", nativeQuery = true)
    List<Object[]> countUsersByCountry();
    
    // Get users with no orders
    @Query(value = "SELECT u.* FROM user u " +
           "LEFT JOIN orders o ON u.id = o.user_id " +
           "WHERE o.id IS NULL", nativeQuery = true)
    List<User> findUsersWithNoOrders();
    
    // Get users with most orders
    @Query(value = "SELECT u.id, u.username, u.email, COUNT(o.id) as order_count " +
           "FROM user u " +
           "JOIN orders o ON u.id = o.user_id " +
           "GROUP BY u.id, u.username, u.email " +
           "ORDER BY order_count DESC " +
           "LIMIT :limit", nativeQuery = true)
    List<Object[]> findUsersWithMostOrders(@Param("limit") int limit);
    
    // Find inactive users (registered but no orders in a time period)
    @Query(value = "SELECT u.* FROM user u " +
           "LEFT JOIN (SELECT DISTINCT user_id FROM orders WHERE create_at > :since) active_users " +
           "ON u.id = active_users.user_id " +
           "WHERE active_users.user_id IS NULL " +
           "AND u.create_at < :since", nativeQuery = true)
    List<User> findInactiveUsers(@Param("since") Date since);
    
    // Get average time between user registration and first order
    @Query(value = "SELECT AVG(TIMESTAMPDIFF(DAY, u.create_at, MIN(o.create_at))) as avg_days " +
           "FROM user u " +
           "JOIN orders o ON u.id = o.user_id " +
           "GROUP BY u.id", nativeQuery = true)
    Double findAvgDaysBetweenRegistrationAndFirstOrder();
}
