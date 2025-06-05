package com.naturegrain.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.naturegrain.entity.Activity;
import com.naturegrain.entity.ActivityType;
import com.naturegrain.entity.User;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    // Lấy danh sách hoạt động mới nhất
    List<Activity> findTop20ByOrderByCreatedAtDesc();
    
    // Lấy hoạt động theo phân trang
    Page<Activity> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Lấy hoạt động theo user
    List<Activity> findByUserOrderByCreatedAtDesc(User user);
    
    // Lấy hoạt động theo loại
    List<Activity> findByActivityTypeOrderByCreatedAtDesc(ActivityType activityType);
    
    // Lấy hoạt động trong khoảng thời gian
    List<Activity> findByCreatedAtBetweenOrderByCreatedAtDesc(Date startDate, Date endDate);
    
    // Lấy hoạt động theo entity type và entity id
    List<Activity> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);
    
    // Đếm số hoạt động trong ngày
    @Query("SELECT COUNT(a) FROM Activity a WHERE DATE(a.createdAt) = DATE(CURRENT_DATE)")
    long countTodayActivities();
    
    // Đếm số hoạt động theo loại
    long countByActivityType(ActivityType activityType);
    
    // Lấy hoạt động gần đây nhất theo entity
    @Query("SELECT a FROM Activity a WHERE a.entityType = :entityType AND a.entityId = :entityId ORDER BY a.createdAt DESC")
    List<Activity> findRecentByEntity(@Param("entityType") String entityType, @Param("entityId") Long entityId, Pageable pageable);
    
    // Thống kê hoạt động theo ngày trong tuần qua
    @Query("SELECT DATE(a.createdAt) as date, COUNT(a) as count FROM Activity a WHERE a.createdAt >= :startDate GROUP BY DATE(a.createdAt) ORDER BY DATE(a.createdAt)")
    List<Object[]> getActivityStatsLastWeek(@Param("startDate") Date startDate);
}
