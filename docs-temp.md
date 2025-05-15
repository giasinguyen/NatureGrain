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
