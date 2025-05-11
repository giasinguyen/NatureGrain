-- Nguyễn Trần Gia Sĩ
-- Script tạo thêm dữ liệu mẫu để demo Analytics

-- Tạo thêm một số sản phẩm
INSERT IGNORE INTO product (name, description, price, quantity, category_id) VALUES 
('Rau Cải Hữu Cơ', 'Rau cải hữu cơ tươi ngon, trồng không sử dụng thuốc trừ sâu', 35000, 100, 1),
('Cà Rốt Hữu Cơ', 'Cà rốt hữu cơ giàu vitamin A', 25000, 80, 1),
('Táo Đỏ Hữu Cơ', 'Táo đỏ ngọt, giòn, không thuốc trừ sâu', 45000, 120, 2),
('Cam Hữu Cơ', 'Cam Valencia hữu cơ, mọng nước', 50000, 90, 2),
('Gạo Lứt Hữu Cơ', 'Gạo lứt giàu dinh dưỡng, trồng theo phương pháp hữu cơ', 85000, 50, 3),
('Yến Mạch Hữu Cơ', 'Yến mạch nguyên hạt, không chất bảo quản', 65000, 60, 3),
('Ổi Hữu Cơ', 'Ổi tươi hữu cơ, giàu vitamin C', 40000, 70, 2),
('Hạt Chia Hữu Cơ', 'Hạt chia giàu omega-3', 95000, 40, 3),
('Chanh Hữu Cơ', 'Chanh tươi hữu cơ', 30000, 110, 2),
('Khoai Lang Hữu Cơ', 'Khoai lang hữu cơ giàu vitamin', 28000, 85, 1);

-- Tạo thêm một số người dùng
INSERT IGNORE INTO user (username, email, firstname, lastname, password, country, state, address, phone, enabled) VALUES
('customer1', 'customer1@example.com', 'Nguyễn', 'Văn A', '$2a$10$NXwYoEZ98rUxkgbj0lH1aOrGxg9pZXULFUfNJTZqX.ZVL2FAhVMxi', 'Việt Nam', 'Hồ Chí Minh', '123 Nguyễn Du', '0901234567', TRUE),
('customer2', 'customer2@example.com', 'Trần', 'Thị B', '$2a$10$NXwYoEZ98rUxkgbj0lH1aOrGxg9pZXULFUfNJTZqX.ZVL2FAhVMxi', 'Việt Nam', 'Hà Nội', '456 Lê Lợi', '0912345678', TRUE),
('customer3', 'customer3@example.com', 'Lê', 'Văn C', '$2a$10$NXwYoEZ98rUxkgbj0lH1aOrGxg9pZXULFUfNJTZqX.ZVL2FAhVMxi', 'Việt Nam', 'Đà Nẵng', '789 Trần Phú', '0923456789', TRUE),
('customer4', 'customer4@example.com', 'Phạm', 'Thị D', '$2a$10$NXwYoEZ98rUxkgbj0lH1aOrGxg9pZXULFUfNJTZqX.ZVL2FAhVMxi', 'Việt Nam', 'Cần Thơ', '101 Hai Bà Trưng', '0934567890', TRUE),
('customer5', 'customer5@example.com', 'Hoàng', 'Văn E', '$2a$10$NXwYoEZ98rUxkgbj0lH1aOrGxg9pZXULFUfNJTZqX.ZVL2FAhVMxi', 'Việt Nam', 'Huế', '202 Lê Duẩn', '0945678901', TRUE);

-- Gán role người dùng cho các tài khoản mới
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, (SELECT id FROM role WHERE name = 'ROLE_USER')
FROM user u
WHERE u.username IN ('customer1', 'customer2', 'customer3', 'customer4', 'customer5')
AND NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = (SELECT id FROM role WHERE name = 'ROLE_USER')
);

-- Tạo thêm đơn hàng và chi tiết đơn hàng để có dữ liệu phong phú cho analytics
-- Tạo đơn hàng cho customer1
INSERT IGNORE INTO orders (firstname, lastname, country, address, town, state, postcode, email, phone, note, total_price, status, user_id, create_at)
VALUES 
('Nguyễn', 'Văn A', 'Việt Nam', '123 Nguyễn Du', 'Quận 1', 'Hồ Chí Minh', '70000', 'customer1@example.com', '0901234567', 'Giao buổi sáng', 105000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer1'), DATE_SUB(NOW(), INTERVAL 30 DAY)),
('Nguyễn', 'Văn A', 'Việt Nam', '123 Nguyễn Du', 'Quận 1', 'Hồ Chí Minh', '70000', 'customer1@example.com', '0901234567', '', 75000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer1'), DATE_SUB(NOW(), INTERVAL 15 DAY)),
('Nguyễn', 'Văn A', 'Việt Nam', '123 Nguyễn Du', 'Quận 1', 'Hồ Chí Minh', '70000', 'customer1@example.com', '0901234567', '', 180000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer1'), DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Tạo đơn hàng cho customer2
INSERT IGNORE INTO orders (firstname, lastname, country, address, town, state, postcode, email, phone, note, total_price, status, user_id, create_at)
VALUES 
('Trần', 'Thị B', 'Việt Nam', '456 Lê Lợi', 'Ba Đình', 'Hà Nội', '10000', 'customer2@example.com', '0912345678', '', 50000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer2'), DATE_SUB(NOW(), INTERVAL 25 DAY)),
('Trần', 'Thị B', 'Việt Nam', '456 Lê Lợi', 'Ba Đình', 'Hà Nội', '10000', 'customer2@example.com', '0912345678', 'Giao giờ hành chính', 85000, 'PENDING', (SELECT id FROM user WHERE username = 'customer2'), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Tạo đơn hàng cho customer3
INSERT IGNORE INTO orders (firstname, lastname, country, address, town, state, postcode, email, phone, note, total_price, status, user_id, create_at)
VALUES 
('Lê', 'Văn C', 'Việt Nam', '789 Trần Phú', 'Hải Châu', 'Đà Nẵng', '50000', 'customer3@example.com', '0923456789', '', 65000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer3'), DATE_SUB(NOW(), INTERVAL 20 DAY)),
('Lê', 'Văn C', 'Việt Nam', '789 Trần Phú', 'Hải Châu', 'Đà Nẵng', '50000', 'customer3@example.com', '0923456789', '', 95000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer3'), DATE_SUB(NOW(), INTERVAL 10 DAY)),
('Lê', 'Văn C', 'Việt Nam', '789 Trần Phú', 'Hải Châu', 'Đà Nẵng', '50000', 'customer3@example.com', '0923456789', 'Gọi trước khi giao', 70000, 'PROCESSING', (SELECT id FROM user WHERE username = 'customer3'), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Tạo đơn hàng cho customer4
INSERT IGNORE INTO orders (firstname, lastname, country, address, town, state, postcode, email, phone, note, total_price, status, user_id, create_at)
VALUES 
('Phạm', 'Thị D', 'Việt Nam', '101 Hai Bà Trưng', 'Ninh Kiều', 'Cần Thơ', '90000', 'customer4@example.com', '0934567890', '', 113000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer4'), DATE_SUB(NOW(), INTERVAL 12 DAY));

-- Thêm chi tiết đơn hàng để phân tích sản phẩm bán chạy
-- Lấy ID của đơn hàng đầu tiên của customer1
SET @order1_id = (SELECT id FROM orders WHERE user_id = (SELECT id FROM user WHERE username = 'customer1') ORDER BY id LIMIT 1);
-- Thêm chi tiết đơn hàng
INSERT IGNORE INTO order_details (product_id, order_id, quantity, price)
VALUES 
((SELECT id FROM product WHERE name = 'Rau Cải Hữu Cơ'), @order1_id, 2, 35000),
((SELECT id FROM product WHERE name = 'Cam Hữu Cơ'), @order1_id, 1, 50000);

-- Lấy ID của đơn hàng thứ hai của customer1
SET @order2_id = (SELECT id FROM orders WHERE user_id = (SELECT id FROM user WHERE username = 'customer1') ORDER BY id LIMIT 1, 1);
-- Thêm chi tiết đơn hàng
INSERT IGNORE INTO order_details (product_id, order_id, quantity, price)
VALUES 
((SELECT id FROM product WHERE name = 'Cà Rốt Hữu Cơ'), @order2_id, 3, 25000);

-- Lấy ID của đơn hàng thứ ba của customer1
SET @order3_id = (SELECT id FROM orders WHERE user_id = (SELECT id FROM user WHERE username = 'customer1') ORDER BY id LIMIT 2, 1);
-- Thêm chi tiết đơn hàng
INSERT IGNORE INTO order_details (product_id, order_id, quantity, price)
VALUES 
((SELECT id FROM product WHERE name = 'Gạo Lứt Hữu Cơ'), @order3_id, 2, 85000),
((SELECT id FROM product WHERE name = 'Chanh Hữu Cơ'), @order3_id, 1, 30000);

-- Tương tự cho các đơn hàng khác
-- Đơn hàng của customer2
SET @order4_id = (SELECT id FROM orders WHERE user_id = (SELECT id FROM user WHERE username = 'customer2') ORDER BY id LIMIT 1);
INSERT IGNORE INTO order_details (product_id, order_id, quantity, price)
VALUES 
((SELECT id FROM product WHERE name = 'Cam Hữu Cơ'), @order4_id, 1, 50000);

SET @order5_id = (SELECT id FROM orders WHERE user_id = (SELECT id FROM user WHERE username = 'customer2') ORDER BY id LIMIT 1, 1);
INSERT IGNORE INTO order_details (product_id, order_id, quantity, price)
VALUES 
((SELECT id FROM product WHERE name = 'Gạo Lứt Hữu Cơ'), @order5_id, 1, 85000);

-- Đơn hàng của customer3
SET @order6_id = (SELECT id FROM orders WHERE user_id = (SELECT id FROM user WHERE username = 'customer3') ORDER BY id LIMIT 1);
INSERT IGNORE INTO order_details (product_id, order_id, quantity, price)
VALUES 
((SELECT id FROM product WHERE name = 'Yến Mạch Hữu Cơ'), @order6_id, 1, 65000);

SET @order7_id = (SELECT id FROM orders WHERE user_id = (SELECT id FROM user WHERE username = 'customer3') ORDER BY id LIMIT 1, 1);
INSERT IGNORE INTO order_details (product_id, order_id, quantity, price)
VALUES 
((SELECT id FROM product WHERE name = 'Hạt Chia Hữu Cơ'), @order7_id, 1, 95000);

SET @order8_id = (SELECT id FROM orders WHERE user_id = (SELECT id FROM user WHERE username = 'customer3') ORDER BY id LIMIT 2, 1);
INSERT IGNORE INTO order_details (product_id, order_id, quantity, price)
VALUES 
((SELECT id FROM product WHERE name = 'Ổi Hữu Cơ'), @order8_id, 1, 40000),
((SELECT id FROM product WHERE name = 'Khoai Lang Hữu Cơ'), @order8_id, 1, 28000);

-- Đơn hàng của customer4
SET @order9_id = (SELECT id FROM orders WHERE user_id = (SELECT id FROM user WHERE username = 'customer4') ORDER BY id LIMIT 1);
INSERT IGNORE INTO order_details (product_id, order_id, quantity, price)
VALUES 
((SELECT id FROM product WHERE name = 'Táo Đỏ Hữu Cơ'), @order9_id, 1, 45000),
((SELECT id FROM product WHERE name = 'Gạo Lứt Hữu Cơ'), @order9_id, 1, 68000);

-- Tạo thêm một số đơn hàng khác với các khoảng thời gian khác nhau để phân tích doanh số theo thời gian
-- Đơn hàng trong tuần trước
INSERT IGNORE INTO orders (firstname, lastname, country, address, town, state, postcode, email, phone, note, total_price, status, user_id, create_at)
VALUES 
('Nguyễn', 'Văn A', 'Việt Nam', '123 Nguyễn Du', 'Quận 1', 'Hồ Chí Minh', '70000', 'customer1@example.com', '0901234567', '', 50000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer1'), DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Trần', 'Thị B', 'Việt Nam', '456 Lê Lợi', 'Ba Đình', 'Hà Nội', '10000', 'customer2@example.com', '0912345678', '', 85000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer2'), DATE_SUB(NOW(), INTERVAL 6 DAY)),
('Lê', 'Văn C', 'Việt Nam', '789 Trần Phú', 'Hải Châu', 'Đà Nẵng', '50000', 'customer3@example.com', '0923456789', '', 45000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer3'), DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Phạm', 'Thị D', 'Việt Nam', '101 Hai Bà Trưng', 'Ninh Kiều', 'Cần Thơ', '90000', 'customer4@example.com', '0934567890', '', 95000, 'COMPLETED', (SELECT id FROM user WHERE username = 'customer4'), DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Thêm vài đơn hàng bị hủy hoặc hoàn tiền để có đủ trạng thái
INSERT IGNORE INTO orders (firstname, lastname, country, address, town, state, postcode, email, phone, note, total_price, status, user_id, create_at)
VALUES 
('Nguyễn', 'Văn A', 'Việt Nam', '123 Nguyễn Du', 'Quận 1', 'Hồ Chí Minh', '70000', 'customer1@example.com', '0901234567', 'Đã hủy vì hết hàng', 65000, 'CANCELLED', (SELECT id FROM user WHERE username = 'customer1'), DATE_SUB(NOW(), INTERVAL 18 DAY)),
('Lê', 'Văn C', 'Việt Nam', '789 Trần Phú', 'Hải Châu', 'Đà Nẵng', '50000', 'customer3@example.com', '0923456789', 'Yêu cầu hoàn tiền', 95000, 'REFUNDED', (SELECT id FROM user WHERE username = 'customer3'), DATE_SUB(NOW(), INTERVAL 22 DAY));

-- Thêm một số đơn hàng đang giao
INSERT IGNORE INTO orders (firstname, lastname, country, address, town, state, postcode, email, phone, note, total_price, status, user_id, create_at)
VALUES 
('Hoàng', 'Văn E', 'Việt Nam', '202 Lê Duẩn', 'Phú Nhuận', 'Huế', '49000', 'customer5@example.com', '0945678901', '', 78000, 'SHIPPED', (SELECT id FROM user WHERE username = 'customer5'), DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Phạm', 'Thị D', 'Việt Nam', '101 Hai Bà Trưng', 'Ninh Kiều', 'Cần Thơ', '90000', 'customer4@example.com', '0934567890', '', 120000, 'SHIPPED', (SELECT id FROM user WHERE username = 'customer4'), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Đặt thời gian tạo cho các đơn hàng theo khoảng thời gian khác nhau để phân bố đều
UPDATE orders 
SET create_at = CASE 
    WHEN id % 4 = 0 THEN DATE_SUB(create_at, INTERVAL FLOOR(RAND() * 30) DAY)
    WHEN id % 4 = 1 THEN DATE_SUB(create_at, INTERVAL FLOOR(RAND() * 20) DAY)
    WHEN id % 4 = 2 THEN DATE_SUB(create_at, INTERVAL FLOOR(RAND() * 10) DAY)
    ELSE create_at
END
WHERE create_at IS NOT NULL;
