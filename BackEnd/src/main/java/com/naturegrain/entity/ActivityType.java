package com.naturegrain.entity;

public enum ActivityType {
    ORDER_CREATED("Đơn hàng mới"),
    ORDER_UPDATED("Cập nhật đơn hàng"),
    ORDER_CANCELLED("Hủy đơn hàng"),
    ORDER_COMPLETED("Hoàn thành đơn hàng"),
    PRODUCT_CREATED("Sản phẩm mới"),
    PRODUCT_UPDATED("Cập nhật sản phẩm"),
    PRODUCT_DELETED("Xóa sản phẩm"),
    USER_REGISTERED("Đăng ký thành viên"),
    USER_LOGIN("Đăng nhập"),
    USER_UPDATED("Cập nhật thông tin"),
    BLOG_CREATED("Bài viết mới"),
    BLOG_UPDATED("Cập nhật bài viết"),
    BLOG_DELETED("Xóa bài viết"),    CATEGORY_CREATED("Danh mục mới"),
    CATEGORY_UPDATED("Cập nhật danh mục"),
    CATEGORY_DELETED("Xóa danh mục"),
    SYSTEM_MAINTENANCE("Bảo trì hệ thống"),
    SYSTEM_BACKUP("Sao lưu dữ liệu"),
    ADMIN_ACTION("Thao tác quản trị");
    
    private final String displayName;
    
    ActivityType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
