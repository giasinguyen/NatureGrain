package com.naturegrain.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name="username",unique = true)
    private String username;

    @Column(name="email",unique = true)
    private String email;

    private String firstname;

    private String lastname;

    private String password;

    private String country;

    private String state;

    private String address;    private String phone;    // Thay đổi để lưu trực tiếp dữ liệu Base64 của ảnh
    @Lob // Large Object annotation để lưu trữ dữ liệu lớn
    @Column(name = "avatar", columnDefinition = "LONGTEXT") // LONGTEXT cho MySQL để lưu Base64 string lớn
    private String avatar;

    // Không còn cần lưu trữ byte dữ liệu nữa, giữ lại để tương thích
    @Column(name = "avatar_data")
    private byte[] avatarData;
    
    // Không cần lưu content type nữa vì đã bao gồm trong Data URL
    @Column(name = "avatar_content_type")
    private String avatarContentType;
    
    @Column(name = "verification_code", length = 64)
    private String verificationCode;

    private boolean enabled;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",joinColumns = @JoinColumn(name = "user_id"),inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
}
