-- Advanced Analytics SQL Script for NatureGrain E-commerce Platform
-- Các truy vấn SQL nâng cao cho phân tích dữ liệu

-- 1. Phân tích RFM (Recency, Frequency, Monetary) cho khách hàng
-- R: Thời gian mua hàng gần nhất (gần đây nhất khách hàng mua)
-- F: Tần suất mua hàng (khách hàng mua bao nhiêu lần)
-- M: Giá trị tiền (khách hàng đã chi bao nhiêu)
SELECT 
    u.id,
    u.username,
    u.email,
    DATEDIFF(CURRENT_DATE, MAX(o.create_at)) as recency_days,
    COUNT(DISTINCT o.id) as frequency,
    SUM(o.total_price) as monetary_value,
    CASE 
        WHEN DATEDIFF(CURRENT_DATE, MAX(o.create_at)) <= 30 THEN 'Active'
        WHEN DATEDIFF(CURRENT_DATE, MAX(o.create_at)) <= 90 THEN 'Recent'
        WHEN DATEDIFF(CURRENT_DATE, MAX(o.create_at)) <= 180 THEN 'Lapsed'
        ELSE 'Inactive'
    END as customer_segment
FROM 
    user u
JOIN 
    orders o ON u.id = o.user_id
GROUP BY 
    u.id, u.username, u.email
ORDER BY 
    monetary_value DESC;

-- 2. Phân tích giỏ hàng (Basket Analysis) - Các sản phẩm thường được mua cùng nhau
SELECT 
    p1.id as product1_id,
    p1.name as product1_name,
    p2.id as product2_id,
    p2.name as product2_name,
    COUNT(*) as pair_frequency,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders) as pair_percentage
FROM 
    order_details od1
JOIN 
    order_details od2 ON od1.order_id = od2.order_id AND od1.product_id < od2.product_id
JOIN 
    product p1 ON od1.product_id = p1.id
JOIN 
    product p2 ON od2.product_id = p2.id
GROUP BY 
    product1_id, product1_name, product2_id, product2_name
HAVING 
    COUNT(*) > 2
ORDER BY 
    pair_frequency DESC
LIMIT 20;

-- 3. Phân tích chuyển đổi theo nguồn lưu lượng (nếu có ghi nhận nguồn)
-- Giả sử có bảng user_session với thông tin referrer, conversion
-- SELECT 
--     referrer_source,
--     COUNT(DISTINCT session_id) as total_sessions,
--     COUNT(DISTINCT CASE WHEN converted = 1 THEN session_id END) as converted_sessions,
--     COUNT(DISTINCT CASE WHEN converted = 1 THEN session_id END) * 100.0 / COUNT(DISTINCT session_id) as conversion_rate
-- FROM 
--     user_sessions
-- GROUP BY 
--     referrer_source
-- ORDER BY 
--     conversion_rate DESC;

-- 4. Phân tích chuyển đổi theo phễu (Funnel Analysis)
SELECT 
    'Tổng số tài khoản' as stage,
    COUNT(DISTINCT u.id) as count,
    100 as percentage
FROM 
    user u
UNION ALL
SELECT 
    'Đã thêm sản phẩm vào giỏ hàng' as stage,
    COUNT(DISTINCT o.user_id) as count,
    COUNT(DISTINCT o.user_id) * 100.0 / (SELECT COUNT(DISTINCT id) FROM user) as percentage
FROM 
    orders o
UNION ALL
SELECT 
    'Đã hoàn tất đơn hàng' as stage,
    COUNT(DISTINCT o.user_id) as count,
    COUNT(DISTINCT o.user_id) * 100.0 / (SELECT COUNT(DISTINCT id) FROM user) as percentage
FROM 
    orders o
WHERE 
    o.status = 'COMPLETED';

-- 5. Phân tích giá trị đơn hàng trung bình theo tháng
SELECT 
    DATE_FORMAT(o.create_at, '%Y-%m') as month,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.total_price) as total_revenue,
    AVG(o.total_price) as average_order_value
FROM 
    orders o
GROUP BY 
    month
ORDER BY 
    month;

-- 6. Phân tích hiệu suất danh mục sản phẩm
SELECT 
    c.name as category_name,
    COUNT(DISTINCT od.order_id) as order_count,
    SUM(od.quantity) as units_sold,
    SUM(od.price * od.quantity) as revenue,
    AVG(od.price) as average_price,
    SUM(od.price * od.quantity) / COUNT(DISTINCT od.order_id) as revenue_per_order
FROM 
    order_details od
JOIN 
    product p ON od.product_id = p.id
JOIN 
    category c ON p.category_id = c.id
GROUP BY 
    category_name
ORDER BY 
    revenue DESC;

-- 7. Phân tích thời gian trong ngày khi đơn hàng được đặt
SELECT 
    HOUR(o.create_at) as hour_of_day,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.total_price) as total_revenue,
    AVG(o.total_price) as average_order_value
FROM 
    orders o
GROUP BY 
    hour_of_day
ORDER BY 
    hour_of_day;

-- 8. Phân tích mức độ trung thành của khách hàng - số ngày trung bình giữa các lần mua hàng
WITH customer_orders AS (
    SELECT 
        user_id,
        create_at,
        LEAD(create_at) OVER (PARTITION BY user_id ORDER BY create_at) as next_order_date
    FROM 
        orders
)
SELECT 
    u.username,
    u.email,
    COUNT(o.id) as total_orders,
    AVG(DATEDIFF(co.next_order_date, co.create_at)) as avg_days_between_orders
FROM 
    user u
JOIN 
    orders o ON u.id = o.user_id
JOIN 
    customer_orders co ON o.user_id = co.user_id AND o.create_at = co.create_at
WHERE 
    co.next_order_date IS NOT NULL
GROUP BY 
    u.id, u.username, u.email
HAVING 
    COUNT(o.id) > 1
ORDER BY 
    avg_days_between_orders;

-- 9. Phân tích chi tiêu theo khoảng giá - phân phối khách hàng theo mức chi tiêu
SELECT 
    CASE
        WHEN lifetime_spend < 500000 THEN 'Dưới 500K'
        WHEN lifetime_spend BETWEEN 500000 AND 1000000 THEN '500K - 1M'
        WHEN lifetime_spend BETWEEN 1000001 AND 5000000 THEN '1M - 5M'
        ELSE 'Trên 5M'
    END as spending_tier,
    COUNT(user_id) as customer_count,
    SUM(lifetime_spend) as total_revenue,
    AVG(lifetime_spend) as average_spend
FROM (
    SELECT 
        o.user_id,
        SUM(o.total_price) as lifetime_spend
    FROM 
        orders o
    GROUP BY 
        o.user_id
) as customer_spending
GROUP BY 
    spending_tier
ORDER BY 
    MIN(lifetime_spend);

-- 10. Phân tích tỷ lệ hủy đơn hàng theo thời gian
SELECT 
    DATE_FORMAT(create_at, '%Y-%m') as month,
    COUNT(id) as total_orders,
    SUM(CASE WHEN status = 'CANCELED' THEN 1 ELSE 0 END) as canceled_orders,
    SUM(CASE WHEN status = 'CANCELED' THEN 1 ELSE 0 END) * 100.0 / COUNT(id) as cancel_rate
FROM 
    orders
GROUP BY 
    month
ORDER BY 
    month;

-- 11. Phân tích doanh thu theo tuần trong năm
SELECT 
    YEAR(create_at) as year,
    WEEK(create_at) as week_number,
    MIN(DATE(create_at)) as week_start_date,
    COUNT(id) as total_orders,
    SUM(total_price) as total_revenue
FROM 
    orders
WHERE 
    create_at >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)
GROUP BY 
    year, week_number
ORDER BY 
    year, week_number;

-- 12. Phân tích tác động của khuyến mãi lên doanh thu 
-- (giả sử có bảng promotion và promotion_usage)
-- SELECT 
--     p.name as promotion_name,
--     COUNT(DISTINCT o.id) as orders_with_promotion,
--     SUM(o.total_price) as total_revenue,
--     SUM(pu.discount_amount) as total_discount,
--     AVG(o.total_price) as average_order_value,
--     SUM(o.total_price) / SUM(pu.discount_amount) as roi
-- FROM 
--     orders o
-- JOIN 
--     promotion_usage pu ON o.id = pu.order_id
-- JOIN 
--     promotion p ON pu.promotion_id = p.id
-- GROUP BY 
--     p.id, p.name
-- ORDER BY 
--     roi DESC;

-- 13. Phân tích thời gian xử lý đơn hàng theo trạng thái
SELECT 
    status,
    COUNT(id) as order_count,
    AVG(TIMESTAMPDIFF(HOUR, create_at, update_at)) as avg_processing_hours,
    MIN(TIMESTAMPDIFF(HOUR, create_at, update_at)) as min_processing_hours,
    MAX(TIMESTAMPDIFF(HOUR, create_at, update_at)) as max_processing_hours
FROM 
    orders
WHERE 
    create_at IS NOT NULL 
    AND update_at IS NOT NULL
GROUP BY 
    status;

-- 14. Phân tích mức độ phổ biến của sản phẩm theo số lượng bình luận/đánh giá
-- (giả sử có bảng product_reviews)
-- SELECT 
--     p.id as product_id,
--     p.name as product_name,
--     COUNT(pr.id) as review_count,
--     AVG(pr.rating) as average_rating,
--     SUM(od.quantity) as units_sold
-- FROM 
--     product p
-- LEFT JOIN 
--     product_reviews pr ON p.id = pr.product_id
-- LEFT JOIN 
--     order_details od ON p.id = od.product_id
-- GROUP BY 
--     p.id, p.name
-- ORDER BY 
--     review_count DESC, average_rating DESC;

-- 15. Phân tích xu hướng mua hàng theo mùa
SELECT 
    YEAR(o.create_at) as year,
    QUARTER(o.create_at) as quarter,
    SUM(o.total_price) as total_revenue,
    COUNT(DISTINCT o.id) as order_count,
    COUNT(DISTINCT o.user_id) as unique_customers
FROM 
    orders o
GROUP BY 
    year, quarter
ORDER BY 
    year, quarter;
