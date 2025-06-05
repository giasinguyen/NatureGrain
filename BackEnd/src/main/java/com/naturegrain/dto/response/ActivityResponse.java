package com.naturegrain.dto.response;

import java.util.Date;

import com.naturegrain.entity.ActivityType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityResponse {
    
    private Long id;
    private String activityType;
    private String activityTypeDisplay;
    private String title;
    private String description;
    private String userName;
    private String userAvatar;
    private String entityType;
    private Long entityId;
    private String metadata;
    private Date createdAt;
    private String timeAgo; // "2 phút trước", "1 giờ trước", etc.
    
    // Constructor từ Entity
    public ActivityResponse(Long id, ActivityType activityType, String title, String description, 
                           String userName, String userAvatar, String entityType, Long entityId, 
                           String metadata, Date createdAt) {
        this.id = id;
        this.activityType = activityType.name();
        this.activityTypeDisplay = activityType.getDisplayName();
        this.title = title;
        this.description = description;
        this.userName = userName;
        this.userAvatar = userAvatar;
        this.entityType = entityType;
        this.entityId = entityId;
        this.metadata = metadata;
        this.createdAt = createdAt;
        this.timeAgo = calculateTimeAgo(createdAt);
    }
    
    private String calculateTimeAgo(Date createdAt) {
        if (createdAt == null) return "";
        
        long diffInMillis = System.currentTimeMillis() - createdAt.getTime();
        long diffInSeconds = diffInMillis / 1000;
        long diffInMinutes = diffInSeconds / 60;
        long diffInHours = diffInMinutes / 60;
        long diffInDays = diffInHours / 24;
        
        if (diffInDays > 0) {
            return diffInDays + " ngày trước";
        } else if (diffInHours > 0) {
            return diffInHours + " giờ trước";
        } else if (diffInMinutes > 0) {
            return diffInMinutes + " phút trước";
        } else {
            return "Vừa xong";
        }
    }
}
