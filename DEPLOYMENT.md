# Hướng dẫn triển khai NatureGrain

## Triển khai với Docker Compose

### Yêu cầu
- Docker
- Docker Compose

### Các bước triển khai

1. **Clone dự án và chuyển đến thư mục gốc:**
   ```bash
   git clone https://github.com/giasinguyen/naturegrain
   cd naturegrain
   ```

2. **Tạo biến môi trường cho JWT secret (không bắt buộc nếu sử dụng mặc định):**
   ```bash
   echo "JWT_SECRET=your_secure_jwt_secret" > .env
   ```

3. **Xây dựng và chạy các containers:**
   ```bash
   docker-compose up -d
   ```

4. **Kiểm tra các containers đang chạy:**
   ```bash
   docker-compose ps
   ```

5. **Truy cập ứng dụng:**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api

6. **Dừng ứng dụng:**
   ```bash
   docker-compose down
   ```

7. **Xóa hoàn toàn dữ liệu (kể cả database):**
   ```bash
   docker-compose down -v
   ```

## Cấu hình môi trường

- **Frontend**: Cấu hình trong các file `.env.*`
  - `.env.development`: Môi trường phát triển
  - `.env.production`: Môi trường sản xuất

- **Backend**: Cấu hình trong các file `application-*.properties`
  - `application-dev.properties`: Môi trường phát triển
  - `application-prod.properties`: Môi trường sản xuất

## Giám sát và Quản lý

### Hiển thị logs

```bash
# Xem logs của tất cả services
docker-compose logs

# Xem logs của một service cụ thể (backend, frontend hoặc db)
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Theo dõi logs theo thời gian thực
docker-compose logs -f
```

### Khởi động lại một service

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
```

### Scale một service (nếu cần)

```bash
docker-compose up -d --scale backend=2
```

## Sao lưu và Phục hồi Database

### Sao lưu database

```bash
docker exec naturegrain_mariadb mysqldump -u root -padmin naturegrain > backup_$(date +%Y%m%d).sql
```

### Phục hồi database

```bash
cat backup_file.sql | docker exec -i naturegrain_mariadb mysql -u root -padmin naturegrain
```
