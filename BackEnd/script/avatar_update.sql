-- Chỉnh sửa cấu trúc bảng để lưu trữ avatar dưới dạng Base64
ALTER TABLE user MODIFY COLUMN avatar LONGTEXT COMMENT 'Stores Base64-encoded avatar data or URL';

-- Xóa hoặc sửa các cột không cần thiết
ALTER TABLE user DROP COLUMN avatar_data;
ALTER TABLE user DROP COLUMN avatar_content_type;

-- Một số người dùng mẫu với avatar
INSERT INTO user (username, email, password, firstname, lastname, country, state, address, phone, avatar, enabled)
VALUES 
('testuser', 'test@example.com', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', 
 'Nguyễn', 'Văn A', 'Vietnam', 'Hà Nội', '123 Đường ABC, Quận X', '0912345678',
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 
 true);

-- Gán vai trò user thông thường
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM user u, role r
WHERE u.username = 'testuser' AND r.name = 'ROLE_USER';
