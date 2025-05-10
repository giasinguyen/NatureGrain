## Cấu hình biến môi trường

NatureGrain sử dụng biến môi trường để cấu hình các thông số quan trọng của ứng dụng. Bạn cần tạo file `.env` trong thư mục gốc của dự án trước khi chạy Docker Compose.

### File `.env`

Sao chép từ file `.env.example`:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` với thông tin của bạn:

```env
# Database Configuration
DB_PORT=3306
DB_ROOT_PASSWORD=password_mạnh_của_bạn
DB_DATABASE=naturegrain
DB_USER=naturegrain_user
DB_PASSWORD=password_mạnh_khác

# Spring Boot Configuration
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=secret_key_jwt_an_toàn_và_phức_tạp

# Web Server Ports
FRONTEND_PORT=80
BACKEND_PORT=8080
```

### Biến môi trường quan trọng

- `DB_ROOT_PASSWORD`: Mật khẩu root của MariaDB
- `DB_DATABASE`: Tên database
- `DB_USER`: Tên người dùng database
- `DB_PASSWORD`: Mật khẩu người dùng database
- `JWT_SECRET`: Khóa bí mật sử dụng để ký JWT tokens
- `FRONTEND_PORT`: Cổng chạy frontend
- `BACKEND_PORT`: Cổng chạy backend API

