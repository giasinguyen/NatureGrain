# Hướng dẫn sử dụng Postman với API NatureGrain

## Mục lục
1. [Thiết lập Postman](#1-thiết-lập-postman)
2. [Xác thực bằng JWT](#2-xác-thực-bằng-jwt)
3. [API Quản lý Sản phẩm](#3-api-quản-lý-sản-phẩm)
4. [API Quản lý Danh mục](#4-api-quản-lý-danh-mục)
5. [API Quản lý Đơn hàng](#5-api-quản-lý-đơn-hàng)
6. [API Phân tích - Analytics](#6-api-phân-tích-analytics)

## 1. Thiết lập Postman
1. Tải và cài đặt Postman từ trang web chính thức: https://www.postman.com/downloads/
2. Tạo một Collection mới đặt tên là "NatureGrain API"
3. Thiết lập base URL trong Collection Variables: `http://localhost:8080/api` (hoặc URL của server của bạn)
4. Tạo một biến Environment để lưu token JWT

## 2. Xác thực bằng JWT

### Đăng nhập để lấy JWT Token
- **Method**: POST
- **URL**: `{{base_url}}/auth/login`
- **Body** (raw, JSON):
```json
{
    "username": "admin",
    "password": "admin123"
}
```
- **Response**:
```json
{
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "roles": [
        "ROLE_ADMIN"
    ],
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY1NzA5..."
}
```

### Lưu token JWT
1. Sau khi đăng nhập thành công, copy giá trị từ trường `token` trong response
2. Trong Postman, vào tab "Environment" và thiết lập biến `jwt_token` với giá trị token vừa copy
3. Thiết lập Authorization cho tất cả các request sau này:
   - Type: Bearer Token
   - Token: `{{jwt_token}}`

## 3. API Quản lý Sản phẩm

### 3.1. Lấy danh sách sản phẩm
- **Method**: GET
- **URL**: `{{base_url}}/product`
- **Headers**: Authorization: Bearer {{jwt_token}}
- **Notes**: Không cần xác thực đối với endpoint này

### 3.2. Lấy chi tiết sản phẩm
- **Method**: GET
- **URL**: `{{base_url}}/product/{id}`
- **Headers**: Authorization: Bearer {{jwt_token}}
- **Notes**: Thay `{id}` bằng ID sản phẩm cần xem

### 3.3. Thêm sản phẩm mới
- **Method**: POST
- **URL**: `{{base_url}}/product/create`
- **Headers**: Authorization: Bearer {{jwt_token}}
- **Body** (raw, JSON):
```json
{
    "name": "Tên sản phẩm",
    "description": "Mô tả chi tiết về sản phẩm",
    "price": 50000,
    "quantity": 100,
    "categoryId": 1,
    "imageIds": [2, 3]
}
```

### 3.4. Cập nhật sản phẩm
- **Method**: PUT
- **URL**: `{{base_url}}/product/update/{id}`
- **Headers**: Authorization: Bearer {{jwt_token}}
- **Body** (raw, JSON):
```json
{
    "name": "Tên sản phẩm cập nhật",
    "description": "Mô tả chi tiết cập nhật",
    "price": 55000,
    "quantity": 120,
    "categoryId": 1,
    "imageIds": [2, 3, 4]
}
```

### 3.5. Xóa sản phẩm
- **Method**: DELETE
- **URL**: `{{base_url}}/product/delete/{id}`
- **Headers**: Authorization: Bearer {{jwt_token}}

### 3.6. Lấy sản phẩm theo danh mục
- **Method**: GET
- **URL**: `{{base_url}}/product/category/{categoryId}`
- **Headers**: Authorization: Bearer {{jwt_token}}

### 3.7. Tìm kiếm sản phẩm
- **Method**: GET
- **URL**: `{{base_url}}/product/search?keyword={keyword}`
- **Headers**: Authorization: Bearer {{jwt_token}}

### 3.8. Lọc sản phẩm theo giá
- **Method**: GET
- **URL**: `{{base_url}}/product/filter?categoryId={id}&min={minPrice}&max={maxPrice}`
- **Headers**: Authorization: Bearer {{jwt_token}}

## 4. API Quản lý Danh mục

### 4.1. Lấy danh sách danh mục
- **Method**: GET
- **URL**: `{{base_url}}/category`

### 4.2. Thêm danh mục mới
- **Method**: POST
- **URL**: `{{base_url}}/category/create`
- **Headers**: Authorization: Bearer {{jwt_token}}
- **Body** (raw, JSON):
```json
{
    "name": "Tên danh mục"
}
```

### 4.3. Cập nhật danh mục
- **Method**: PUT
- **URL**: `{{base_url}}/category/update/{id}`
- **Headers**: Authorization: Bearer {{jwt_token}}
- **Body** (raw, JSON):
```json
{
    "name": "Tên danh mục cập nhật"
}
```

### 4.4. Kích hoạt danh mục
- **Method**: PUT
- **URL**: `{{base_url}}/category/enable/{id}`
- **Headers**: Authorization: Bearer {{jwt_token}}

### 4.5. Xóa danh mục
- **Method**: DELETE
- **URL**: `{{base_url}}/category/delete/{id}`
- **Headers**: Authorization: Bearer {{jwt_token}}

## 5. API Quản lý Đơn hàng

### 5.1. Tạo đơn hàng mới
- **Method**: POST
- **URL**: `{{base_url}}/order/create`
- **Headers**: Authorization: Bearer {{jwt_token}}
- **Body** (raw, JSON):
```json
{
    "username": "username",
    "firstname": "Nguyễn",
    "lastname": "Văn A",
    "country": "Việt Nam",
    "address": "123 Đường ABC, Phường XYZ",
    "town": "Quận 1",
    "state": "Hồ Chí Minh",
    "postCode": "70000",
    "email": "nguyenvana@example.com",
    "phone": "0987654321",
    "note": "Giao hàng giờ hành chính",
    "orderDetails": [
        {
            "name": "Organic Carrots Premium",
            "price": 28000,
            "quantity": 2,
            "productId": 1
        },
        {
            "name": "Organic Broccoli Fresh",
            "price": 38000,
            "quantity": 1,
            "productId": 2
        }
    ]
}
```

### 5.2. Lấy danh sách đơn hàng
- **Method**: GET
- **URL**: `{{base_url}}/order`
- **Headers**: Authorization: Bearer {{jwt_token}}

### 5.3. Liên kết sản phẩm với chi tiết đơn hàng
- **Method**: PUT
- **URL**: `{{base_url}}/order/link-product/{orderDetailId}/{productId}`
- **Headers**: Authorization: Bearer {{jwt_token}}

### 5.4. Cập nhật tất cả liên kết sản phẩm trong đơn hàng
- **Method**: POST
- **URL**: `{{base_url}}/order/update-product-associations`
- **Headers**: Authorization: Bearer {{jwt_token}}

## 6. API Phân tích - Analytics

### 6.1. Phân tích cơ bản
- **Method**: GET
- **URL**: `{{base_url}}/analytics/basic`
- **Headers**: Authorization: Bearer {{jwt_token}}

### 6.2. Phân tích nâng cao
- **Method**: GET
- **URL**: `{{base_url}}/analytics/advanced`
- **Headers**: Authorization: Bearer {{jwt_token}}

### 6.3. Phân tích người dùng theo nhóm (Cohort Analysis)
- **Method**: GET
- **URL**: `{{base_url}}/analytics/advanced/cohort`
- **Headers**: Authorization: Bearer {{jwt_token}}

### 6.4. Phân tích giỏ hàng (Basket Analysis)
- **Method**: GET
- **URL**: `{{base_url}}/analytics/advanced/basket?limit=10`
- **Headers**: Authorization: Bearer {{jwt_token}}

### 6.5. Phân tích xu hướng sản phẩm
- **Method**: GET
- **URL**: `{{base_url}}/analytics/advanced/products/trends`
- **Headers**: Authorization: Bearer {{jwt_token}}
- **Query Parameters**:
  - startDate: YYYY-MM-DD (ví dụ: 2023-01-01)
  - endDate: YYYY-MM-DD (ví dụ: 2023-12-31)

## Lưu ý quan trọng
1. Đảm bảo tất cả các endpoint yêu cầu xác thực đều có header `Authorization: Bearer {{jwt_token}}`
2. Token JWT có thời hạn, cần đăng nhập lại khi hết hạn
3. Với các endpoint liên quan đến tải lên hình ảnh, sử dụng form-data thay vì raw JSON
4. Đối với các endpoint xử lý dữ liệu lớn, có thể sẽ mất thời gian phản hồi
