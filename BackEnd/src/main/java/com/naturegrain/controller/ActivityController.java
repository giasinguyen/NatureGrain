package com.naturegrain.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.naturegrain.dto.response.ActivityResponse;
import com.naturegrain.entity.Activity;
import com.naturegrain.entity.ActivityType;
import com.naturegrain.entity.User;
import com.naturegrain.service.ActivityService;
import com.naturegrain.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Activity APIs", description = "Endpoints cho quản lý hoạt động hệ thống")
public class ActivityController {

    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/recent")
    @Operation(summary = "Lấy danh sách hoạt động gần đây", 
               description = "Trả về danh sách các hoạt động gần đây nhất của hệ thống")
    public ResponseEntity<?> getRecentActivities(
            @Parameter(description = "Số lượng hoạt động cần lấy") 
            @RequestParam(defaultValue = "20") int limit) {
        
        try {
            List<Activity> activities = activityService.getRecentActivities(limit);
            List<ActivityResponse> activityResponses = convertToActivityResponses(activities);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activityResponses);
            response.put("total", activityResponses.size());
            response.put("message", "Lấy danh sách hoạt động thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy danh sách hoạt động: " + e.getMessage());
            errorResponse.put("data", new ArrayList<>());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/paginated")
    @Operation(summary = "Lấy danh sách hoạt động với phân trang")
    public ResponseEntity<?> getActivitiesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Page<Activity> activitiesPage = activityService.getActivitiesPaginated(page, size);
            List<ActivityResponse> activityResponses = convertToActivityResponses(activitiesPage.getContent());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activityResponses);
            response.put("currentPage", page);
            response.put("totalPages", activitiesPage.getTotalPages());
            response.put("totalElements", activitiesPage.getTotalElements());
            response.put("hasNext", activitiesPage.hasNext());
            response.put("hasPrevious", activitiesPage.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy danh sách hoạt động: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/today")
    @Operation(summary = "Lấy danh sách hoạt động hôm nay")
    public ResponseEntity<?> getTodayActivities() {
        try {
            List<Activity> activities = activityService.getTodayActivities();
            List<ActivityResponse> activityResponses = convertToActivityResponses(activities);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activityResponses);
            response.put("total", activityResponses.size());
            response.put("message", "Lấy hoạt động hôm nay thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy hoạt động hôm nay: " + e.getMessage());
            errorResponse.put("data", new ArrayList<>());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/week")
    @Operation(summary = "Lấy danh sách hoạt động trong tuần")
    public ResponseEntity<?> getThisWeekActivities() {
        try {
            List<Activity> activities = activityService.getThisWeekActivities();
            List<ActivityResponse> activityResponses = convertToActivityResponses(activities);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activityResponses);
            response.put("total", activityResponses.size());
            response.put("message", "Lấy hoạt động tuần này thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy hoạt động tuần này: " + e.getMessage());
            errorResponse.put("data", new ArrayList<>());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/type/{activityType}")
    @Operation(summary = "Lấy hoạt động theo loại")
    public ResponseEntity<?> getActivitiesByType(@PathVariable String activityType) {
        try {
            ActivityType type = ActivityType.valueOf(activityType.toUpperCase());
            List<Activity> activities = activityService.getActivitiesByType(type);
            List<ActivityResponse> activityResponses = convertToActivityResponses(activities);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activityResponses);
            response.put("total", activityResponses.size());
            response.put("activityType", type.getDisplayName());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Loại hoạt động không hợp lệ: " + activityType);
            errorResponse.put("data", new ArrayList<>());
            
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy hoạt động theo loại: " + e.getMessage());
            errorResponse.put("data", new ArrayList<>());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "Lấy hoạt động theo entity")
    public ResponseEntity<?> getActivitiesByEntity(
            @PathVariable String entityType, 
            @PathVariable Long entityId) {
        try {
            List<Activity> activities = activityService.getActivitiesByEntity(entityType.toUpperCase(), entityId);
            List<ActivityResponse> activityResponses = convertToActivityResponses(activities);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activityResponses);
            response.put("total", activityResponses.size());
            response.put("entityType", entityType);
            response.put("entityId", entityId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy hoạt động theo entity: " + e.getMessage());
            errorResponse.put("data", new ArrayList<>());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/stats")
    @Operation(summary = "Lấy thống kê hoạt động")
    public ResponseEntity<?> getActivityStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Đếm hoạt động hôm nay
            long todayCount = activityService.countTodayActivities();
            stats.put("todayActivities", todayCount);
            
            // Đếm theo từng loại hoạt động
            Map<String, Long> typeStats = new HashMap<>();
            for (ActivityType type : ActivityType.values()) {
                long count = activityService.countActivitiesByType(type);
                typeStats.put(type.name(), count);
            }
            stats.put("byType", typeStats);
            
            // Thống kê tuần qua
            List<Object[]> weekStats = activityService.getActivityStatsLastWeek();
            List<Map<String, Object>> weeklyData = new ArrayList<>();
            for (Object[] stat : weekStats) {
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("date", stat[0]);
                dayData.put("count", stat[1]);
                weeklyData.add(dayData);
            }
            stats.put("lastWeek", weeklyData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);
            response.put("message", "Lấy thống kê hoạt động thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy thống kê hoạt động: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/types")
    @Operation(summary = "Lấy danh sách tất cả loại hoạt động")
    public ResponseEntity<?> getActivityTypes() {
        try {
            List<Map<String, Object>> types = new ArrayList<>();
            for (ActivityType type : ActivityType.values()) {
                Map<String, Object> typeInfo = new HashMap<>();
                typeInfo.put("name", type.name());
                typeInfo.put("displayName", type.getDisplayName());
                types.add(typeInfo);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", types);
            response.put("message", "Lấy danh sách loại hoạt động thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi lấy danh sách loại hoạt động: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/cleanup")
    @Operation(summary = "Dọn dẹp hoạt động cũ")
    public ResponseEntity<?> cleanupOldActivities(
            @RequestParam(defaultValue = "30") int daysToKeep) {
        try {
            activityService.deleteOldActivities(daysToKeep);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Dọn dẹp hoạt động cũ thành công");
            response.put("daysKept", daysToKeep);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi dọn dẹp hoạt động cũ: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // Helper method để convert Activity sang ActivityResponse
    private List<ActivityResponse> convertToActivityResponses(List<Activity> activities) {
        return activities.stream().map(activity -> {
            String userName = activity.getUser() != null ? activity.getUser().getUsername() : "Hệ thống";
            String userAvatar = activity.getUser() != null ? activity.getUser().getAvatar() : null;
            
            return new ActivityResponse(
                activity.getId(),
                activity.getActivityType(),
                activity.getTitle(),
                activity.getDescription(),
                userName,
                userAvatar,
                activity.getEntityType(),
                activity.getEntityId(),
                activity.getMetadata(),
                activity.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }
}
