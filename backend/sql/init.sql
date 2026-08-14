CREATE DATABASE IF NOT EXISTS my_custom_budget CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'budget_user'@'localhost' IDENTIFIED BY 'change_me';
GRANT ALL PRIVILEGES ON my_custom_budget.* TO 'budget_user'@'localhost';
FLUSH PRIVILEGES;

USE my_custom_budget;

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    phone VARCHAR(30) NULL,
    dob DATE NULL,
    last_login DATETIME NULL,
    INDEX ix_users_role (role),
    INDEX ix_users_is_active (is_active)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    kind VARCHAR(20) NOT NULL,
    INDEX ix_categories_kind (kind)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS budget_line_items (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    budget_month DATE NOT NULL,
    category_id INT NULL,
    category_name VARCHAR(100) NOT NULL,
    kind VARCHAR(20) NOT NULL,
    description VARCHAR(255) NOT NULL DEFAULT '',
    budgeted DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    actual DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    notes TEXT NOT NULL,
    CONSTRAINT fk_line_item_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX ix_budget_line_items_budget_month (budget_month),
    INDEX ix_budget_line_items_kind (kind)
) ENGINE=InnoDB;
