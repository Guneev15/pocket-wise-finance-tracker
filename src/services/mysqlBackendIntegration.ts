
/**
 * MySQL Backend Integration Guide
 * 
 * This file provides information on how to integrate a MySQL backend with the BudgetWise frontend.
 * In a real production environment, you would implement these API endpoints in your Express.js/Node.js backend.
 */

// Example database schema for MySQL
/*
-- Users Table
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Store hashed passwords, never plaintext
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20)
);

-- Budget Table
CREATE TABLE budgets (
  budget_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Transactions Table (for both income and expenses)
CREATE TABLE transactions (
  transaction_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  category_id INT,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  date DATE NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);
*/

// Example stored procedure for adding transactions
/*
DELIMITER //
CREATE PROCEDURE add_transaction(
  IN p_user_id INT,
  IN p_category_id INT,
  IN p_amount DECIMAL(10, 2),
  IN p_description VARCHAR(255),
  IN p_date DATE,
  IN p_type ENUM('income', 'expense')
)
BEGIN
  INSERT INTO transactions(user_id, category_id, amount, description, date, type)
  VALUES(p_user_id, p_category_id, p_amount, p_description, p_date, p_type);
  
  -- If this is an expense, check if it exceeds the budget
  IF p_type = 'expense' THEN
    CALL check_budget_limit(p_user_id, p_category_id, p_date);
  END IF;
END //
DELIMITER ;
*/

// Example trigger for budget alerts
/*
DELIMITER //
CREATE TRIGGER after_expense_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
  IF NEW.type = 'expense' THEN
    -- Check if exceeds budget
    DECLARE budget_amount DECIMAL(10, 2);
    DECLARE month_expenses DECIMAL(10, 2);
    
    -- Get budget amount for this category and month
    SELECT amount INTO budget_amount
    FROM budgets
    WHERE user_id = NEW.user_id
    AND category_id = NEW.category_id
    AND month = MONTH(NEW.date)
    AND year = YEAR(NEW.date);
    
    -- Get total expenses for this category and month
    SELECT SUM(amount) INTO month_expenses
    FROM transactions
    WHERE user_id = NEW.user_id
    AND category_id = NEW.category_id
    AND type = 'expense'
    AND MONTH(date) = MONTH(NEW.date)
    AND YEAR(date) = YEAR(NEW.date);
    
    -- If over budget, insert into alerts table
    IF budget_amount IS NOT NULL AND month_expenses > budget_amount THEN
      INSERT INTO budget_alerts(user_id, category_id, budget_amount, current_amount, alert_date)
      VALUES(NEW.user_id, NEW.category_id, budget_amount, month_expenses, NOW());
    END IF;
  END IF;
END //
DELIMITER ;
*/

// Example API endpoints to be implemented in Express.js/Node.js backend:

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

/**
 * Example backend endpoints to implement 
 */

// Authentication endpoints
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/forgot-password
// POST /api/auth/reset-password

// User endpoints
// GET /api/users/profile
// PUT /api/users/profile

// Transaction endpoints
// GET /api/transactions
// POST /api/transactions
// PUT /api/transactions/:id
// DELETE /api/transactions/:id

// Budget endpoints
// GET /api/budgets
// POST /api/budgets
// PUT /api/budgets/:id
// DELETE /api/budgets/:id

// Category endpoints
// GET /api/categories
// POST /api/categories
// PUT /api/categories/:id
// DELETE /api/categories/:id

// Report endpoints
// GET /api/reports/monthly-summary
// GET /api/reports/category-breakdown
// GET /api/reports/income-vs-expense
// GET /api/reports/yearly-comparison

/**
 * Sample implementation of an Express.js backend would look like:
 * 
 * const express = require('express');
 * const mysql = require('mysql2/promise');
 * const bcrypt = require('bcrypt');
 * const jwt = require('jsonwebtoken');
 * const cors = require('cors');
 * 
 * const app = express();
 * app.use(cors());
 * app.use(express.json());
 * 
 * // Create MySQL connection pool
 * const pool = mysql.createPool({
 *   host: process.env.DB_HOST,
 *   user: process.env.DB_USER,
 *   password: process.env.DB_PASSWORD,
 *   database: process.env.DB_NAME,
 *   waitForConnections: true,
 *   connectionLimit: 10,
 *   queueLimit: 0
 * });
 * 
 * // User registration
 * app.post('/api/auth/register', async (req, res) => {
 *   try {
 *     const { name, email, password } = req.body;
 *     
 *     // Hash password
 *     const hashedPassword = await bcrypt.hash(password, 10);
 *     
 *     // Insert user into database
 *     const [result] = await pool.execute(
 *       'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
 *       [name, email, hashedPassword]
 *     );
 *     
 *     res.status(201).json({ userId: result.insertId, name, email });
 *   } catch (error) {
 *     console.error(error);
 *     res.status(500).json({ message: 'An error occurred during registration' });
 *   }
 * });
 * 
 * // ... implement other endpoints similarly
 * 
 * const PORT = process.env.PORT || 3001;
 * app.listen(PORT, () => {
 *   console.log(`Server running on port ${PORT}`);
 * });
 */

// For a complete implementation, you would need to:
// 1. Set up a Node.js/Express.js server
// 2. Configure MySQL database connection
// 3. Implement all the API endpoints using the database schema and stored procedures
// 4. Set up authentication middleware using JWT
// 5. Implement input validation and error handling
// 6. Set up logging and monitoring
// 7. Deploy the backend to a production server

export {};
