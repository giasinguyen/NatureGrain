package com.naturegrain.model.response;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.naturegrain.entity.Order;
import com.naturegrain.entity.OrderDetail;

/**
 * Data Transfer Object cho Order để cung cấp cả các tên trường theo chuẩn 
 * của Java (camelCase) và các tên trường mà Frontend đang kỳ vọng
 */
public class OrderDTO {
    // Fields chính từ Order entity
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
    private String status;
    private Timestamp createAt;
    
    // Constructor từ entity
    public OrderDTO(Order order) {
        this.id = order.getId();
        this.firstname = order.getFirstname();
        this.lastname = order.getLastname();
        this.country = order.getCountry();
        this.address = order.getAddress();
        this.town = order.getTown();
        this.state = order.getState();
        this.postcode = order.getPostcode();
        this.email = order.getEmail();
        this.phone = order.getPhone();
        this.note = order.getNote();
        this.totalPrice = order.getTotalPrice();
        this.status = order.getStatus();
        this.createAt = order.getCreateAt();
    }
    
    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTown() {
        return town;
    }

    public void setTown(String town) {
        this.town = town;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public long getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(long totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Timestamp createAt) {
        this.createAt = createAt;
    }
}
