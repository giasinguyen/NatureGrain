# NatureGrain - Cửa hàng Thực phẩm Hữu cơ
# Nguyễn Trần Gia Sĩ

[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green)](https://spring.io/projects/spring-boot)
[![MariaDB](https://img.shields.io/badge/Database-MariaDB-orange)](https://mariadb.org/)
[![Docker](https://img.shields.io/badge/Deployment-Docker-blue)](https://www.docker.com/)
[![Vite](https://img.shields.io/badge/Build-Vite-purple)](https://vitejs.dev/)

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
- **Dashboard quản trị**: Giao diện quản lý toàn diện cho admin
- **Hiệu suất tối ưu**: Caching API, lazy loading, và code splitting

## 🚀 Công nghệ sử dụng

### Frontend
- **React 19**: Thư viện JavaScript hiện đại để xây dựng giao diện người dùng
- **Vite**: Công cụ build nhanh chóng và hiệu quả
- **React Router v7**: Điều hướng trong ứng dụng với nested routes
- **Context API**: Quản lý trạng thái ứng dụng
- **TailwindCSS**: Framework CSS tiện lợi và linh hoạt
- **Axios**: Thư viện xử lý HTTP requests
- **React Toastify**: Hiển thị thông báo
- **React Icons & Heroicons**: Thư viện icon phong phú
- **Formik & Yup**: Xử lý form và validation

### Backend
- **Spring Boot**: Framework Java để xây dựng ứng dụng
- **Spring Security**: Xác thực và phân quyền với JWT
- **Spring Data JPA**: Tương tác với cơ sở dữ liệu
- **Hibernate**: ORM framework
- **MariaDB**: Cơ sở dữ liệu quan hệ
- **Swagger/OpenAPI**: Tự động tạo tài liệu API
- **Lombok**: Giảm code boilerplate

### DevOps & CI/CD
- **Docker**: Container hóa ứng dụng
- **Docker Compose**: Triển khai multi-container
- **Nginx**: Web server và reverse proxy
- **Multi-stage builds**: Tối ưu hóa kích thước image

## 🛠️ Cài đặt và chạy dự án

### Cách 1: Sử dụng Docker (Khuyến nghị)

Cách đơn giản nhất để chạy dự án là sử dụng Docker Compose:

```bash
# Clone dự án
git clone https://github.com/giasinguyen/NatureGrain.git
cd NatureGrain

# Chạy với Docker Compose
docker-compose up -d
```

Sau khi hoàn tất, truy cập:
- Frontend: http://localhost
- Backend API: http://localhost:8080/api

Xem thêm hướng dẫn chi tiết trong [DEPLOYMENT.md](DEPLOYMENT.md).

### Cách 2: Cài đặt thủ công

#### Yêu cầu hệ thống
- Node.js (>= 16.x)
- Java Development Kit (JDK) 17
- MariaDB hoặc MySQL Server
- Maven

#### Cài đặt Backend
1. Clone dự án:
   ```bash
   git clone https://github.com/giasinguyen/NatureGrain.git
   cd NatureGrain/BackEnd
   ```

2. Cấu hình cơ sở dữ liệu:
   - Tạo database MariaDB
   - Cập nhật thông tin kết nối trong file `src/main/resources/application-dev.properties`

3. Chạy script SQL để khởi tạo dữ liệu:
   ```bash
   mysql -u your_username -p your_database < naturegrain.sql
   ```

4. Build và chạy backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   Máy chủ backend sẽ chạy tại địa chỉ: `http://localhost:8080`

#### Cài đặt Frontend
1. Đi đến thư mục frontend:
   ```bash
   cd ../FrontEnd
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Tạo file .env.development:
   ```bash
   echo "VITE_API_URL=http://localhost:8080/api" > .env.development
   ```

4. Chạy ứng dụng:
   ```bash
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
│   │   ├── admin/      # Components cho trang quản trị
│   │   ├── layout/     # Layout components (Header, Footer...)
│   │   └── ui/         # UI components (Button, Modal...)
│   ├── context/        # React Context API
│   ├── hooks/          # Custom hooks (caching, form, error handling...)
│   ├── pages/          # Components trang
│   │   ├── admin/      # Trang quản trị
│   │   ├── auth/       # Trang xác thực
│   │   └── user/       # Trang người dùng
│   ├── services/       # Dịch vụ API
│   └── utils/          # Utility functions
└── .env.*              # Biến môi trường
```

### Backend
```
Backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── naturegrain/
│       │           ├── config/      # Cấu hình
│       │           ├── controller/  # REST Controllers
│       │           ├── entity/      # Các Entity
│       │           ├── exception/   # Xử lý ngoại lệ
│       │           ├── model/       # DTOs và các model
│       │           ├── repository/  # JPA Repositories
│       │           ├── security/    # Bảo mật và JWT
│       │           └── service/     # Business Logic
│       └── resources/
│           └── application.properties  # Cấu hình chung
│           └── config/                 # Cấu hình theo môi trường
└── Dockerfile                         # Cấu hình Docker
```

## 🔒 Tính năng bảo mật

- **JWT Authentication**: Xác thực người dùng an toàn
- **CORS Protection**: Bảo vệ khỏi Cross-Origin Request
- **Password Encryption**: Mã hóa mật khẩu với BCrypt
- **Role-Based Access Control**: Phân quyền người dùng
- **Input Validation**: Kiểm tra đầu vào để ngăn chặn SQL Injection và XSS

## ⚡ Performance Optimizations

- **API Caching**: Caching kết quả API để giảm số lượng request
- **Lazy Loading**: Tải các components khi cần thiết
- **Retry Mechanism**: Tự động thử lại các API calls thất bại
- **Debounce & Throttle**: Tối ưu các event handlers
- **Error Boundary**: Ngăn chặn crash do lỗi component

## 📜 API Documentation

API Documentation được tạo tự động bằng Swagger/OpenAPI và có sẵn tại `/api/swagger-ui.html` khi chạy backend.

## 👥 Tác giả

- **Nguyễn Trần Gia Sĩ** - [GitHub Profile](https://github.com/giasinguyen)

## 📝 Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🙏 Ghi nhận

- Dự án này lấy cảm hứng từ các cửa hàng thực phẩm hữu cơ
- Cảm ơn cộng đồng mã nguồn mở đã cung cấp các thư viện và công cụ tuyệt vời