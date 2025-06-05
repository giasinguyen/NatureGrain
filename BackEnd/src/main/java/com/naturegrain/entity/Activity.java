package com.naturegrain.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "activity")
public class Activity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "entity_type")
    private String entityType; // "ORDER", "PRODUCT", "USER", "BLOG", etc.
    
    @Column(name = "entity_id")
    private Long entityId; // ID của entity liên quan
    
    @Column(name = "metadata")
    private String metadata; // JSON string để lưu thêm thông tin
    
    @Column(name = "created_at", nullable = false)
    private Date createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }
    
    // Constructor để tạo Activity dễ dàng
    public Activity(ActivityType activityType, String title, String description, User user) {
        this.activityType = activityType;
        this.title = title;
        this.description = description;
        this.user = user;
        this.createdAt = new Date();
    }
    
    public Activity(ActivityType activityType, String title, String description, User user, String entityType, Long entityId) {
        this.activityType = activityType;
        this.title = title;
        this.description = description;
        this.user = user;
        this.entityType = entityType;
        this.entityId = entityId;
        this.createdAt = new Date();
    }
}
