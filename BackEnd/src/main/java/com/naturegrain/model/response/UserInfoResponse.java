package com.naturegrain.model.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserInfoResponse {
    private long id;
    private String username;
    private String email;
    private List<String> roles;
    
    // Thêm các thông tin bổ sung
    private String firstname;
    private String lastname;
    private String avatar;
    private String phone;
    private String address;
    private String country;
    private String state;
    
    // Constructor cũ cho tính tương thích
    public UserInfoResponse(long id, String username, String email, List<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
    
    // Constructor mới với đầy đủ thông tin
    public UserInfoResponse(long id, String username, String email, List<String> roles, 
                           String firstname, String lastname, String avatar, 
                           String phone, String address, String country, String state) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.firstname = firstname;
        this.lastname = lastname;
        this.avatar = avatar;
        this.phone = phone;
        this.address = address;
        this.country = country;
        this.state = state;
    }
}
