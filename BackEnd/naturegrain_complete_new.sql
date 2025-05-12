-- FileName: naturegrain_complete_new.sql
-- Author: Nguyễn Trần Gia Sĩ
-- NatureGrain SQL Initialization Script (Complete Version with OrderDetail-Product Relationship)
-- Created for NatureGrain E-Commerce Website
-- Date: June 5, 2025

-- Drop tables in reverse order of dependencies to avoid constraint violations
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS blog_tag;
DROP TABLE IF EXISTS product_image;
DROP TABLE IF EXISTS order_details;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS blog;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS image;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS role;

SET FOREIGN_KEY_CHECKS = 1;

-- Create tables
CREATE TABLE role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN') NOT NULL
);

CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    state VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    verification_code VARCHAR(64),
    enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

CREATE TABLE image (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    size BIGINT NOT NULL,
    data LONGBLOB,
    uploaded_by BIGINT,
    FOREIGN KEY (uploaded_by) REFERENCES user(id) ON DELETE SET NULL
);

CREATE TABLE category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    enable BOOLEAN DEFAULT FALSE
);

CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
);

CREATE TABLE product_image (
    product_id BIGINT NOT NULL,
    image_id BIGINT NOT NULL,
    PRIMARY KEY (product_id, image_id),
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES image(id) ON DELETE CASCADE
);

CREATE TABLE tag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    enable BOOLEAN DEFAULT FALSE
);

CREATE TABLE blog (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    image_id BIGINT,
    user_id BIGINT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_id) REFERENCES image(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
);

CREATE TABLE blog_tag (
    blog_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (blog_id, tag_id),
    FOREIGN KEY (blog_id) REFERENCES blog(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    town VARCHAR(255),
    state VARCHAR(255),
    postcode VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    note TEXT,
    total_price BIGINT NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
    user_id BIGINT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
);

CREATE TABLE order_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL,
    quantity INT NOT NULL,
    sub_total BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    product_id BIGINT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL
);

-- Insert roles
INSERT INTO role (name) VALUES ('ROLE_USER');
INSERT INTO role (name) VALUES ('ROLE_MODERATOR');
INSERT INTO role (name) VALUES ('ROLE_ADMIN');

-- Insert sample users (password: password123 - hashed)
INSERT INTO user (username, email, firstname, lastname, password, country, state, address, phone, enabled)
VALUES 
('admin', 'admin@naturegrain.com', 'Admin', 'User', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', 'Vietnam', 'Hanoi', '123 Admin Street', '0987654321', true),
('johndoe', 'john@example.com', 'John', 'Doe', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', 'United States', 'California', '456 Customer Ave', '0123456789', true),
('janedoe', 'jane@example.com', 'Jane', 'Doe', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', 'Canada', 'Ontario', '789 User Blvd', '0123456780', true),
('vendoruser', 'vendor@example.com', 'Vendor', 'User', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', 'Australia', 'Sydney', '321 Vendor Lane', '0123456781', true),
('customer1', 'customer1@example.com', 'Nguyễn', 'Văn A', '$2a$10$NXwYoEZ98rUxkgbj0lH1aOrGxg9pZXULFUfNJTZqX.ZVL2FAhVMxi', 'Việt Nam', 'Hồ Chí Minh', '123 Nguyễn Du', '0901234567', TRUE),
('customer2', 'customer2@example.com', 'Trần', 'Thị B', '$2a$10$NXwYoEZ98rUxkgbj0lH1aOrGxg9pZXULFUfNJTZqX.ZVL2FAhVMxi', 'Việt Nam', 'Hà Nội', '456 Lê Lợi', '0912345678', TRUE),
('customer3', 'customer3@example.com', 'Lê', 'Văn C', '$2a$10$NXwYoEZ98rUxkgbj0lH1aOrGxg9pZXULFUfNJTZqX.ZVL2FAhVMxi', 'Việt Nam', 'Đà Nẵng', '789 Trần Phú', '0923456789', TRUE),
('customer4', 'customer4@example.com', 'Phạm', 'Thị D', '$2a$10$NXwYoEZ98rUxkgbj0lH1aOrGxg9pZXULFUfNJTZqX.ZVL2FAhVMxi', 'Việt Nam', 'Cần Thơ', '101 Hai Bà Trưng', '0934567890', TRUE),
('customer5', 'customer5@example.com', 'Hoàng', 'Văn E', '$2a$10$NXwYoEZ98rUxkgbj0lH1aOrGxg9pZXULFUfNJTZqX.ZVL2FAhVMxi', 'Việt Nam', 'Huế', '202 Lê Duẩn', '0945678901', TRUE);

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id) 
VALUES 
(1, 3), -- admin is ROLE_ADMIN
(2, 1), -- johndoe is ROLE_USER
(3, 1), -- janedoe is ROLE_USER
(4, 2), -- vendoruser is ROLE_MODERATOR
(5, 1), -- customer1 is ROLE_USER
(6, 1), -- customer2 is ROLE_USER
(7, 1), -- customer3 is ROLE_USER
(8, 1), -- customer4 is ROLE_USER
(9, 1); -- customer5 is ROLE_USER

-- Insert images (LONGBLOB data is represented as placeholder)
INSERT INTO image (name, type, size, uploaded_by)
VALUES 
-- Product images (key images)
('organic_carrots.jpg', 'image/jpeg', 1024000, 1), -- 1
('organic_broccoli.jpg', 'image/jpeg', 1024000, 1), -- 2
('organic_spinach.jpg', 'image/jpeg', 1024000, 1), -- 3
('organic_apples.jpg', 'image/jpeg', 1024000, 1), -- 4
('organic_bananas.jpg', 'image/jpeg', 1024000, 1), -- 5
('organic_berries.jpg', 'image/jpeg', 1024000, 1), -- 6
('organic_quinoa.jpg', 'image/jpeg', 1024000, 1), -- 7
('organic_brown_rice.jpg', 'image/jpeg', 1024000, 1), -- 8
('organic_oats.jpg', 'image/jpeg', 1024000, 1), -- 9
('organic_milk.jpg', 'image/jpeg', 1024000, 1), -- 10
('organic_yogurt.jpg', 'image/jpeg', 1024000, 1), -- 11
('organic_cheese.jpg', 'image/jpeg', 1024000, 1), -- 12
('organic_chicken.jpg', 'image/jpeg', 1024000, 1), -- 13
('organic_beef.jpg', 'image/jpeg', 1024000, 1), -- 14
('wild_salmon.jpg', 'image/jpeg', 1024000, 1), -- 15
('raw_honey.jpg', 'image/jpeg', 1024000, 1), -- 16
('maple_syrup.jpg', 'image/jpeg', 1024000, 1), -- 17
('coconut_sugar.jpg', 'image/jpeg', 1024000, 1), -- 18
('trail_mix.jpg', 'image/jpeg', 1024000, 1), -- 19
('herbal_tea.jpg', 'image/jpeg', 1024000, 1), -- 20

-- Blog images
('blog_organic_farming.jpg', 'image/jpeg', 1024000, 1), -- 21: Blog - Benefits of Organic Farming
('blog_healthy_recipes.jpg', 'image/jpeg', 1024000, 1), -- 22: Blog - Seasonal Recipes
('blog_sustainability.jpg', 'image/jpeg', 1024000, 1), -- 23: Blog - Sustainability

-- Additional product images
('bok_choy.jpg', 'image/jpeg', 1024000, 1), -- 24: Bok Choy
('bell_peppers.jpg', 'image/jpeg', 1024000, 1), -- 25: Bell Peppers
('cherry_tomatoes.jpg', 'image/jpeg', 1024000, 1), -- 26: Cherry Tomatoes
('oranges.jpg', 'image/jpeg', 1024000, 1), -- 27: Oranges
('mangoes.jpg', 'image/jpeg', 1024000, 1), -- 28: Mangoes
('grapes.jpg', 'image/jpeg', 1024000, 1), -- 29: Grapes
('barley.jpg', 'image/jpeg', 1024000, 1), -- 30: Barley
('millet.jpg', 'image/jpeg', 1024000, 1); -- 31: Millet

-- Insert categories
INSERT INTO category (name, enable)
VALUES 
('Organic Vegetables', true),
('Fresh Fruits', true),
('Whole Grains', true),
('Dairy Products', true),
('Sustainable Meats', true),
('Natural Sweeteners', true),
('Organic Snacks', true),
('Herbal Teas', true);

-- Insert products
INSERT INTO product (name, description, price, quantity, category_id)
VALUES 
-- Organic Vegetables
('Organic Carrots', 'Freshly harvested organic carrots. Rich in beta-carotene and antioxidants.', 25000, 100, 1),
('Organic Broccoli', 'Farm-fresh organic broccoli. High in vitamins and minerals.', 35000, 80, 1),
('Organic Spinach', 'Nutrient-dense organic spinach leaves. Perfect for salads and cooking.', 20000, 90, 1),
('Organic Bok Choy', 'Asian greens grown organically. Perfect for stir fries and soups.', 28000, 70, 1), 
('Organic Bell Peppers', 'Sweet, crisp bell peppers in various colors. Grown without pesticides.', 32000, 65, 1),
('Organic Cherry Tomatoes', 'Sweet bite-sized tomatoes perfect for salads. Organically grown.', 30000, 85, 1),

-- Fresh Fruits
('Organic Apples', 'Sweet and juicy organic apples. Picked at the peak of ripeness.', 40000, 150, 2),
('Organic Bananas', 'Perfectly ripened organic bananas. Rich in potassium and fiber.', 30000, 200, 2),
('Organic Berries Mix', 'Delicious mix of organic strawberries, blueberries, and raspberries.', 50000, 50, 2),
('Organic Oranges', 'Juicy oranges packed with vitamin C. Grown organically.', 45000, 120, 2),
('Organic Mangoes', 'Exotic sweet mangoes grown using organic practices.', 55000, 70, 2),
('Organic Grapes', 'Sweet seedless grapes grown without pesticides or chemicals.', 48000, 90, 2),

-- Whole Grains
('Organic Quinoa', 'Premium quality organic quinoa. High in protein and essential nutrients.', 60000, 100, 3),
('Organic Brown Rice', 'Wholesome organic brown rice. Nutritious and versatile.', 45000, 120, 3),
('Organic Oats', 'Hearty organic oats. Perfect for breakfast and baking.', 35000, 100, 3),
('Organic Barley', 'Nutrient-rich barley perfect for soups and grain bowls.', 38000, 80, 3),
('Organic Millet', 'Ancient grain with a mild, nutty flavor. Perfect for pilafs.', 42000, 75, 3),

-- Dairy Products
('Organic Milk', 'Fresh organic milk from grass-fed cows. Rich and creamy.', 38000, 80, 4),
('Organic Yogurt', 'Probiotic-rich organic yogurt. Smooth and creamy texture.', 42000, 70, 4),
('Organic Cheese', 'Artisanal organic cheese. Made from the finest milk.', 75000, 50, 4),
('Organic Butter', 'Creamy butter made from organic milk. Perfect for cooking and baking.', 65000, 60, 4),
('Organic Kefir', 'Fermented milk drink rich in probiotics. Great for digestive health.', 48000, 40, 4),

-- Sustainable Meats
('Organic Chicken', 'Free-range organic chicken. Raised without antibiotics or hormones.', 120000, 40, 5),
('Grass-Fed Beef', 'Premium grass-fed organic beef. Lean and flavorful.', 150000, 30, 5),
('Wild-Caught Salmon', 'Sustainably sourced wild-caught salmon. Rich in omega-3 fatty acids.', 180000, 25, 5),
('Pasture-Raised Pork', 'Humanely raised organic pork from free-range animals.', 135000, 35, 5),
('Free-Range Eggs', 'Eggs from free-range chickens raised on organic feed.', 45000, 100, 5),

-- Natural Sweeteners
('Raw Honey', 'Pure, unprocessed raw honey. Collected from organic flower fields.', 85000, 60, 6),
('Maple Syrup', 'Authentic organic maple syrup. Rich, amber color and robust flavor.', 95000, 45, 6),
('Coconut Sugar', 'Organic coconut sugar. Low glycemic alternative to refined sugar.', 55000, 70, 6),
('Date Syrup', 'Natural sweetener made from organic dates. Rich in minerals.', 75000, 50, 6),
('Stevia Leaves', 'Natural zero-calorie sweetener from dried stevia leaves.', 60000, 55, 6),

-- Organic Snacks
('Organic Trail Mix', 'Nutritious blend of organic nuts, seeds, and dried fruits.', 65000, 80, 7),
('Organic Granola Bars', 'Delicious bars made with organic oats, honey, and dried fruit.', 55000, 90, 7),
('Organic Dried Mango', 'Sweet dried mango slices with no added sugar or preservatives.', 60000, 75, 7),
('Organic Rice Cakes', 'Light and crunchy snacks made from whole grain organic rice.', 40000, 95, 7),
('Organic Nut Butter', 'Creamy spread made from organic roasted nuts. No additives.', 85000, 60, 7),

-- Herbal Teas
('Herbal Green Tea', 'Soothing organic green tea blend. Rich in antioxidants.', 48000, 90, 8),
('Chamomile Tea', 'Calming organic chamomile flowers. Perfect before bedtime.', 45000, 85, 8),
('Ginger Turmeric Tea', 'Spicy blend of organic ginger and turmeric. Anti-inflammatory properties.', 52000, 70, 8),
('Peppermint Tea', 'Refreshing organic peppermint leaves. Great for digestion.', 46000, 80, 8),
('Rooibos Tea', 'Caffeine-free red tea from South Africa. Rich in antioxidants.', 50000, 75, 8);

-- Link products with images
INSERT INTO product_image (product_id, image_id)
VALUES 
(1, 1),  -- Organic Carrots
(2, 2),  -- Organic Broccoli
(3, 3),  -- Organic Spinach
(4, 24), -- Organic Bok Choy
(5, 25), -- Organic Bell Peppers
(6, 26), -- Organic Cherry Tomatoes
(7, 4),  -- Organic Apples
(8, 5),  -- Organic Bananas
(9, 6),  -- Organic Berries Mix
(10, 27), -- Organic Oranges
(11, 28), -- Organic Mangoes
(12, 29), -- Organic Grapes
(13, 7),  -- Organic Quinoa
(14, 8),  -- Organic Brown Rice
(15, 9),  -- Organic Oats
(16, 30), -- Organic Barley
(17, 31), -- Organic Millet
(18, 10), -- Organic Milk
(19, 11), -- Organic Yogurt
(20, 12), -- Organic Cheese
(21, 10), -- Organic Butter (reusing milk image)
(22, 11), -- Organic Kefir (reusing yogurt image)
(23, 13), -- Organic Chicken
(24, 14), -- Grass-Fed Beef
(25, 15), -- Wild-Caught Salmon
(26, 13), -- Pasture-Raised Pork (reusing chicken image)
(27, 14), -- Free-Range Eggs (reusing beef image)
(28, 16), -- Raw Honey
(29, 17), -- Maple Syrup
(30, 18), -- Coconut Sugar
(31, 16), -- Date Syrup (reusing honey image)
(32, 18), -- Stevia Leaves (reusing coconut sugar image)
(33, 19), -- Organic Trail Mix
(34, 19), -- Organic Granola Bars (reusing trail mix image)
(35, 5),  -- Organic Dried Mango (reusing bananas image)
(36, 8),  -- Organic Rice Cakes (reusing brown rice image)
(37, 19), -- Organic Nut Butter (reusing trail mix image)
(38, 20), -- Herbal Green Tea
(39, 20), -- Chamomile Tea (reusing green tea image)
(40, 20), -- Ginger Turmeric Tea (reusing green tea image)
(41, 20), -- Peppermint Tea (reusing green tea image)
(42, 20); -- Rooibos Tea (reusing green tea image)

-- Insert tags
INSERT INTO tag (name, enable)
VALUES 
('Organic', true),
('Healthy Eating', true),
('Sustainability', true),
('Recipes', true),
('Nutrition', true),
('Farming', true),
('Eco-Friendly', true),
('Lifestyle', true);

-- Insert blogs
INSERT INTO blog (title, description, content, image_id, user_id, create_at)
VALUES 
('Benefits of Organic Farming', 
'Learn about how organic farming practices benefit both the environment and your health.', 
'<p>Organic farming is a method of crop and livestock production that involves much more than choosing not to use pesticides, fertilizers, genetically modified organisms, antibiotics, and growth hormones.</p>
<p>Organic production is a holistic system designed to optimize the productivity and fitness of diverse communities within the agro-ecosystem, including soil organisms, plants, livestock, and people. The principal goal of organic production is to develop enterprises that are sustainable and harmonious with the environment.</p>
<p>Benefits of organic farming include:</p>
<ul>
<li>Reduced exposure to pesticides and chemicals</li>
<li>Improved soil quality and reduced erosion</li>
<li>Water conservation and reduced pollution</li>
<li>Preservation of biodiversity</li>
<li>Supporting small-scale farmers and local economies</li>
</ul>
<p>By choosing organic products, you\'re not only making a healthier choice for yourself but also supporting sustainable agricultural practices that benefit the planet.</p>',
21, 1, '2025-01-15 09:30:00'),

('Seasonal Recipes for Healthy Eating', 
'Delicious recipes that make the most of seasonal organic produce.', 
'<p>Eating seasonally means consuming foods that are naturally harvested at the time you\'re eating them. This practice not only ensures that you\'re getting the freshest and most nutritious produce, but it also supports local farmers and reduces the environmental impact of food transportation.</p>
<p>Here are some of our favorite seasonal recipes:</p>
<h3>Spring:</h3>
<ul>
<li>Asparagus and Spring Pea Risotto</li>
<li>Strawberry Spinach Salad with Balsamic Vinaigrette</li>
<li>Herb-Roasted Spring Vegetables</li>
</ul>
<h3>Summer:</h3>
<ul>
<li>Grilled Vegetable Platter with Fresh Herbs</li>
<li>Heirloom Tomato and Basil Salad</li>
<li>Berry and Peach Cobbler</li>
</ul>
<h3>Fall:</h3>
<ul>
<li>Roasted Root Vegetable Soup</li>
<li>Butternut Squash and Sage Pasta</li>
<li>Apple and Pear Crisp</li>
</ul>
<h3>Winter:</h3>
<ul>
<li>Hearty Vegetable and Bean Stew</li>
<li>Citrus and Fennel Salad</li>
<li>Dark Chocolate and Orange Brownies</li>
</ul>
<p>Visit our store for all the organic ingredients you need to make these delicious seasonal dishes!</p>',
22, 1, '2025-02-20 14:15:00'),

('Sustainability in Food Production', 
'How NatureGrain is committed to sustainable food production and distribution.', 
'<p>At NatureGrain, sustainability is at the core of our mission. We believe that producing food in harmony with nature is not only better for the environment but also results in healthier, more nutritious products for our customers.</p>
<p>Our commitment to sustainability encompasses:</p>
<h3>Environmentally Friendly Farming Practices:</h3>
<ul>
<li>Organic farming methods that avoid synthetic pesticides and fertilizers</li>
<li>Crop rotation and cover cropping to maintain soil health</li>
<li>Water conservation techniques</li>
<li>Renewable energy use on our partner farms</li>
</ul>
<h3>Ethical Production:</h3>
<ul>
<li>Fair wages and safe working conditions for farm workers</li>
<li>Support for family farms and local agriculture</li>
<li>Animal welfare standards that exceed industry requirements</li>
</ul>
<h3>Reduced Carbon Footprint:</h3>
<ul>
<li>Local sourcing whenever possible to reduce transportation emissions</li>
<li>Minimal and recyclable packaging</li>
<li>Zero-waste initiatives in our processing facilities</li>
</ul>
<p>We continuously strive to improve our practices and are transparent about our sustainability journey. Join us in creating a more sustainable food system by choosing products that are good for both people and the planet.</p>',
23, 1, '2025-03-10 10:45:00');

-- Link blogs with tags
INSERT INTO blog_tag (blog_id, tag_id)
VALUES
(1, 1), -- Benefits of Organic Farming - Organic
(1, 3), -- Benefits of Organic Farming - Sustainability
(1, 6), -- Benefits of Organic Farming - Farming
(2, 2), -- Seasonal Recipes - Healthy Eating
(2, 4), -- Seasonal Recipes - Recipes
(2, 5), -- Seasonal Recipes - Nutrition
(3, 3), -- Sustainability - Sustainability
(3, 7), -- Sustainability - Eco-Friendly
(3, 8); -- Sustainability - Lifestyle

-- Insert sample orders
INSERT INTO orders (firstname, lastname, country, address, town, state, postcode, email, phone, note, total_price, status, user_id, create_at)
VALUES
-- Guest orders (no user_id)
('Nguyễn', 'Văn X', 'Việt Nam', '123 Đường Láng', 'Hà Nội', 'Hà Nội', '100000', 'nguyenvanx@example.com', '0901234567', 'Giao hàng giờ hành chính', 150000, 'PENDING', NULL, '2025-04-01 09:15:00'),
('Trần', 'Thị Y', 'Việt Nam', '456 Nguyễn Huệ', 'Hồ Chí Minh', 'Hồ Chí Minh', '700000', 'tranthiy@example.com', '0912345678', 'Gọi trước khi giao', 280000, 'PROCESSING', NULL, '2025-04-02 14:30:00'),
('Lê', 'Văn Z', 'Việt Nam', '789 Trần Hưng Đạo', 'Đà Nẵng', 'Đà Nẵng', '550000', 'levanz@example.com', '0923456789', NULL, 420000, 'SHIPPED', NULL, '2025-04-03 11:45:00'),

-- Registered user orders
('Nguyễn', 'Văn A', 'Việt Nam', '123 Nguyễn Du', 'Hồ Chí Minh', 'Hồ Chí Minh', '700000', 'customer1@example.com', '0901234567', 'Đóng gói quà tặng', 320000, 'COMPLETED', 5, '2025-04-04 10:00:00'),
('Trần', 'Thị B', 'Việt Nam', '456 Lê Lợi', 'Hà Nội', 'Hà Nội', '100000', 'customer2@example.com', '0912345678', NULL, 495000, 'COMPLETED', 6, '2025-04-05 16:20:00'),
('Lê', 'Văn C', 'Việt Nam', '789 Trần Phú', 'Đà Nẵng', 'Đà Nẵng', '550000', 'customer3@example.com', '0923456789', 'Giao buổi sáng', 680000, 'PROCESSING', 7, '2025-04-06 09:30:00'),
('Phạm', 'Thị D', 'Việt Nam', '101 Hai Bà Trưng', 'Cần Thơ', 'Cần Thơ', '900000', 'customer4@example.com', '0934567890', NULL, 540000, 'PENDING', 8, '2025-04-07 14:45:00'),
('Hoàng', 'Văn E', 'Việt Nam', '202 Lê Duẩn', 'Huế', 'Thừa Thiên Huế', '530000', 'customer5@example.com', '0945678901', 'Gọi trước khi giao', 760000, 'PENDING', 9, '2025-04-08 11:15:00'),

-- Additional orders for testing
('John', 'Doe', 'United States', '456 Customer Ave', 'Los Angeles', 'California', '90001', 'john@example.com', '0123456789', NULL, 450000, 'SHIPPED', 2, '2025-04-09 08:30:00'),
('Jane', 'Doe', 'Canada', '789 User Blvd', 'Toronto', 'Ontario', 'M5V 2H1', 'jane@example.com', '0123456780', 'Leave at door', 375000, 'COMPLETED', 3, '2025-04-10 13:40:00');

-- Insert order details with proper product relationships
INSERT INTO order_details (name, price, quantity, sub_total, order_id, product_id)
VALUES
-- Order 1 details (Guest - Nguyễn Văn X)
('Organic Carrots', 25000, 2, 50000, 1, 1),
('Organic Broccoli', 35000, 1, 35000, 1, 2),
('Organic Spinach', 20000, 2, 40000, 1, 3),
('Organic Apples', 40000, 1, 40000, 1, 7),

-- Order 2 details (Guest - Trần Thị Y)
('Organic Bananas', 30000, 2, 60000, 2, 8),
('Organic Berries Mix', 50000, 1, 50000, 2, 9),
('Organic Milk', 38000, 2, 76000, 2, 18),
('Organic Yogurt', 42000, 1, 42000, 2, 19),
('Organic Brown Rice', 45000, 1, 45000, 2, 14),

-- Order 3 details (Guest - Lê Văn Z)
('Organic Chicken', 120000, 1, 120000, 3, 23),
('Organic Quinoa', 60000, 2, 120000, 3, 13),
('Raw Honey', 85000, 1, 85000, 3, 28),
('Organic Trail Mix', 65000, 1, 65000, 3, 33),
('Herbal Green Tea', 48000, 1, 48000, 3, 38),

-- Order 4 details (Nguyễn Văn A)
('Organic Bell Peppers', 32000, 2, 64000, 4, 5),
('Organic Cherry Tomatoes', 30000, 2, 60000, 4, 6),
('Wild-Caught Salmon', 180000, 1, 180000, 4, 25),
('Organic Oats', 35000, 1, 35000, 4, 15),

-- Order 5 details (Trần Thị B)
('Organic Cheese', 75000, 1, 75000, 5, 20),
('Organic Butter', 65000, 1, 65000, 5, 21),
('Maple Syrup', 95000, 1, 95000, 5, 29),
('Organic Dried Mango', 60000, 2, 120000, 5, 35),
('Peppermint Tea', 46000, 3, 138000, 5, 41),

-- Order 6 details (Lê Văn C)
('Grass-Fed Beef', 150000, 1, 150000, 6, 24),
('Free-Range Eggs', 45000, 2, 90000, 6, 27),
('Organic Bok Choy', 28000, 3, 84000, 6, 4),
('Organic Oranges', 45000, 2, 90000, 6, 10),
('Organic Mangoes', 55000, 3, 165000, 6, 11),
('Organic Granola Bars', 55000, 2, 110000, 6, 34),

-- Order 7 details (Phạm Thị D)
('Organic Grapes', 48000, 2, 96000, 7, 12),
('Pasture-Raised Pork', 135000, 1, 135000, 7, 26),
('Organic Kefir', 48000, 2, 96000, 7, 22),
('Coconut Sugar', 55000, 1, 55000, 7, 30),
('Date Syrup', 75000, 1, 75000, 7, 31),
('Chamomile Tea', 45000, 2, 90000, 7, 39),

-- Order 8 details (Hoàng Văn E)
('Organic Barley', 38000, 2, 76000, 8, 16),
('Organic Millet', 42000, 3, 126000, 8, 17),
('Stevia Leaves', 60000, 1, 60000, 8, 32),
('Organic Rice Cakes', 40000, 3, 120000, 8, 36),
('Organic Nut Butter', 85000, 2, 170000, 8, 37),
('Ginger Turmeric Tea', 52000, 4, 208000, 8, 40),

-- Order 9 details (John Doe)
('Organic Chicken', 120000, 1, 120000, 9, 23),
('Organic Bell Peppers', 32000, 2, 64000, 9, 5),
('Organic Broccoli', 35000, 3, 105000, 9, 2),
('Organic Brown Rice', 45000, 2, 90000, 9, 14),
('Raw Honey', 85000, 1, 85000, 9, 28),

-- Order 10 details (Jane Doe)
('Organic Quinoa', 60000, 2, 120000, 10, 13),
('Organic Yogurt', 42000, 3, 126000, 10, 19),
('Organic Apples', 40000, 2, 80000, 10, 7),
('Organic Berries Mix', 50000, 1, 50000, 10, 9),
('Rooibos Tea', 50000, 1, 50000, 10, 42);

-- Create a few order details without product associations (to demonstrate the issue that was fixed)
INSERT INTO order_details (name, price, quantity, sub_total, order_id, product_id)
VALUES
-- Legacy data without product connections
('Hạt Chia Organic', 75000, 1, 75000, 5, NULL),
('Bột Protein Hữu Cơ', 120000, 1, 120000, 6, NULL),
('Sữa Hạnh Nhân', 55000, 1, 55000, 7, NULL),
('Bánh Quy Yến Mạch', 45000, 2, 90000, 8, NULL);
