package com.naturegrain.entity;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String firstname;

    private String lastname;

    private String country;

    private String address;

    private String town;

    private String state;

    private String postcode;

    private String email;
    
    private String phone;

    private String note;

    private long totalPrice;
    
    // Add status field with default value
    private String status = "PENDING";

    // Thay đổi từ EAGER sang LAZY để cải thiện hiệu suất
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    private Timestamp createAt;

    // Thay đổi từ EAGER sang LAZY để tránh lỗi Hibernate Collections
    @OneToMany(mappedBy="order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference // This breaks the circular reference for JSON serialization
    private List<OrderDetail> orderDetails; 

    public void setPostCode(long postcode) {
        this.postcode = String.valueOf(postcode);
    }
    
    @PrePersist
    protected void onCreate() {
        if (createAt == null) {
            createAt = new Timestamp(System.currentTimeMillis());
        }
        if (status == null) {
            status = "PENDING";
        }
    }
}
