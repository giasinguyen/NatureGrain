package com.naturegrain.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.naturegrain.entity.User;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.service.ActivityService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/dev")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Development APIs", description = "Endpoint cho việc phát triển và test")
public class DevController {

    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/setup-activity-table")
    @Operation(summary = "Tạo bảng activity và dữ liệu mẫu (chỉ cho development)")
    public ResponseEntity<?> setupActivityTable() {
        try {
            // Thực thi tạo dữ liệu mẫu
            String result = activityService.setupActivityTable();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bảng activity đã được setup thành công");
            response.put("details", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi setup bảng activity: " + e.getMessage());
            response.put("error", e.toString());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/health")
    @Operation(summary = "Kiểm tra trạng thái server")
    public ResponseEntity<?> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Server đang hoạt động bình thường");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test-activity-feed")
    @Operation(summary = "Test API activity feed (chỉ cho development)")
    public ResponseEntity<?> testActivityFeed() {
        try {
            // Lấy 10 hoạt động gần đây nhất
            String result = activityService.getRecentActivities(10).toString();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Test activity feed thành công");
            response.put("count", activityService.getRecentActivities(10).size());
            response.put("sample_data", activityService.getRecentActivities(3));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi test activity feed: " + e.getMessage());
            response.put("error", e.toString());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/create-admin")
    @Operation(summary = "Tạo admin user cho development")
    public ResponseEntity<?> createAdminUser() {
        try {
            // Kiểm tra xem đã có admin user chưa
            User existingAdmin = userRepository.findByUsername("admin").orElse(null);
            if (existingAdmin != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Admin user đã tồn tại");
                response.put("username", "admin");
                response.put("password", "admin123");
                return ResponseEntity.ok(response);
            }
            
            // Tạo admin user mới
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@naturegrain.com");
            adminUser.setFirstname("Admin");
            adminUser.setLastname("System");
            // Password sẽ được hash bởi service
            adminUser.setPassword("admin123");
            
            // Cần dùng UserService để tạo user với role ADMIN
            // Tạm thời trả về hướng dẫn
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Để tạo admin user, vui lòng chạy script SQL hoặc sử dụng endpoint register");
            response.put("instruction", "POST /api/auth/register với username: admin, password: admin123");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tạo admin user: " + e.getMessage());
            response.put("error", e.toString());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/activity-feed-mock")
    @Operation(summary = "Mock API activity feed cho frontend test (không cần auth)")
    public ResponseEntity<?> activityFeedMock() {
        try {
            // Lấy hoạt động thực từ database
            var activities = activityService.getRecentActivities(10);
            
            // Convert sang format giống như AnalyticsController
            var activityData = activities.stream().map(activity -> {
                Map<String, Object> activityMap = new HashMap<>();
                activityMap.put("id", activity.getId());
                activityMap.put("activityType", activity.getActivityType().toString());
                activityMap.put("title", activity.getTitle());
                activityMap.put("description", activity.getDescription());
                activityMap.put("userName", activity.getUser() != null ? activity.getUser().getUsername() : "Hệ thống");
                activityMap.put("userAvatar", activity.getUser() != null ? activity.getUser().getAvatar() : null);
                activityMap.put("entityType", activity.getEntityType());
                activityMap.put("entityId", activity.getEntityId());
                activityMap.put("metadata", activity.getMetadata());
                activityMap.put("createdAt", activity.getCreatedAt());
                activityMap.put("timeAgo", calculateTimeAgo(activity.getCreatedAt().getTime()));
                return activityMap;
            }).toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activityData);
            response.put("total", activityData.size());
            response.put("message", "Lấy hoạt động thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Fallback với mock data nếu có lỗi
            var mockActivities = createMockActivityData();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", mockActivities);
            response.put("total", mockActivities.size());
            response.put("message", "Lấy hoạt động thành công (mock data)");
            response.put("error", e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
    
    private String calculateTimeAgo(long timestamp) {
        long now = System.currentTimeMillis();
        long diff = now - timestamp;
        
        if (diff < 60000) { // < 1 minute
            return "Vừa xong";
        } else if (diff < 3600000) { // < 1 hour
            return (diff / 60000) + " phút trước";
        } else if (diff < 86400000) { // < 1 day
            return (diff / 3600000) + " giờ trước";
        } else if (diff < 2592000000L) { // < 30 days
            return (diff / 86400000) + " ngày trước";
        } else {
            return (diff / 2592000000L) + " tháng trước";
        }
    }
    
    private java.util.List<Map<String, Object>> createMockActivityData() {
        java.util.List<Map<String, Object>> mockActivities = new java.util.ArrayList<>();
        
        // Create sample activities with Vietnamese content
        mockActivities.add(createMockActivity(1L, "ORDER_CREATED", "Đơn hàng mới #1234", 
                "Đơn hàng trị giá 850.000đ được tạo", "admin", "2 phút trước"));
        
        mockActivities.add(createMockActivity(2L, "PRODUCT_UPDATED", "Cập nhật sản phẩm: Gạo ST25", 
                "Thông tin sản phẩm đã được cập nhật", "admin", "5 phút trước"));
        
        mockActivities.add(createMockActivity(3L, "USER_REGISTERED", "Thành viên mới: nguyenvan123", 
                "Người dùng mới đã đăng ký tài khoản", "system", "10 phút trước"));
        
        mockActivities.add(createMockActivity(4L, "ORDER_COMPLETED", "Hoàn thành đơn hàng #1230", 
                "Đơn hàng đã được giao thành công", "admin", "15 phút trước"));
        
        mockActivities.add(createMockActivity(5L, "BLOG_CREATED", "Bài viết mới: Lợi ích của gạo hữu cơ", 
                "Bài viết mới đã được xuất bản", "admin", "30 phút trước"));
        
        return mockActivities;
    }
    
    private Map<String, Object> createMockActivity(Long id, String type, String title, 
                                                  String description, String user, String timeAgo) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("id", id);
        activity.put("activityType", type);
        activity.put("title", title);
        activity.put("description", description);
        activity.put("userName", user);
        activity.put("userAvatar", null);
        activity.put("timeAgo", timeAgo);
        activity.put("createdAt", new java.util.Date());
        return activity;
    }

}
