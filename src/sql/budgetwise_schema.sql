
-- BudgetWise Database Schema

-- Users Table
CREATE TABLE users (
  user_id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL CHECK (email LIKE '%@gmail.com'),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
  category_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Default categories for new users
INSERT INTO categories (category_id, user_id, name, icon, color)
VALUES
  (uuid_generate_v4(), :user_id, 'Housing', 'home', '#4CAF50'),
  (uuid_generate_v4(), :user_id, 'Food', 'utensils', '#2196F3'),
  (uuid_generate_v4(), :user_id, 'Transportation', 'car', '#FF9800'),
  (uuid_generate_v4(), :user_id, 'Entertainment', 'film', '#9C27B0'),
  (uuid_generate_v4(), :user_id, 'Utilities', 'zap', '#607D8B'),
  (uuid_generate_v4(), :user_id, 'Shopping', 'shopping-bag', '#E91E63'),
  (uuid_generate_v4(), :user_id, 'Healthcare', 'activity', '#00BCD4'),
  (uuid_generate_v4(), :user_id, 'Personal', 'user', '#795548');

-- Budget Table
CREATE TABLE budgets (
  budget_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Transactions Table (for both income and expenses)
CREATE TABLE transactions (
  transaction_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36),
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  transaction_date DATE NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- Budget Alerts Table
CREATE TABLE budget_alerts (
  alert_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  budget_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Savings Goals Table
CREATE TABLE savings_goals (
  goal_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  target_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- User Settings Table
CREATE TABLE user_settings (
  user_id VARCHAR(36) PRIMARY KEY,
  currency VARCHAR(3) DEFAULT 'INR',
  notification_enabled BOOLEAN DEFAULT TRUE,
  budget_alert_threshold INT DEFAULT 80,
  theme VARCHAR(20) DEFAULT 'light',
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Add stored procedure for user registration
DELIMITER $$
CREATE PROCEDURE register_user(
  IN p_user_id VARCHAR(36),
  IN p_name VARCHAR(100),
  IN p_email VARCHAR(100),
  IN p_password_hash VARCHAR(255)
)
BEGIN
  -- Insert the user
  INSERT INTO users(user_id, name, email, password_hash)
  VALUES(p_user_id, p_name, p_email, p_password_hash);
  
  -- Insert default categories for the user
  INSERT INTO categories (category_id, user_id, name, icon, color)
  VALUES
    (uuid_generate_v4(), p_user_id, 'Housing', 'home', '#4CAF50'),
    (uuid_generate_v4(), p_user_id, 'Food', 'utensils', '#2196F3'),
    (uuid_generate_v4(), p_user_id, 'Transportation', 'car', '#FF9800'),
    (uuid_generate_v4(), p_user_id, 'Entertainment', 'film', '#9C27B0'),
    (uuid_generate_v4(), p_user_id, 'Utilities', 'zap', '#607D8B'),
    (uuid_generate_v4(), p_user_id, 'Shopping', 'shopping-bag', '#E91E63'),
    (uuid_generate_v4(), p_user_id, 'Healthcare', 'activity', '#00BCD4'),
    (uuid_generate_v4(), p_user_id, 'Personal', 'user', '#795548');
  
  -- Insert default settings
  INSERT INTO user_settings(user_id, currency)
  VALUES(p_user_id, 'INR');
END$$
DELIMITER ;

-- Add stored procedure for adding transactions
DELIMITER $$
CREATE PROCEDURE add_transaction(
  IN p_transaction_id VARCHAR(36),
  IN p_user_id VARCHAR(36),
  IN p_category_id VARCHAR(36),
  IN p_amount DECIMAL(10, 2),
  IN p_description VARCHAR(255),
  IN p_transaction_date DATE,
  IN p_type ENUM('income', 'expense')
)
BEGIN
  -- Insert the transaction
  INSERT INTO transactions(transaction_id, user_id, category_id, amount, description, transaction_date, type)
  VALUES(p_transaction_id, p_user_id, p_category_id, p_amount, p_description, p_transaction_date, p_type);
  
  -- If this is an expense, check if it exceeds the budget
  IF p_type = 'expense' THEN
    CALL check_budget_limit(p_user_id, p_category_id, p_transaction_date);
  END IF;
END$$
DELIMITER ;

-- Add stored procedure for checking budget limits
DELIMITER $$
CREATE PROCEDURE check_budget_limit(
  IN p_user_id VARCHAR(36),
  IN p_category_id VARCHAR(36),
  IN p_date DATE
)
BEGIN
  DECLARE budget_amount DECIMAL(10, 2);
  DECLARE month_expenses DECIMAL(10, 2);
  DECLARE transaction_month INT;
  DECLARE transaction_year INT;
  
  -- Get the month and year from the transaction date
  SET transaction_month = MONTH(p_date);
  SET transaction_year = YEAR(p_date);
  
  -- Get budget amount for this category and month
  SELECT amount INTO budget_amount
  FROM budgets
  WHERE user_id = p_user_id
  AND category_id = p_category_id
  AND month = transaction_month
  AND year = transaction_year;
  
  -- If a budget exists for this category
  IF budget_amount IS NOT NULL THEN
    -- Get total expenses for this category and month
    SELECT SUM(amount) INTO month_expenses
    FROM transactions
    WHERE user_id = p_user_id
    AND category_id = p_category_id
    AND type = 'expense'
    AND MONTH(transaction_date) = transaction_month
    AND YEAR(transaction_date) = transaction_year;
    
    -- If expenses exceed budget threshold, create an alert
    IF month_expenses >= (budget_amount * 0.8) THEN
      -- Check if an alert already exists
      IF NOT EXISTS (
        SELECT 1 FROM budget_alerts 
        WHERE user_id = p_user_id 
        AND category_id = p_category_id 
        AND month = transaction_month 
        AND year = transaction_year
      ) THEN
        -- Create new alert
        INSERT INTO budget_alerts(alert_id, user_id, category_id, budget_amount, current_amount, month, year)
        VALUES(uuid_generate_v4(), p_user_id, p_category_id, budget_amount, month_expenses, transaction_month, transaction_year);
      ELSE
        -- Update existing alert
        UPDATE budget_alerts
        SET current_amount = month_expenses, is_read = FALSE, alert_date = CURRENT_TIMESTAMP
        WHERE user_id = p_user_id
        AND category_id = p_category_id
        AND month = transaction_month
        AND year = transaction_year;
      END IF;
    END IF;
  END IF;
END$$
DELIMITER ;

-- Create views for reports
CREATE VIEW monthly_summary AS
SELECT 
  user_id,
  YEAR(transaction_date) as year,
  MONTH(transaction_date) as month,
  type,
  SUM(amount) as total_amount
FROM transactions
GROUP BY user_id, YEAR(transaction_date), MONTH(transaction_date), type;

CREATE VIEW category_breakdown AS
SELECT 
  t.user_id,
  YEAR(t.transaction_date) as year,
  MONTH(t.transaction_date) as month,
  c.name as category,
  SUM(t.amount) as total_amount
FROM transactions t
JOIN categories c ON t.category_id = c.category_id
WHERE t.type = 'expense'
GROUP BY t.user_id, YEAR(t.transaction_date), MONTH(t.transaction_date), c.name;

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_budgets_user_period ON budgets(user_id, month, year);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_categories_user ON categories(user_id);
