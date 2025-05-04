/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { query } from "../config/database";
import { RowDataPacket } from "mysql2";

const router = Router();

// Get all budgets for a user
router.get("/", async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    const { month } = req.query;

    let sql = `
            SELECT b.*, c.name as category_name, c.type as category_type
            FROM budgets b
            JOIN categories c ON b.category_id = c.id
            WHERE b.user_id = ?
        `;
    const params: any[] = [user_id];

    if (month) {
      sql += " AND b.month = ?";
      params.push(month);
    }

    sql += " ORDER BY b.month DESC, c.name ASC";

    const budgets = await query(sql, params);
    res.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Error fetching budgets" });
  }
});

// Create a new budget
router.post("/", async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    const { category_id, amount, month } = req.body;

    // Validate category belongs to user
    const categoriesResult = (await query(
      "SELECT id FROM categories WHERE id = ? AND user_id = ?",
      [category_id, user_id]
    )) as RowDataPacket[];
    const categories = Array.isArray(categoriesResult) ? categoriesResult : [];

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if budget already exists for this category and month
    const existingBudgets = await query(
      "SELECT id FROM budgets WHERE user_id = ? AND category_id = ? AND month = ?",
      [user_id, category_id, month]
    );

    if (Array.isArray(existingBudgets) && existingBudgets.length > 0) {
      return res
        .status(400)
        .json({ message: "Budget already exists for this category and month" });
    }

    const result = await query(
      "INSERT INTO budgets (user_id, category_id, amount, month) VALUES (?, ?, ?, ?)",
      [user_id, category_id, amount, month]
    );

    const budgetId = (result as any).insertId;

    // Fetch the created budget with category details
    const budgets = await query(
      `SELECT b.*, c.name as category_name, c.type as category_type
             FROM budgets b
             JOIN categories c ON b.category_id = c.id
             WHERE b.id = ?`,
      [budgetId]
    );

    res.status(201).json((budgets as RowDataPacket[])[0]);
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ message: "Error creating budget" });
  }
});

// Update a budget
router.put("/:id", async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    const budgetId = req.params.id;
    const { amount, month } = req.body;

    // Check if budget exists and belongs to user
    const budgets = await query(
      "SELECT id, category_id FROM budgets WHERE id = ? AND user_id = ?",
      [budgetId, user_id]
    );

    if (!Array.isArray(budgets) || budgets.length === 0) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const categoryId = (budgets[0] as any).category_id;

    // Check if new month conflicts with existing budget
    const existingBudgets = (await query(
      "SELECT id FROM budgets WHERE user_id = ? AND category_id = ? AND month = ? AND id != ?",
      [user_id, categoryId, month, budgetId]
    )) as RowDataPacket[];

    if (Array.isArray(existingBudgets) && existingBudgets.length > 0) {
      return res
        .status(400)
        .json({ message: "Budget already exists for this category and month" });
    }

    await query(
      "UPDATE budgets SET amount = ?, month = ? WHERE id = ? AND user_id = ?",
      [amount, month, budgetId, user_id]
    );

    // Fetch the updated budget with category details
    const updatedBudgets = await query(
      `SELECT b.*, c.name as category_name, c.type as category_type
             FROM budgets b
             JOIN categories c ON b.category_id = c.id
             WHERE b.id = ?`,
      [budgetId]
    );

    res.json((updatedBudgets as RowDataPacket[])[0]);
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Error updating budget" });
  }
});

// Delete a budget
router.delete("/:id", async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    const budgetId = req.params.id;

    const result = await query(
      "DELETE FROM budgets WHERE id = ? AND user_id = ?",
      [budgetId, user_id]
    );

    if ((result as any)?.affectedRows === 0) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ message: "Error deleting budget" });
  }
});

// Get budget summary for a month
router.get("/summary", async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required" });
    }

    // Get all budgets for the month
    const budgets = (await query(
      `SELECT b.*, c.name as category_name, c.type as category_type
             FROM budgets b
             JOIN categories c ON b.category_id = c.id
             WHERE b.user_id = ? AND b.month = ?`,
      [user_id, month]
    )) as RowDataPacket[];

    // Get actual spending for each category
    const transactionsResult = await query(
      `SELECT t.category_id, c.type, SUM(t.amount) as total
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE t.user_id = ? AND DATE_FORMAT(t.date, '%Y-%m') = ?
             GROUP BY t.category_id, c.type`,
      [user_id, month]
    );
    const transactions = Array.isArray(transactionsResult)
      ? (transactionsResult as RowDataPacket[])
      : [];

    // Calculate summary
    const summary = {
      total_budget: 0,
      total_spent: 0,
      categories: [] as any[],
    };

    // Process budgets
    if (Array.isArray(budgets)) {
      budgets.forEach((budget: any) => {
        const category = {
          id: budget.category_id,
          name: budget.category_name,
          type: budget.category_type,
          budget: budget.amount,
          spent: 0,
        };

        // Find matching transactions
        if (Array.isArray(transactions)) {
          const transaction = transactions.find(
            (t: any) => t.category_id === budget.category_id
          );
          if (transaction) {
            category.spent = transaction.total;
          }
        }

        summary.categories.push(category);
        if (budget.category_type === "expense") {
          summary.total_budget += budget.amount;
          summary.total_spent += category.spent;
        }
      });
    }

    res.json(summary);
  } catch (error) {
    console.error("Error fetching budget summary:", error);
    res.status(500).json({ message: "Error fetching budget summary" });
  }
});

export { router };
