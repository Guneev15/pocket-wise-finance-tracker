
/* 
BudgetWise Database Schema
This schema defines the structure for a personal finance tracking application.
*/

-- Users table to store user account information
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table for transaction and budget categories
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table to track income and expenses
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36),
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    transaction_date DATE NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Budgets table to set spending limits by category
CREATE TABLE budgets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE (user_id, category_id, month, year)
);

-- Savings_goals table for tracking savings targets
CREATE TABLE savings_goals (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0,
    target_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Default categories insert (to be run after user creation)
DELIMITER //
CREATE PROCEDURE insert_default_categories(IN p_user_id VARCHAR(36))
BEGIN
    INSERT INTO categories (id, user_id, name, icon, color) VALUES
    (UUID(), p_user_id, 'Housing', 'home', '#4CAF50'),
    (UUID(), p_user_id, 'Food', 'utensils', '#2196F3'),
    (UUID(), p_user_id, 'Transportation', 'car', '#FF9800'),
    (UUID(), p_user_id, 'Entertainment', 'film', '#9C27B0'),
    (UUID(), p_user_id, 'Utilities', 'zap', '#607D8B'),
    (UUID(), p_user_id, 'Shopping', 'shopping-bag', '#E91E63'),
    (UUID(), p_user_id, 'Healthcare', 'activity', '#00BCD4'),
    (UUID(), p_user_id, 'Personal', 'user', '#795548');
END //
DELIMITER ;

-- Indexes for performance
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_user_period ON budgets(user_id, year, month);
CREATE INDEX idx_categories_user ON categories(user_id);
