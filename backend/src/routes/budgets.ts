/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
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
            SELECT b.*, c.name as category_name
            FROM budgets b
            JOIN categories c ON b.category_id = c.category_id
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
    const { category: category_id, amount, month, year } = req.body;

    const existingBudgetIdArray = await query(
      "SELECT budget_id FROM budgets WHERE user_id = ? AND category_id = ? AND month = ? AND year = ?",
      [user_id, category_id, month, year]
    );

    const budgetsArray = Array.isArray(existingBudgetIdArray)
      ? existingBudgetIdArray
      : [];

    const existing_budget = budgetsArray[0] as RowDataPacket;
    let budget_id = existing_budget?.budget_id;
    let result;
    if (!budget_id) {
      budget_id = uuidv4();
      result = await query(
        "INSERT INTO budgets (budget_id,user_id, category_id, amount, month, year) VALUES (?, ?, ?, ?, ?, ?)",
        [budget_id, user_id, category_id, amount, month, year]
      );
    } else {
      const updatedAmount = +(existing_budget?.amount ?? 0) + amount;
      result = await query(
        "UPDATE budgets SET amount = ? WHERE budget_id = ?",
        [updatedAmount, budget_id]
      );
    }

    res.status(201).json({
      message: "Budget created successfully",
      budget_id,
      result,
    });
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ message: "Error creating budget" });
  }
});

// Delete a budget
router.delete("/:id", async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    const budgetId = req.params.id;

    const result = await query(
      "DELETE FROM budgets WHERE budget_id = ? AND user_id = ?",
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

export { router };
