<div align="center">
  <img src="FrontEnd/public/Naturegrain.png" alt="NatureGrain Logo" width="300"/>
  <h1>NatureGrain - Cửa hàng Thực phẩm Hữu cơ</h1>
  <p><strong>Dự án: Xây dựng Hệ thống Thương mại Điện tử Thực phẩm Hữu cơ</strong></p>
  <p><em>Phát triển bởi: Nguyễn Trần Gia Sĩ | Cập nhật: 15/05/2025</em></p>
</div>

<p align="center">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react" alt="React"/></a>
  <a href="https://spring.io/projects/spring-boot"><img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=spring" alt="Spring Boot"/></a>
  <a href="https://mariadb.org/"><img src="https://img.shields.io/badge/Database-MariaDB-003545?style=for-the-badge&logo=mariadb" alt="MariaDB"/></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Deployment-Docker-2496ED?style=for-the-badge&logo=docker" alt="Docker"/></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite" alt="Vite"/></a>
</p>

## 📝 Giới thiệu

**NatureGrain** là nền tảng thương mại điện tử chuyên về thực phẩm hữu cơ, được phát triển với mục tiêu mang đến trải nghiệm mua sắm trực tuyến an toàn, tiện lợi và đáng tin cậy. Dự án tập trung vào việc kết nối người tiêu dùng với các sản phẩm thực phẩm chất lượng cao, được sản xuất theo phương pháp hữu cơ, thân thiện với môi trường.

<details open>
<summary><h3>🌱 Cam kết của NatureGrain</h3></summary>

- **Chất lượng cao**: Chỉ cung cấp sản phẩm đạt tiêu chuẩn hữu cơ nghiêm ngặt
- **Minh bạch**: Thông tin đầy đủ về nguồn gốc và quy trình sản xuất
- **Bền vững**: Ưu tiên các phương pháp sản xuất và đóng gói thân thiện với môi trường
- **Trải nghiệm người dùng**: Giao diện thân thiện, dễ sử dụng trên mọi thiết bị
</details>

<details open>
<summary><h3>🌟 Tính năng chính</h3></summary>

#### Cho người dùng cuối:
- **Danh mục sản phẩm đa dạng**: Rau củ tươi, trái cây, ngũ cốc, hạt, thực phẩm khô và nhiều mặt hàng khác
- **Hệ thống tài khoản**: Đăng ký, đăng nhập, quản lý thông tin cá nhân và theo dõi lịch sử mua hàng
- **Giỏ hàng thông minh**: Thêm sản phẩm, cập nhật số lượng, áp dụng mã giảm giá, dự tính phí vận chuyển
- **Quy trình thanh toán**: Nhiều phương thức thanh toán, lưu địa chỉ giao hàng cho lần sau
- **Tìm kiếm và lọc nâng cao**: Tìm kiếm theo từ khóa, lọc theo danh mục, giá cả, đánh giá, và thuộc tính khác
- **Blog dinh dưỡng**: Bài viết về lối sống lành mạnh, công thức nấu ăn và thông tin hữu ích
- **Đánh giá sản phẩm**: Cho phép người dùng đánh giá và xem đánh giá từ người khác

#### Cho quản trị viên:
- **Dashboard quản trị**: Giao diện quản lý toàn diện cho admin
- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm và quản lý kho hàng
- **Quản lý đơn hàng**: Xử lý đơn hàng, cập nhật trạng thái, in hóa đơn
- **Phân tích dữ liệu**: Thống kê bán hàng, phân tích xu hướng, báo cáo doanh thu
- **Quản lý người dùng**: Xem thông tin khách hàng, phân quyền người dùng
- **Quản lý nội dung**: Cập nhật blog, banner quảng cáo và thông tin website
</details>

## 🚀 Công nghệ sử dụng

<details open>
<summary><h3>💻 Frontend</h3></summary>

- **React 19**: Framework JavaScript hiện đại với Hooks, Suspense, và Server Components
- **Vite 5**: Hệ thống build siêu nhanh với Hot Module Replacement và optimized bundling
- **React Router v7**: Điều hướng trong ứng dụng với Data APIs, Loaders và nested routes
- **TailwindCSS 3**: Framework CSS utility-first với JIT compiler và custom theming
- **Context API & Custom Hooks**: Quản lý state với pattern đơn giản và hiệu quả
- **Axios**: Client HTTP với interceptors, request cancellation và error handling
- **JWT Authentication**: Xác thực và phân quyền theo chuẩn JSON Web Token
- **React Toastify**: Hiển thị thông báo cho người dùng một cách trực quan
- **React Icons & Heroicons**: Thư viện icon phong phú và dễ sử dụng
- **Formik & Yup**: Xử lý form và validation dữ liệu
- **Lazy loading & Code splitting**: Tối ưu thời gian tải trang
- **Progressive loading**: Tải hình ảnh theo chất lượng tăng dần
</details>

<details open>
<summary><h3>🛠️ Backend</h3></summary>

- **Spring Boot 2.7**: Framework Java enterprise với auto-configuration và embedded server
- **Spring Security**: Hệ thống xác thực và phân quyền mạnh mẽ với JWT
- **Spring Data JPA**: Tự động tạo repository với các phương thức truy vấn
- **Hibernate ORM**: Object-Relational Mapping cho tương tác cơ sở dữ liệu
- **MariaDB**: Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở
- **Cloudinary Integration**: Lưu trữ và quản lý hình ảnh trên cloud
- **Dotenv**: Quản lý biến môi trường an toàn với file .env
- **Swagger/OpenAPI**: Tự động tạo tài liệu API với UI tương tác
- **Lombok**: Giảm code boilerplate với annotation processors
- **Multipart File Upload**: Hỗ trợ tải lên nhiều file cùng lúc
- **Exception Handling**: Xử lý ngoại lệ toàn cục với RestControllerAdvice
- **Bean Validation**: Kiểm tra dữ liệu tự động với javax.validation
</details>

<details open>
<summary><h3>🔄 DevOps & CI/CD</h3></summary>

- **Docker**: Container hóa ứng dụng cho triển khai nhất quán
- **Docker Compose**: Định nghĩa và chạy multi-container với một command
- **Nginx**: Web server và reverse proxy với cấu hình tối ưu
- **Multi-stage builds**: Giảm kích thước image Docker
- **Health checks**: Giám sát trạng thái ứng dụng
- **Volume mounts**: Lưu trữ dữ liệu bền vững ngoài container
- **Environment variables**: Cấu hình linh hoạt giữa các môi trường
</details>

<details>
<summary><h3>📊 Phân tích và Báo cáo</h3></summary>

- **Dashboard Interactivity**: Biểu đồ và báo cáo tương tác với Chart.js
- **Analytics Data Models**: Cấu trúc dữ liệu tối ưu cho phân tích
- **Custom Metrics**: Theo dõi KPIs quan trọng cho kinh doanh
- **Advanced Filters**: Lọc dữ liệu nâng cao và cross-dimensional
- **Export Reports**: Xuất dữ liệu dưới dạng CSV, Excel, hoặc PDF
</details>

## 🛠️ Cài đặt và chạy dự án

<details open>
<summary><h3>🐳 Phương pháp 1: Sử dụng Docker (Khuyến nghị)</h3></summary>

Cách đơn giản nhất để chạy toàn bộ hệ thống là sử dụng Docker Compose:

```bash
# Clone dự án
git clone https://github.com/giasinguyen/NatureGrain.git
cd NatureGrain

# Chạy với Docker Compose
docker-compose up -d
```

Sau khi khởi chạy thành công, truy cập:
- **Frontend**: [http://localhost](http://localhost)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Swagger UI**: [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)

Để dừng và xóa các containers:
```bash
docker-compose down
```

Để dừng và xóa các containers kèm theo volumes (xóa cả dữ liệu):
```bash
docker-compose down -v
```

Xem thêm hướng dẫn chi tiết triển khai trong [DEPLOYMENT.md](DEPLOYMENT.md).
</details>

<details>
<summary><h3>💻 Phương pháp 2: Cài đặt thủ công</h3></summary>

#### Yêu cầu hệ thống
- **Node.js**: >= 18.x (khuyên dùng bản LTS mới nhất)
- **Java Development Kit (JDK)**: 17 hoặc mới hơn
- **MariaDB**: 10.6 hoặc mới hơn
- **Maven**: 3.8+ để build backend

#### Biến môi trường
Tạo các file .env cho cấu hình:
- `.env` cho backend (thư mục `BackEnd`)
- `.env.development` cho môi trường development frontend (thư mục `FrontEnd`)
- `.env.production` cho môi trường production frontend (thư mục `FrontEnd`)

#### Cài đặt Backend
1. **Clone dự án**:
   ```bash
   git clone https://github.com/giasinguyen/NatureGrain.git
   cd NatureGrain/BackEnd
   ```

2. **Cấu hình cơ sở dữ liệu**:
   ```bash
   # Tạo database MariaDB
   mysql -u root -p -e "CREATE DATABASE naturegrain CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   
   # Cấu hình kết nối trong file .env
   echo "DATABASE_URL=jdbc:mysql://localhost:3306/naturegrain
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=your_password
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key  
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=naturegrain_products
   JWT_SECRET=your_jwt_secret" > .env
   ```

3. **Khởi tạo dữ liệu**:
   ```bash
   mysql -u root -p naturegrain < naturegrain.sql
   ```

4. **Build và chạy backend**:
   ```bash
   # Trên Windows
   mvnw.cmd spring-boot:run
   
   # Trên Linux/macOS
   ./mvnw spring-boot:run
   ```
   Máy chủ backend sẽ chạy tại địa chỉ: [http://localhost:8080](http://localhost:8080)

#### Cài đặt Frontend
1. **Đi đến thư mục frontend**:
   ```bash
   cd ../FrontEnd
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Tạo file .env.development**:
   ```bash
   echo "VITE_API_URL=http://localhost:8080/api
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_IMAGE_FALLBACK_URL=/dummy.png" > .env.development
   ```

4. **Chạy ứng dụng**:
   ```bash
   npm run dev
   ```
   Ứng dụng frontend sẽ chạy tại địa chỉ: [http://localhost:5173](http://localhost:5173)

5. **Build cho production** (tùy chọn):
   ```bash
   npm run build
   ```
   Kết quả build sẽ nằm trong thư mục `dist`
</details>

<details>
<summary><h3>🧪 Chạy kiểm thử</h3></summary>

#### Backend Tests
```bash
cd BackEnd
./mvnw test
```

#### Frontend Tests
```bash
cd FrontEnd
npm run test
```

#### E2E Tests
```bash
cd FrontEnd
npm run test:e2e
```
</details>

<details>
<summary><h3>⚙️ Cấu hình môi trường</h3></summary>

NatureGrain hỗ trợ các môi trường sau:

- **Development**: Môi trường phát triển local
- **Testing**: Môi trường kiểm thử
- **Staging**: Môi trường kiểm tra trước khi triển khai
- **Production**: Môi trường triển khai chính thức

Để chuyển đổi giữa các môi trường:

**Backend**: Sử dụng biến môi trường `SPRING_PROFILES_ACTIVE`
```bash
# Windows
set SPRING_PROFILES_ACTIVE=dev
./mvnw spring-boot:run

# Linux/macOS
export SPRING_PROFILES_ACTIVE=dev
./mvnw spring-boot:run
```

**Frontend**: Sử dụng file .env tương ứng
```bash
# Development
npm run dev

# Production build
npm run build
```
</details>

## 📂 Cấu trúc dự án

<details open>
<summary><h3>🖥️ Frontend Structure</h3></summary>

```
FrontEnd/
├── public/                # Tài nguyên tĩnh
│   ├── Naturegrain.png    # Logo chính
│   ├── dummy.png          # Hình ảnh placeholder
│   └── vite.svg           # Logo Vite
├── src/
│   ├── assets/            # Tài nguyên dùng trong ứng dụng
│   │   ├── images/        # Hình ảnh và icons
│   │   └── styles/        # CSS và style modules
│   ├── components/        # Components tái sử dụng
│   │   ├── admin/         # Components cho trang quản trị
│   │   │   ├── dashboard/ # Dashboard widgets
│   │   │   ├── product/   # Product management
│   │   │   └── user/      # User management
│   │   ├── layout/        # Layout components
│   │   │   ├── Header.jsx # Header component
│   │   │   ├── Footer.jsx # Footer component
│   │   │   └── Sidebar.jsx# Sidebar for admin
│   │   └── ui/            # UI components
│   │       ├── buttons/   # Button components
│   │       ├── cards/     # Card components
│   │       ├── forms/     # Form elements
│   │       ├── loaders/   # Loading indicators
│   │       └── modals/    # Modal dialogs
│   ├── context/           # React Context API
│   │   ├── AuthContext.jsx# Authentication context
│   │   └── CartContext.jsx# Shopping cart context
│   ├── hooks/             # Custom React hooks
│   │   ├── useCachedFetch.js # API caching hook
│   │   ├── useError.js    # Error handling
│   │   ├── useForm.js     # Form handling
│   │   └── useLocalStorage.js # Local storage
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── auth/          # Auth pages
│   │   ├── user/          # User pages
│   │   ├── HomePage.jsx   # Homepage
│   │   ├── ProductsPage.jsx # Products listing
│   │   └── ProductDetailPage.jsx # Product detail
│   ├── services/          # API services
│   │   ├── api.js         # Base API config
│   │   ├── authService.js # Auth services
│   │   └── productService.js # Product services
│   ├── utils/             # Utility functions
│   │   ├── imageUtils.js  # Image processing
│   │   ├── imageTests.js  # Image testing
│   │   ├── formatters.js  # Data formatting
│   │   └── validators.js  # Data validation
│   ├── App.jsx            # Main App component
│   └── main.jsx           # Entry point
├── .env                   # Base environment vars
├── .env.development       # Dev environment vars
├── .env.production        # Production environment vars
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration
```
</details>

<details open>
<summary><h3>⚙️ Backend Structure</h3></summary>

```
BackEnd/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── naturegrain/
│   │   │           ├── config/           # Cấu hình
│   │   │           │   ├── CloudinaryConfig.java
│   │   │           │   ├── DotenvConfig.java
│   │   │           │   ├── WebSecurityConfig.java
│   │   │           │   └── SwaggerConfig.java
│   │   │           ├── controller/       # REST Controllers
│   │   │           │   ├── admin/        # Admin controllers
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── ProductController.java
│   │   │           │   └── OrderController.java
│   │   │           ├── entity/           # Database entities
│   │   │           │   ├── Product.java
│   │   │           │   ├── User.java
│   │   │           │   ├── Order.java
│   │   │           │   └── Category.java
│   │   │           ├── exception/        # Exception handling
│   │   │           │   ├── GlobalExceptionHandler.java
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   └── ApiException.java
│   │   │           ├── model/            # DTOs and models
│   │   │           │   ├── request/      # Request objects
│   │   │           │   ├── response/     # Response objects
│   │   │           │   └── dto/          # Data Transfer Objects
│   │   │           ├── repository/       # JPA Repositories
│   │   │           │   ├── ProductRepository.java
│   │   │           │   ├── UserRepository.java
│   │   │           │   └── OrderRepository.java
│   │   │           ├── security/         # Security components
│   │   │           │   ├── jwt/          # JWT implementation
│   │   │           │   ├── services/     # Security services
│   │   │           │   └── WebSecurityConfig.java
│   │   │           └── service/          # Business logic
│   │   │               ├── ProductService.java
│   │   │               ├── UserService.java
│   │   │               ├── OrderService.java
│   │   │               └── CloudinaryService.java
│   │   └── resources/
│   │       ├── application.properties    # Cấu hình chung
│   │       ├── config/                   # Cấu hình theo môi trường
│   │       │   ├── application-dev.properties
│   │       │   ├── application-prod.properties
│   │       │   └── application-test.properties
│   │       └── static/                   # Static resources
│   └── test/                             # Unit & integration tests
│       └── java/
│           └── com/
│               └── naturegrain/
│                   ├── controller/
│                   ├── service/
│                   └── repository/
├── .env                                 # Environment variables
├── mvnw                                 # Maven wrapper (Unix)
├── mvnw.cmd                             # Maven wrapper (Windows)
├── pom.xml                              # Maven dependencies
├── naturegrain.sql                      # Database schema
└── Dockerfile                           # Docker configuration
```
</details>

<details>
<summary><h3>🔄 DevOps Structure</h3></summary>

```
NatureGrain/
├── docker-compose.yml                  # Docker Compose configuration 
├── DEPLOYMENT.md                       # Hướng dẫn triển khai
├── .dockerignore                       # Files to ignore in Docker context
├── FrontEnd/
│   └── Dockerfile                      # Frontend Docker configuration
└── BackEnd/
    └── Dockerfile                      # Backend Docker configuration
```
</details>

## 🛡️ Bảo mật & Hiệu suất

<details open>
<summary><h3>🔒 Tính năng bảo mật</h3></summary>

| Tính năng | Mô tả | Thực thi |
|-----------|-------|----------|
| **JWT Authentication** | Xác thực người dùng bằng JSON Web Tokens | Spring Security + Frontend Auth Context |
| **CORS Protection** | Bảo vệ khỏi Cross-Origin Resource Sharing attacks | Spring Security Config + Headers |
| **Password Encryption** | Mã hóa mật khẩu một chiều với salt | BCrypt + Password Encoder |
| **Role-Based Access Control** | Phân quyền người dùng theo vai trò | Custom Authorities + Method Security |
| **Input Validation** | Kiểm tra và làm sạch đầu vào | Bean Validation + Content Filtering |
| **XSS Protection** | Ngăn chặn Cross-Site Scripting | Content Security Policy + Output Encoding |
| **CSRF Protection** | Ngăn chặn Cross-Site Request Forgery | CSRF Tokens + SameSite Cookies |
| **Rate Limiting** | Giới hạn số lượng request | IP-based + User-based Throttling |
| **Secure Cookies** | Bảo vệ thông tin phiên | HttpOnly + Secure Flags |
| **Environment Variables** | Bảo mật thông tin nhạy cảm | Dotenv + Config Server |
| **Cloudinary Security** | Bảo vệ tài sản media | Signed URLs + Asset Transformations |
</details>

<details open>
<summary><h3>⚡ Tối ưu hiệu suất</h3></summary>

#### Frontend Optimizations
- **API Response Caching**: Lưu trữ tạm thời kết quả API để giảm số lượng request
- **Code Splitting**: Chia nhỏ JavaScript bundle để tải theo nhu cầu
- **Component Lazy Loading**: Chỉ tải các component khi cần thiết
- **Image Optimization**: 
  - Progressive Loading (blur-up technique)
  - Responsive sizes với srcset
  - WebP format với fallback
  - Cloudinary transformations
- **Retry Mechanism**: Tự động thử lại các API calls thất bại
- **Debounce & Throttle**: Tối ưu các event handlers
- **React.memo & useMemo**: Tránh render lại không cần thiết
- **Error Boundaries**: Ngăn chặn crash toàn ứng dụng do lỗi component
- **Web Vitals Monitoring**: Theo dõi Core Web Vitals

#### Backend Optimizations
- **Database Indexing**: Indexes tối ưu cho truy vấn phổ biến
- **Query Optimization**: Tối ưu JPQL/HQL cho các truy vấn phức tạp
- **Connection Pooling**: HikariCP để quản lý kết nối database
- **Caching Layer**: 
  - Second-level cache với Hibernate
  - Method-level caching với Spring Cache
- **Pagination & Infinite Scrolling**: Tải dữ liệu theo trang cho danh sách lớn
- **Asynchronous Processing**: Xử lý bất đồng bộ cho các tác vụ nặng
- **Resource Compression**: GZIP/Brotli compression cho responses
- **Content Delivery Network**: Sử dụng Cloudinary CDN cho assets

#### DevOps Optimizations
- **Container Optimization**: Multi-stage builds để giảm image size
- **Resource Allocation**: Cấu hình tài nguyên phù hợp cho containers
- **Load Balancing**: Phân phối tải giữa nhiều instances
- **Health Checks**: Giám sát tình trạng ứng dụng
</details>

## 📚 Tài liệu & tài nguyên

<details>
<summary><h3>📜 Tài liệu API</h3></summary>

API Documentation được tạo tự động bằng Swagger/OpenAPI và có sẵn tại các địa chỉ sau khi chạy backend:

- **Swagger UI**: [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)
- **OpenAPI Spec**: [http://localhost:8080/api/v3/api-docs](http://localhost:8080/api/v3/api-docs)

Danh mục các API chính:
- **Auth**: `/api/auth/*` - Đăng ký, đăng nhập, refresh token
- **Products**: `/api/product/*` - CRUD sản phẩm, tìm kiếm, lọc
- **Categories**: `/api/category/*` - Quản lý danh mục
- **Orders**: `/api/order/*` - Đặt hàng, theo dõi đơn hàng
- **Users**: `/api/user/*` - Quản lý người dùng, phân quyền
- **File Upload**: `/api/cloudinary/*` - Tải lên và quản lý hình ảnh
- **Dashboard**: `/api/dashboard/*` - Số liệu thống kê, báo cáo
- **Analytics**: `/api/analytics/*` - Phân tích dữ liệu nâng cao

Chi tiết API có trong [Postman_API_Guide.md](Postman_API_Guide.md).
</details>

<details>
<summary><h3>📦 Hướng dẫn triển khai</h3></summary>

Xem chi tiết trong [DEPLOYMENT.md](DEPLOYMENT.md) để biết cách:

- Triển khai trên các môi trường khác nhau (Development, Staging, Production)
- Cấu hình CI/CD pipeline
- Monitoring và logging
- Backup và restore dữ liệu
- Scaling ứng dụng
</details>

<details>
<summary><h3>🧩 Kiến trúc hệ thống</h3></summary>

**NatureGrain** sử dụng kiến trúc microservices-inspired với frontend và backend tách biệt:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Browser   │────▶│   Frontend  │────▶│     Backend     │
│    User     │◀────│   (React)   │◀────│  (Spring Boot)  │
└─────────────┘     └─────────────┘     └────────┬────────┘
                                                 │
                                        ┌────────▼────────┐
                                        │    Database     │
                                        │    (MariaDB)    │
                                        └─────────────────┘
                                                 │
                                        ┌────────▼────────┐
                                        │   File Storage  │
                                        │   (Cloudinary)  │
                                        └─────────────────┘
```

**Security Flow**:
```
  User
   │
   ▼
┌─────────────┐   (1) Login Request   ┌─────────────┐
│   Frontend  │───────────────────────▶│   Backend   │
│             │◀───────────────────────│             │
└─────────────┘   (2) JWT Token       └─────────────┘
   │                                        │
   │  (3) Store Token                       │ (4) Verify Token
   ▼                                        ▼
┌─────────────┐   (5) API Request    ┌─────────────┐
│  Frontend   │───────────────────────▶│  Backend    │
│  with Token │◀───────────────────────│             │
└─────────────┘   (6) Protected Data   └─────────────┘
```
</details>

## 🔄 Lộ trình phát triển

| Phiên bản | Trạng thái | Tính năng chính |
|-----------|------------|-----------------|
| v1.0.0    | ✅ Hoàn thành | Core e-commerce, hệ thống sản phẩm, giỏ hàng, đơn hàng |
| v1.1.0    | ✅ Hoàn thành | Blog, quản lý hình ảnh Cloudinary, dashboard quản trị |
| v1.2.0    | ✅ Hoàn thành | Phân tích dữ liệu nâng cao, tối ưu hiệu suất |
| v1.3.0    | 🔄 Đang phát triển | Tích hợp thanh toán trực tuyến, thông báo real-time |
| v1.4.0    | 📅 Dự kiến Q3/2025 | App mobile, Progressive Web App (PWA) |
| v2.0.0    | 📅 Dự kiến Q4/2025 | Recommendation engine, personalization |

## 👥 Tác giả

- **Nguyễn Trần Gia Sĩ** - [GitHub Profile](https://github.com/giasinguyen)

## 📞 Liên hệ & Hỗ trợ

Nếu bạn có câu hỏi hoặc cần hỗ trợ:
- **Email**: giasinguyentran@gmail.com.com
- **Website**: [naturegrain.example.com](https://naturegrain.com)
- **Báo cáo lỗi**: [GitHub Issues](https://github.com/giasinguyen/NatureGrain/issues)

## 🙏 Ghi nhận

- Dự án này lấy cảm hứng từ các cửa hàng thực phẩm hữu cơ hàng đầu
- Sử dụng nhiều thư viện và công cụ mã nguồn mở:
  - [React](https://reactjs.org/)
  - [Spring Boot](https://spring.io/projects/spring-boot)
  - [Vite](https://vitejs.dev/)
  - [MariaDB](https://mariadb.org/)
  - [Docker](https://www.docker.com/)
  - [Cloudinary](https://cloudinary.com/)
- Cảm ơn cộng đồng phát triển vì tất cả các tài nguyên và hướng dẫn hữu ích