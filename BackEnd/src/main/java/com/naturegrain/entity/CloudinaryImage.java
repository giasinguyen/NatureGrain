package com.naturegrain.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.FetchType;
import javax.persistence.Column;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name= "cloudinary_image")
@EqualsAndHashCode(of = {"id"})
public class CloudinaryImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String publicId;

    @Column(nullable = false)
    private String url;

    @Column(name = "secure_url", nullable = false)
    private String secureUrl;

    @Column(nullable = false)
    private String format;

    @Column(name = "resource_type", nullable = false)
    private String resourceType;

    private Long size;

    private Integer width;
    
    private Integer height;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "roles", "enabled", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired"})
    private User uploadedBy;

    // Hàm tiện ích để trả về URL hình ảnh được sử dụng
    public String getImageUrl() {
        return secureUrl != null ? secureUrl : url;
    }
}
