import { Router } from "express";
import { query } from "../config/database";

// Define proper type interfaces for better type safety
interface User {
  user_id: number | string;
}

interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  category_name?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const router = Router();

// Get all transactions for a user
router.get("/", async (req, res) => {
  try {
    const user_id = req.user?.user_id;

    // Check if user is authenticated
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { startDate, endDate } = req.query;

    let sql = `
            SELECT t.*, c.name as category_name 
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            WHERE t.user_id = ?
        `;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any[] = [user_id];

    if (startDate) {
      sql += " AND t.created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND t.created_at <= ?";
      params.push(endDate);
    }

    sql += " ORDER BY t.created_at DESC";

    const transactions = await query(sql, params);
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Create a new transaction
router.post("/", async (req, res) => {
  try {
    const user_id = req.user?.user_id;

    // Check if user is authenticated
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { category_id, amount, description, date, type } = req.body;

    // Validate required fields
    if (!category_id || !amount || !date || !type) {
      return res.status(400).json({
        message:
          "Missing required fields: category_id, amount, date, and type are required",
      });
    }

    // Validate transaction type
    if (type !== "income" && type !== "expense") {
      return res.status(400).json({
        message: 'Type must be either "income" or "expense"',
      });
    }

    // Validate category belongs to user
    const categoriesResult = await query(
      "SELECT id FROM categories WHERE id = ? AND user_id = ?",
      [category_id, user_id]
    );

    const categories = Array.isArray(categoriesResult) ? categoriesResult : [];

    if (categories.length === 0) {
      return res
        .status(404)
        .json({ message: "Category not found or does not belong to user" });
    }

    const result = await query(
      "INSERT INTO transactions (user_id, category_id, amount, description, date, type) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, category_id, amount, description || "", date, type]
    );

    const insertId =
      (
        result as {
          insertId: number;
        }
      )?.insertId ?? null;

    if (!insertId) {
      return res.status(500).json({ message: "Failed to create transaction" });
    }

    // Fetch the created transaction with category name
    const transactionsResult = await query(
      `SELECT t.*, c.name as category_name 
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE t.id = ?`,
      [insertId]
    );
    const transactionsArray = Array.isArray(transactionsResult)
      ? transactionsResult
      : [];
    console.log("Created transaction:", transactionsResult);

    const transactions = Array.isArray(transactionsArray)
      ? transactionsArray
      : [];

    if (transactions.length === 0) {
      return res.status(404).json({ message: "Created transaction not found" });
    }

    res.status(201).json(transactions[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      message: "Error creating transaction",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
});

// Update a transaction
router.put("/:id", async (req, res) => {
  try {
    const user_id = req.user?.user_id;

    // Check if user is authenticated
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactionId = req.params.id;
    const { category_id, amount, description, date, type } = req.body;

    // Check if transaction exists and belongs to user
    const transactionsResult = await query(
      "SELECT id FROM transactions WHERE id = ? AND user_id = ?",
      [transactionId, user_id]
    );

    const transactions = Array.isArray(transactionsResult)
      ? transactionsResult
      : [];

    if (transactions.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Validate category belongs to user
    const categoriesResult = await query(
      "SELECT id FROM categories WHERE id = ? AND user_id = ?",
      [category_id, user_id]
    );

    const categories = Array.isArray(categoriesResult) ? categoriesResult : [];

    if (categories.length === 0) {
      return res
        .status(404)
        .json({ message: "Category not found or does not belong to user" });
    }

    await query(
      "UPDATE transactions SET category_id = ?, amount = ?, description = ?, date = ?, type = ? WHERE id = ? AND user_id = ?",
      [category_id, amount, description, date, type, transactionId, user_id]
    );

    // Fetch the updated transaction with category name
    const updatedTransactionsResult = await query(
      `SELECT t.*, c.name as category_name 
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE t.id = ?`,
      [transactionId]
    );

    const updatedTransactions = Array.isArray(updatedTransactionsResult)
      ? updatedTransactionsResult
      : [];

    if (updatedTransactions.length === 0) {
      return res.status(404).json({ message: "Updated transaction not found" });
    }

    res.json(updatedTransactions[0]);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Error updating transaction" });
  }
});

// Delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    const user_id = req.user?.user_id;

    // Check if user is authenticated
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactionId = req.params.id;

    // Validate that the transaction exists and belongs to the user before attempting to delete
    const checkResult = await query(
      "SELECT id FROM transactions WHERE id = ? AND user_id = ?",
      [transactionId, user_id]
    );

    const transactions = Array.isArray(checkResult) ? checkResult : [];

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or does not belong to user" });
    }

    const result = await query(
      "DELETE FROM transactions WHERE id = ? AND user_id = ?",
      [transactionId, user_id]
    );

    const affectedRows =
      result && typeof result === "object" && "affectedRows" in result
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any).affectedRows
        : 0;

    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Transaction could not be deleted" });
    }

    res.json({
      message: "Transaction deleted successfully",
      id: transactionId,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      message: "Error deleting transaction",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
});

export { router };
