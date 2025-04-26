-- Insert roles
INSERT INTO role (name) VALUES ('ROLE_USER');
INSERT INTO role (name) VALUES ('ROLE_ADMIN');

-- Create admin user (password is "admin123" - modify as needed)
INSERT INTO user (username, email, password, enabled)
VALUES ('admin', 'admin@example.com', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', true);

-- Assign admin role to user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM user u, role r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';

-- First, check if roles exist:
INSERT INTO role (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Create a new admin user with BCrypt-encoded password
INSERT INTO user (username, email, password, enabled)
VALUES ('newadmin', 'newadmin@example.com', '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq', true);

-- Assign admin role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM user u, role r
WHERE u.username = 'newadmin' AND r.name = 'ROLE_ADMIN';

UPDATE user
SET password = '$2a$10$yfB0MQTu2VYpKlO.GQxk7.XZUqT4C6Ux47ZVXvccBgiy/jFRrRhSq'
WHERE username = 'admin';