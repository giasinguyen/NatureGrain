-- Nguyễn Trần Gia Sĩ
-- NatureGrain SQL Initialization Script
-- Created for NatureGrain E-Commerce Website
-- Date: April 27, 2025

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
    user_id BIGINT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
);

CREATE TABLE order_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL,
    quantity INT NOT NULL,
    sub_total BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Insert roles
INSERT INTO role (name) VALUES ('ROLE_USER');
INSERT INTO role (name) VALUES ('ROLE_MODERATOR');
INSERT INTO role (name) VALUES ('ROLE_ADMIN');

-- Insert sample users (password: password123)
INSERT INTO user (username, email, firstname, lastname, password, country, state, address, phone, enabled)
VALUES 
('admin', 'admin@naturegrain.com', 'Admin', 'User', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', 'Vietnam', 'Hanoi', '123 Admin Street', '0987654321', true),
('johndoe', 'john@example.com', 'John', 'Doe', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', 'United States', 'California', '456 Customer Ave', '0123456789', true),
('janedoe', 'jane@example.com', 'Jane', 'Doe', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', 'Canada', 'Ontario', '789 User Blvd', '0123456780', true),
('vendoruser', 'vendor@example.com', 'Vendor', 'User', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', 'Australia', 'Sydney', '321 Vendor Lane', '0123456781', true);

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id)
VALUES 
(1, 3), -- admin has ROLE_ADMIN
(2, 1), -- johndoe has ROLE_USER
(3, 1), -- janedoe has ROLE_USER
(4, 2); -- vendoruser has ROLE_MODERATOR

-- Insert sample images (using actual filenames from the photos directory)
INSERT INTO image (name, type, size, uploaded_by)
VALUES 
('12dbc8df-a591-447c-a67f-89d3de724e48.jpg', 'image/jpeg', 1024000, 1), -- Carrots
('19e5dcd4-62c3-409c-a7a9-634ee1b1634b.jpg', 'image/jpeg', 1024000, 1), -- Broccoli
('1b4b0ba3-76a4-41dc-9980-05600204d560.jpg', 'image/jpeg', 1024000, 1), -- Spinach
('1e5f1bd9-c659-443e-bb58-1b510d76f2b9.jpg', 'image/jpeg', 1024000, 1), -- Apples
('21cedc4f-be88-419f-9d05-2ad78e582195.jpg', 'image/jpeg', 1024000, 1), -- Bananas
('228fe279-cba7-47b2-9d4f-5fe185148103.jpg', 'image/jpeg', 1024000, 1), -- Berries Mix
('3413fd02-e755-47c4-bd2c-e8c825861881.jpg', 'image/jpeg', 1024000, 1), -- Quinoa
('38b7e224-2ce8-4c7d-a36a-97501269266a.jpg', 'image/jpeg', 1024000, 1), -- Brown Rice
('42e2011b-cda5-4349-9a48-76e4bb92594d.jpg', 'image/jpeg', 1024000, 1), -- Oats
('46b06873-1544-4d8f-a840-b63b2c181983.jpg', 'image/jpeg', 1024000, 1), -- Milk
('4f2ceb7b-4beb-4f90-8ef6-a7a033cf43d1.jpg', 'image/jpeg', 1024000, 1), -- Yogurt
('5642229e-3a9e-488e-b58d-ba158d974c77.jpg', 'image/jpeg', 1024000, 1), -- Cheese
('5dca27d0-107c-4f5d-bf8d-78fe0caca4b0.jpg', 'image/jpeg', 1024000, 1), -- Chicken
('7c637b87-4cd1-441a-9ed5-e5022d3ff041.jpg', 'image/jpeg', 1024000, 1), -- Beef
('94a04f45-5bd0-4da6-99d3-7171f5802ace.jpg', 'image/jpeg', 1024000, 1), -- Salmon
('9f718216-a1e5-4447-9e47-27b584256a1e.jpg', 'image/jpeg', 1024000, 1), -- Raw Honey
('a7b69b48-9041-46af-bd7d-e321b5a50e36.jpg', 'image/jpeg', 1024000, 1), -- Maple Syrup
('acf49066-1168-4f3c-94af-692868c08176.jpg', 'image/jpeg', 1024000, 1), -- Coconut Sugar
('b451d0b5-267d-41fb-b469-fce5a901ee34.jpg', 'image/jpeg', 1024000, 1), -- Trail Mix
('bcb0b47e-bbf1-4fde-b01d-4dd5dde5ea78.jpg', 'image/jpeg', 1024000, 1), -- Herbal Tea
('b1c340e7-4f93-4dae-965e-7ebf0d0edbe5.jpg', 'image/jpeg', 1024000, 1), -- Blog - Organic Farming
('d89789fe-2d2e-44d4-aad7-dd6577bd88fe.jpg', 'image/jpeg', 1024000, 1), -- Blog - Healthy Eating
('fa922889-f052-4c2e-b7e0-8c83876e06c7.jpg', 'image/jpeg', 1024000, 1); -- Blog - Sustainability

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
('Organic Carrots', 'Freshly harvested organic carrots. Rich in beta-carotene and antioxidants.', 25000, 100, 1),
('Organic Broccoli', 'Farm-fresh organic broccoli. High in vitamins and minerals.', 35000, 80, 1),
('Organic Spinach', 'Nutrient-dense organic spinach leaves. Perfect for salads and cooking.', 20000, 90, 1),
('Organic Apples', 'Sweet and juicy organic apples. Picked at the peak of ripeness.', 40000, 150, 2),
('Organic Bananas', 'Perfectly ripened organic bananas. Rich in potassium and fiber.', 30000, 200, 2),
('Organic Berries Mix', 'Delicious mix of organic strawberries, blueberries, and raspberries.', 50000, 50, 2),
('Organic Quinoa', 'Premium quality organic quinoa. High in protein and essential nutrients.', 60000, 100, 3),
('Organic Brown Rice', 'Wholesome organic brown rice. Nutritious and versatile.', 45000, 120, 3),
('Organic Oats', 'Hearty organic oats. Perfect for breakfast and baking.', 35000, 100, 3),
('Organic Milk', 'Fresh organic milk from grass-fed cows. Rich and creamy.', 38000, 80, 4),
('Organic Yogurt', 'Probiotic-rich organic yogurt. Smooth and creamy texture.', 42000, 70, 4),
('Organic Cheese', 'Artisanal organic cheese. Made from the finest milk.', 75000, 50, 4),
('Organic Chicken', 'Free-range organic chicken. Raised without antibiotics or hormones.', 120000, 40, 5),
('Grass-Fed Beef', 'Premium grass-fed organic beef. Lean and flavorful.', 150000, 30, 5),
('Wild-Caught Salmon', 'Sustainably sourced wild-caught salmon. Rich in omega-3 fatty acids.', 180000, 25, 5),
('Raw Honey', 'Pure, unprocessed raw honey. Collected from organic flower fields.', 85000, 60, 6),
('Maple Syrup', 'Authentic organic maple syrup. Rich, amber color and robust flavor.', 95000, 45, 6),
('Coconut Sugar', 'Organic coconut sugar. Low glycemic alternative to refined sugar.', 55000, 70, 6),
('Organic Trail Mix', 'Nutritious blend of organic nuts, seeds, and dried fruits.', 65000, 80, 7),
('Herbal Green Tea', 'Soothing organic green tea blend. Rich in antioxidants.', 48000, 90, 8);

-- Link products with images
INSERT INTO product_image (product_id, image_id)
VALUES 
(1, 1),  -- Organic Carrots
(2, 2),  -- Organic Broccoli
(3, 3),  -- Organic Spinach
(4, 4),  -- Organic Apples
(5, 5),  -- Organic Bananas
(6, 6),  -- Organic Berries Mix
(7, 7),  -- Organic Quinoa
(8, 8),  -- Organic Brown Rice
(9, 9),  -- Organic Oats
(10, 10), -- Organic Milk
(11, 11), -- Organic Yogurt
(12, 12), -- Organic Cheese
(13, 13), -- Organic Chicken
(14, 14), -- Grass-Fed Beef
(15, 15), -- Wild-Caught Salmon
(16, 16), -- Raw Honey
(17, 17), -- Maple Syrup
(18, 18), -- Coconut Sugar
(19, 19), -- Organic Trail Mix
(20, 20); -- Herbal Green Tea

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
<li>Environment-friendly practices</li>
<li>Improved soil health</li>
<li>Water conservation</li>
<li>Biodiversity promotion</li>
<li>Climate change mitigation</li>
</ul>
<p>By supporting organic farming, you\'re not just making a healthier choice for yourself but also contributing to a more sustainable future for our planet.</p>', 
21, 1, NOW() - INTERVAL 30 DAY),

('10 Superfoods to Include in Your Diet', 
'Discover nutrient-dense foods that can boost your health and wellbeing.', 
'<p>Superfoods are nutrient-rich foods considered to be especially beneficial for health and well-being. While the term "superfood" is not a scientific classification, it typically refers to foods with exceptional nutrient density.</p>
<p>Here are 10 superfoods worth adding to your diet:</p>
<ol>
<li><strong>Blueberries</strong>: Packed with antioxidants and phytoflavinoids, blueberries are also high in potassium and vitamin C.</li>
<li><strong>Kale</strong>: This leafy green is rich in vitamins A, C, and K, as well as calcium, iron, and antioxidants.</li>
<li><strong>Salmon</strong>: High in omega-3 fatty acids, protein, and B vitamins, salmon is excellent for heart health.</li>
<li><strong>Quinoa</strong>: A complete protein containing all nine essential amino acids, quinoa is also high in fiber and minerals.</li>
<li><strong>Avocado</strong>: Rich in healthy fats, fiber, and numerous vitamins and minerals.</li>
<li><strong>Turmeric</strong>: Contains curcumin, which has powerful anti-inflammatory and antioxidant properties.</li>
<li><strong>Nuts</strong>: Walnuts, almonds, and other nuts are rich in protein, fiber, and healthy fats.</li>
<li><strong>Garlic</strong>: Known for its immune-boosting properties and heart benefits.</li>
<li><strong>Greek Yogurt</strong>: High in protein and beneficial probiotics for gut health.</li>
<li><strong>Green Tea</strong>: Contains powerful antioxidants called catechins, which may have various health benefits.</li>
</ol>
<p>Incorporating these superfoods into your diet can help improve overall health and reduce the risk of chronic diseases. Remember, a balanced diet with a variety of whole foods is always the best approach to nutrition.</p>', 
22, 1, NOW() - INTERVAL 15 DAY),

('Sustainable Living: Making Eco-Friendly Food Choices', 
'Tips for making environmentally conscious decisions when shopping for food.', 
'<p>Making sustainable food choices is one of the most powerful ways individuals can reduce their environmental impact. The food system accounts for a significant portion of greenhouse gas emissions, water usage, and land use worldwide.</p>
<p>Here are some practical tips for making more eco-friendly food choices:</p>
<h3>1. Choose Locally Grown Foods</h3>
<p>Buying locally reduces the carbon footprint associated with transporting food long distances. Visit farmers\' markets or join a community-supported agriculture (CSA) program to access fresh, local produce.</p>
<h3>2. Reduce Animal Product Consumption</h3>
<p>Animal agriculture is resource-intensive. Consider adopting a "flexitarian" approach by having a few plant-based days each week or reducing portion sizes of animal products.</p>
<h3>3. Minimize Food Waste</h3>
<p>Plan meals, store food properly, understand expiration dates, and get creative with leftovers to reduce waste. Compost food scraps when possible.</p>
<h3>4. Choose Sustainable Seafood</h3>
<p>If you eat seafood, consult guides like the Monterey Bay Aquarium\'s Seafood Watch to choose options that are harvested or farmed using environmentally friendly methods.</p>
<h3>5. Opt for Minimal Packaging</h3>
<p>Choose foods with minimal or recyclable packaging. Bring your own bags, containers, and produce bags when shopping.</p>
<h3>6. Grow Your Own</h3>
<p>Even in small spaces, many herbs and vegetables can be grown at home, reducing your food miles to zero.</p>
<p>Remember, every choice makes a difference. You don\'t need to be perfect – even small changes in food habits can collectively lead to significant positive environmental impacts when adopted by many people.</p>', 
23, 1, NOW() - INTERVAL 5 DAY);

-- Link blogs with tags
INSERT INTO blog_tag (blog_id, tag_id)
VALUES 
(1, 1), -- Benefits of Organic Farming - Organic
(1, 3), -- Benefits of Organic Farming - Sustainability
(1, 6), -- Benefits of Organic Farming - Farming
(2, 2), -- 10 Superfoods - Healthy Eating
(2, 5), -- 10 Superfoods - Nutrition
(3, 3), -- Sustainable Living - Sustainability
(3, 7), -- Sustainable Living - Eco-Friendly
(3, 8); -- Sustainable Living - Lifestyle

-- Insert sample orders
INSERT INTO orders (firstname, lastname, country, address, town, state, postcode, email, phone, note, total_price, user_id, create_at)
VALUES 
('John', 'Doe', 'United States', '456 Customer Ave', 'Los Angeles', 'California', '90001', 'john@example.com', '0123456789', 'Please deliver in the afternoon', 180000, 2, NOW() - INTERVAL 15 DAY),
('Jane', 'Doe', 'Canada', '789 User Blvd', 'Toronto', 'Ontario', 'M5V 2A8', 'jane@example.com', '0123456780', NULL, 265000, 3, NOW() - INTERVAL 7 DAY),
('John', 'Doe', 'United States', '456 Customer Ave', 'Los Angeles', 'California', '90001', 'john@example.com', '0123456789', 'Please handle with care', 150000, 2, NOW() - INTERVAL 2 DAY);

-- Insert order details
INSERT INTO order_details (name, price, quantity, sub_total, order_id)
VALUES 
-- Order 1 details
('Organic Carrots', 25000, 2, 50000, 1),
('Organic Apples', 40000, 1, 40000, 1),
('Organic Quinoa', 60000, 1, 60000, 1),
('Raw Honey', 85000, 1, 85000, 1),

-- Order 2 details
('Organic Broccoli', 35000, 2, 70000, 2),
('Organic Milk', 38000, 2, 76000, 2),
('Organic Chicken', 120000, 1, 120000, 2),

-- Order 3 details
('Wild-Caught Salmon', 180000, 1, 180000, 3);