package com.naturegrain.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}
