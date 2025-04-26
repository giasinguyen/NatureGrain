# NatureGrain - Cửa hàng Thực phẩm Hữu cơ

[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange)](https://www.mysql.com/)

![NatureGrain Logo](FrontEnd/public/dummy.png)

## 📝 Tổng quan

NatureGrain là dự án website thương mại điện tử chuyên về thực phẩm hữu cơ, được xây dựng với mục tiêu cung cấp trải nghiệm mua sắm trực tuyến đáng tin cậy, thuận tiện cho người dùng muốn tìm kiếm các sản phẩm thực phẩm sạch, an toàn và thân thiện với môi trường.

### 🌟 Tính năng chính

- **Danh mục sản phẩm đa dạng**: Rau củ hữu cơ, trái cây, ngũ cốc, thực phẩm khô,...
- **Tài khoản người dùng**: Đăng ký, đăng nhập, quản lý thông tin cá nhân
- **Giỏ hàng và thanh toán**: Thêm sản phẩm, cập nhật số lượng, thanh toán đơn giản
- **Tìm kiếm và lọc sản phẩm**: Tìm kiếm theo từ khóa, lọc theo danh mục, giá cả
- **Blog và tin tức**: Cập nhật thông tin về lối sống lành mạnh, thực phẩm hữu cơ
- **Quản lý đơn hàng**: Theo dõi trạng thái, lịch sử đơn hàng
- **Giao diện thân thiện**: Thiết kế responsive trên đa dạng thiết bị

## 🚀 Công nghệ sử dụng

### Frontend
- **React**: Thư viện JavaScript để xây dựng giao diện người dùng
- **Vite**: Công cụ build nhanh chóng và hiệu quả
- **React Router**: Điều hướng trong ứng dụng
- **Context API**: Quản lý trạng thái ứng dụng
- **CSS/SCSS**: Styling

### Backend
- **Spring Boot**: Framework Java để xây dựng ứng dụng
- **Spring Security**: Xác thực và phân quyền
- **Spring Data JPA**: Tương tác với cơ sở dữ liệu
- **Hibernate**: ORM framework
- **MySQL**: Cơ sở dữ liệu quan hệ

## 🛠️ Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js (>= 14.x)
- Java Development Kit (JDK) 11 hoặc cao hơn
- MySQL Server
- Maven

### Cài đặt Backend
1. Clone dự án:
   ```
   git clone https://github.com/giasinguyen/NatureGrain.git
   cd naturegrain/Backend/ogani
   ```

2. Cấu hình cơ sở dữ liệu:
   - Tạo database MySQL
   - Cập nhật thông tin kết nối trong file `src/main/resources/application.properties`

3. Chạy script SQL để khởi tạo dữ liệu:
   ```
   mysql -u your_username -p your_database < oganisql.sql
   ```

4. Build và chạy backend:
   ```
   ./mvnw spring-boot:run
   ```
   Máy chủ backend sẽ chạy tại địa chỉ: `http://localhost:8080`

### Cài đặt Frontend
1. Đi đến thư mục frontend:
   ```
   cd ../../FrontEnd
   ```

2. Cài đặt dependencies:
   ```
   npm install
   ```

3. Chạy ứng dụng:
   ```
   npm run dev
   ```
   Ứng dụng frontend sẽ chạy tại địa chỉ: `http://localhost:5173`

## 📂 Cấu trúc dự án

### Frontend
```
FrontEnd/
├── public/             # Tài nguyên tĩnh
├── src/
│   ├── assets/         # Hình ảnh, fonts
│   ├── components/     # Components tái sử dụng
│   │   ├── layout/     # Layout components (Header, Footer...)
│   │   └── ui/         # UI components (Button, Modal...)
│   ├── containers/     # Container components
│   ├── context/        # React Context
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Components trang
│   │   └── auth/       # Các trang liên quan đến xác thực
│   │   └── user/       # Các trang trong khu vực người dùng
│   ├── services/       # Dịch vụ API
│   └── utils/          # Utility functions
└── App.jsx             # Component gốc
```

### Backend
```
Backend/ogani/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── ogani/
│       │               ├── config/      # Cấu hình
│       │               ├── controller/  # REST Controllers
│       │               ├── dto/         # Data Transfer Objects
│       │               ├── entity/      # Các Entity
│       │               ├── exception/   # Xử lý ngoại lệ
│       │               ├── repository/  # JPA Repositories
│       │               ├── security/    # Cấu hình bảo mật
│       │               └── service/     # Business Logic
│       └── resources/
│           └── application.properties  # Cấu hình ứng dụng
└── pom.xml                            # Cấu hình Maven
```

## 📜 API Documentation

### Authentication Endpoints
- `POST /api/auth/login`: Đăng nhập
- `POST /api/auth/register`: Đăng ký
- `POST /api/auth/logout`: Đăng xuất

### Product Endpoints
- `GET /api/products`: Lấy danh sách sản phẩm
- `GET /api/products/{id}`: Lấy chi tiết sản phẩm
- `GET /api/categories`: Lấy danh sách danh mục
- `GET /api/categories/{id}/products`: Lấy sản phẩm theo danh mục

### Order Endpoints
- `POST /api/orders`: Tạo đơn hàng mới
- `GET /api/users/{username}/orders`: Lấy đơn hàng của người dùng
- `GET /api/orders/{id}`: Lấy chi tiết đơn hàng

### Blog Endpoints
- `GET /api/blogs`: Lấy danh sách bài viết
- `GET /api/blogs/{id}`: Lấy chi tiết bài viết

## 👥 Tác giả

- **Nguyễn Trần Gia Sĩ** - [GitHub Profile](https://github.com/giasinguyen)

## 📝 Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🙏 Ghi nhận

- Dự án này lấy cảm hứng từ các cửa hàng thực phẩm hữu cơ
- Cảm ơn cộng đồng mã nguồn mở đã cung cấp các thư viện và công cụ tuyệt vời