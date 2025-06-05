package com.naturegrain.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.naturegrain.entity.Activity;
import com.naturegrain.entity.ActivityType;
import com.naturegrain.entity.User;
import com.naturegrain.repository.ActivityRepository;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.repository.UserRepository;

@Service
@Transactional
public class ActivityService {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Tạo hoạt động mới
    public Activity createActivity(ActivityType activityType, String title, String description, User user) {
        Activity activity = new Activity(activityType, title, description, user);
        return activityRepository.save(activity);
    }
    
    public Activity createActivity(ActivityType activityType, String title, String description, User user, String entityType, Long entityId) {
        Activity activity = new Activity(activityType, title, description, user, entityType, entityId);
        return activityRepository.save(activity);
    }
    
    public Activity createActivity(ActivityType activityType, String title, String description, User user, String entityType, Long entityId, String metadata) {
        Activity activity = new Activity(activityType, title, description, user, entityType, entityId);
        activity.setMetadata(metadata);
        return activityRepository.save(activity);
    }
    
    // Lấy danh sách hoạt động gần đây
    public List<Activity> getRecentActivities() {
        return activityRepository.findTop20ByOrderByCreatedAtDesc();
    }
    
    public List<Activity> getRecentActivities(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return activityRepository.findAllByOrderByCreatedAtDesc(pageable).getContent();
    }
    
    // Lấy hoạt động theo phân trang
    public Page<Activity> getActivitiesPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    // Lấy hoạt động theo user
    public List<Activity> getActivitiesByUser(User user) {
        return activityRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    // Lấy hoạt động theo loại
    public List<Activity> getActivitiesByType(ActivityType activityType) {
        return activityRepository.findByActivityTypeOrderByCreatedAtDesc(activityType);
    }
    
    // Lấy hoạt động trong khoảng thời gian
    public List<Activity> getActivitiesByDateRange(Date startDate, Date endDate) {
        return activityRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate);
    }
    
    // Lấy hoạt động hôm nay
    public List<Activity> getTodayActivities() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date startOfDay = cal.getTime();
        
        cal.add(Calendar.DAY_OF_MONTH, 1);
        Date startOfNextDay = cal.getTime();
        
        return getActivitiesByDateRange(startOfDay, startOfNextDay);
    }
    
    // Lấy hoạt động trong tuần
    public List<Activity> getThisWeekActivities() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.DAY_OF_WEEK, cal.getFirstDayOfWeek());
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date startOfWeek = cal.getTime();
        
        cal.add(Calendar.WEEK_OF_YEAR, 1);
        Date startOfNextWeek = cal.getTime();
        
        return getActivitiesByDateRange(startOfWeek, startOfNextWeek);
    }
    
    // Lấy hoạt động theo entity
    public List<Activity> getActivitiesByEntity(String entityType, Long entityId) {
        return activityRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId);
    }
    
    // Lấy một hoạt động theo ID
    public Optional<Activity> getActivityById(Long id) {
        return activityRepository.findById(id);
    }
    
    // Đếm số hoạt động hôm nay
    public long countTodayActivities() {
        return activityRepository.countTodayActivities();
    }
    
    // Đếm số hoạt động theo loại
    public long countActivitiesByType(ActivityType activityType) {
        return activityRepository.countByActivityType(activityType);
    }
    
    // Thống kê hoạt động tuần qua
    public List<Object[]> getActivityStatsLastWeek() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -7);
        Date startDate = cal.getTime();
        return activityRepository.getActivityStatsLastWeek(startDate);
    }
    
    // Xóa hoạt động cũ (cleanup)
    public void deleteOldActivities(int daysToKeep) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -daysToKeep);
        Date cutoffDate = cal.getTime();
        
        List<Activity> oldActivities = activityRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(new Date(0), cutoffDate);
        activityRepository.deleteAll(oldActivities);
    }
    
    // Helper methods để tạo hoạt động cho các entity khác nhau
    
    public void logOrderActivity(ActivityType type, Long orderId, User user, String additionalInfo) {
        String title = getOrderActivityTitle(type, orderId);
        String description = additionalInfo != null ? additionalInfo : getOrderActivityDescription(type);
        createActivity(type, title, description, user, "ORDER", orderId);
    }
    
    public void logProductActivity(ActivityType type, Long productId, User user, String productName) {
        String title = getProductActivityTitle(type, productName);
        String description = getProductActivityDescription(type, productId);
        createActivity(type, title, description, user, "PRODUCT", productId);
    }
    
    public void logUserActivity(ActivityType type, Long userId, User user, String userName) {
        String title = getUserActivityTitle(type, userName);
        String description = getUserActivityDescription(type, userId);
        createActivity(type, title, description, user, "USER", userId);
    }
    
    public void logBlogActivity(ActivityType type, Long blogId, User user, String blogTitle) {
        String title = getBlogActivityTitle(type, blogTitle);
        String description = getBlogActivityDescription(type, blogId);
        createActivity(type, title, description, user, "BLOG", blogId);
    }
    
    // Private helper methods
    private String getOrderActivityTitle(ActivityType type, Long orderId) {
        switch (type) {
            case ORDER_CREATED: return "Đơn hàng mới #" + orderId;
            case ORDER_UPDATED: return "Cập nhật đơn hàng #" + orderId;
            case ORDER_CANCELLED: return "Hủy đơn hàng #" + orderId;
            case ORDER_COMPLETED: return "Hoàn thành đơn hàng #" + orderId;
            default: return "Hoạt động đơn hàng #" + orderId;
        }
    }
    
    private String getOrderActivityDescription(ActivityType type) {
        switch (type) {
            case ORDER_CREATED: return "Một đơn hàng mới đã được tạo";
            case ORDER_UPDATED: return "Thông tin đơn hàng đã được cập nhật";
            case ORDER_CANCELLED: return "Đơn hàng đã bị hủy";
            case ORDER_COMPLETED: return "Đơn hàng đã được hoàn thành";
            default: return "Hoạt động liên quan đến đơn hàng";
        }
    }
    
    private String getProductActivityTitle(ActivityType type, String productName) {
        switch (type) {
            case PRODUCT_CREATED: return "Sản phẩm mới: " + productName;
            case PRODUCT_UPDATED: return "Cập nhật sản phẩm: " + productName;
            case PRODUCT_DELETED: return "Xóa sản phẩm: " + productName;
            default: return "Hoạt động sản phẩm: " + productName;
        }
    }
    
    private String getProductActivityDescription(ActivityType type, Long productId) {
        switch (type) {
            case PRODUCT_CREATED: return "Sản phẩm mới đã được thêm vào hệ thống";
            case PRODUCT_UPDATED: return "Thông tin sản phẩm đã được cập nhật";
            case PRODUCT_DELETED: return "Sản phẩm đã được xóa khỏi hệ thống";
            default: return "Hoạt động liên quan đến sản phẩm ID: " + productId;
        }
    }
    
    private String getUserActivityTitle(ActivityType type, String userName) {
        switch (type) {
            case USER_REGISTERED: return "Thành viên mới: " + userName;
            case USER_LOGIN: return "Đăng nhập: " + userName;
            case USER_UPDATED: return "Cập nhật thông tin: " + userName;
            default: return "Hoạt động người dùng: " + userName;
        }
    }
    
    private String getUserActivityDescription(ActivityType type, Long userId) {
        switch (type) {
            case USER_REGISTERED: return "Người dùng mới đã đăng ký tài khoản";
            case USER_LOGIN: return "Người dùng đã đăng nhập vào hệ thống";
            case USER_UPDATED: return "Thông tin người dùng đã được cập nhật";
            default: return "Hoạt động liên quan đến người dùng ID: " + userId;
        }
    }
    
    private String getBlogActivityTitle(ActivityType type, String blogTitle) {
        switch (type) {
            case BLOG_CREATED: return "Bài viết mới: " + blogTitle;
            case BLOG_UPDATED: return "Cập nhật bài viết: " + blogTitle;
            case BLOG_DELETED: return "Xóa bài viết: " + blogTitle;
            default: return "Hoạt động bài viết: " + blogTitle;
        }
    }
    
    private String getBlogActivityDescription(ActivityType type, Long blogId) {
        switch (type) {
            case BLOG_CREATED: return "Bài viết mới đã được xuất bản";
            case BLOG_UPDATED: return "Nội dung bài viết đã được cập nhật";
            case BLOG_DELETED: return "Bài viết đã được xóa";
            default: return "Hoạt động liên quan đến bài viết ID: " + blogId;
        }
    }
    
    // Helper method to setup activity table and sample data
    public String setupActivityTable() {
        try {
            // Kiểm tra xem bảng đã có dữ liệu chưa
            long existingCount = activityRepository.count();
            if (existingCount > 0) {
                return "Bảng activity đã có " + existingCount + " bản ghi. Không cần tạo dữ liệu mẫu.";
            }
            
            // Lấy user admin để gán cho các activity
            User adminUser = userRepository.findById(1L)
                    .orElse(userRepository.findAll().stream().findFirst().orElse(null));
            
            if (adminUser == null) {
                return "Không tìm thấy user để gán cho activity. Vui lòng tạo user trước.";
            }
            
            // Tạo các activity mẫu
            createSampleActivities(adminUser);
            
            long newCount = activityRepository.count();
            return "Đã thêm " + newCount + " hoạt động mẫu vào bảng activity.";
            
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi setup bảng activity: " + e.getMessage(), e);
        }
    }
    
    private void createSampleActivities(User user) {
        Calendar cal = Calendar.getInstance();
        
        // Activity 1: ORDER_CREATED - 5 phút trước
        cal.add(Calendar.MINUTE, -5);
        Activity activity1 = new Activity(ActivityType.ORDER_CREATED, 
                "Đơn hàng mới #1001", 
                "Đơn hàng trị giá 850.000đ được tạo bởi khách hàng", 
                user, "ORDER", 1001L);
        activity1.setCreatedAt(cal.getTime());
        activityRepository.save(activity1);
        
        // Activity 2: PRODUCT_UPDATED - 10 phút trước
        cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, -10);
        Activity activity2 = new Activity(ActivityType.PRODUCT_UPDATED, 
                "Cập nhật sản phẩm: Gạo ST25 Premium", 
                "Thông tin giá và mô tả sản phẩm đã được cập nhật", 
                user, "PRODUCT", 1L);
        activity2.setCreatedAt(cal.getTime());
        activityRepository.save(activity2);
        
        // Activity 3: USER_REGISTERED - 15 phút trước
        cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, -15);
        Activity activity3 = new Activity(ActivityType.USER_REGISTERED, 
                "Thành viên mới: nguyenvan123", 
                "Người dùng mới đã đăng ký tài khoản thành công", 
                user, "USER", 2L);
        activity3.setCreatedAt(cal.getTime());
        activityRepository.save(activity3);
        
        // Activity 4: ORDER_COMPLETED - 25 phút trước
        cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, -25);
        Activity activity4 = new Activity(ActivityType.ORDER_COMPLETED, 
                "Hoàn thành đơn hàng #1000", 
                "Đơn hàng đã được giao thành công cho khách hàng", 
                user, "ORDER", 1000L);
        activity4.setCreatedAt(cal.getTime());
        activityRepository.save(activity4);
        
        // Activity 5: BLOG_CREATED - 30 phút trước
        cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, -30);
        Activity activity5 = new Activity(ActivityType.BLOG_CREATED, 
                "Bài viết mới: Lợi ích của gạo hữu cơ", 
                "Bài viết về dinh dưỡng đã được xuất bản", 
                user, "BLOG", 1L);
        activity5.setCreatedAt(cal.getTime());
        activityRepository.save(activity5);
        
        // Activity 6: PRODUCT_CREATED - 45 phút trước
        cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, -45);
        Activity activity6 = new Activity(ActivityType.PRODUCT_CREATED, 
                "Sản phẩm mới: Gạo Jasmine cao cấp", 
                "Sản phẩm mới đã được thêm vào danh mục", 
                user, "PRODUCT", 15L);
        activity6.setCreatedAt(cal.getTime());
        activityRepository.save(activity6);
        
        // Activity 7: ORDER_UPDATED - 1 giờ trước
        cal = Calendar.getInstance();
        cal.add(Calendar.HOUR, -1);
        Activity activity7 = new Activity(ActivityType.ORDER_UPDATED, 
                "Cập nhật đơn hàng #999", 
                "Trạng thái đơn hàng đã được thay đổi thành \"Đang giao\"", 
                user, "ORDER", 999L);
        activity7.setCreatedAt(cal.getTime());
        activityRepository.save(activity7);
        
        // Activity 8: USER_LOGIN - 2 giờ trước
        cal = Calendar.getInstance();
        cal.add(Calendar.HOUR, -2);
        Activity activity8 = new Activity(ActivityType.USER_LOGIN, 
                "Đăng nhập: thaithuy456", 
                "Người dùng đã đăng nhập vào hệ thống", 
                user, "USER", 3L);
        activity8.setCreatedAt(cal.getTime());
        activityRepository.save(activity8);
        
        // Activity 9: SYSTEM_BACKUP - 6 giờ trước
        cal = Calendar.getInstance();
        cal.add(Calendar.HOUR, -6);
        Activity activity9 = new Activity(ActivityType.SYSTEM_BACKUP, 
                "Sao lưu dữ liệu hệ thống", 
                "Quá trình sao lưu dữ liệu đã hoàn thành", 
                user, "SYSTEM", null);
        activity9.setCreatedAt(cal.getTime());
        activityRepository.save(activity9);
        
        // Activity 10: ADMIN_ACTION - 1 ngày trước
        cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -1);
        Activity activity10 = new Activity(ActivityType.ADMIN_ACTION, 
                "Quản trị viên thực hiện bảo trì", 
                "Hệ thống đã được bảo trì và tối ưu hóa", 
                user, "SYSTEM", null);
        activity10.setCreatedAt(cal.getTime());
        activityRepository.save(activity10);
    }
}
