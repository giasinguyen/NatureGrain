-- Nguyễn Trần Gia Sĩ
-- Script cập nhật user để thêm trường create_at

-- Kiểm tra xem cột create_at đã tồn tại trong bảng user chưa
SET @exists = 0;
SELECT COUNT(*) INTO @exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'create_at';

-- Nếu cột chưa tồn tại thì thêm vào
SET @query = IF(@exists = 0, 
    'ALTER TABLE user ADD COLUMN create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'SELECT "Column create_at already exists"');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cập nhật thời gian tạo ngẫu nhiên cho các user hiện có để có dữ liệu phân tích hợp lý
UPDATE user 
SET create_at = TIMESTAMPADD(
    DAY, 
    -FLOOR(RAND() * 180), -- Ngẫu nhiên từ 0 đến 180 ngày trước
    NOW()
)
WHERE create_at IS NULL;
