/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { query } from "../config/database";

const router = Router();

// Get all categories for a user
router.get("/", async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    const { type } = req.query;

    let sql = "SELECT * FROM categories WHERE user_id = ?";
    const params: any[] = [user_id];

    if (type) {
      sql += " AND type = ?";
      params.push(type);
    }

    sql += " ORDER BY name ASC";

    const categories = await query(sql, params);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Create a new category
router.post("/", async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    const { name, type } = req.body;

    // Check if category with same name and type already exists
    const existingCategoriesResult = await query(
      "SELECT id FROM categories WHERE user_id = ? AND name = ? AND type = ?",
      [user_id, name, type]
    );
    const existingCategories = Array.isArray(existingCategoriesResult)
      ? existingCategoriesResult
      : [];

    if (Array.isArray(existingCategories) && existingCategories.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const insertResult = await query(
      "INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)",
      [user_id, name, type]
    );

    const categoryId = (insertResult as any).insertId;

    // Fetch the created category
    const createdCategoryResult = await query(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId]
    );

    const createdCategory = Array.isArray(createdCategoryResult)
      ? createdCategoryResult[0]
      : null;

    res.status(201).json(createdCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category" });
  }
});

// Update a category
router.put("/:id", async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    const categoryId = req.params.id;
    const { name, type } = req.body;

    // Check if category exists and belongs to user
    const categories = await query(
      "SELECT id FROM categories WHERE id = ? AND user_id = ?",
      [categoryId, user_id]
    );

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if new name conflicts with existing category
    const existingCategoriesResult = await query(
      "SELECT id FROM categories WHERE user_id = ? AND name = ? AND type = ? AND id != ?",
      [user_id, name, type, categoryId]
    );
    const existingCategories = Array.isArray(existingCategoriesResult)
      ? existingCategoriesResult
      : [];

    if (existingCategories.length > 0) {
      return res
        .status(400)
        .json({ message: "Category name already exists for this type" });
    }

    await query(
      "UPDATE categories SET name = ?, type = ? WHERE id = ? AND user_id = ?",
      [name, type, categoryId, user_id]
    );

    // Fetch the updated category
    const updatedCategoriesResult = await query(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId]
    );

    const updatedCategories = Array.isArray(updatedCategoriesResult)
      ? updatedCategoriesResult
      : [];
    res.json(updatedCategories[0] || null);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category" });
  }
});

// Delete a category
router.delete("/:id", async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    const categoryId = req.params.id;

    // Check if category has any transactions
    const transactionsResult = await query(
      "SELECT id FROM transactions WHERE category_id = ?",
      [categoryId]
    );
    const transactions = Array.isArray(transactionsResult)
      ? transactionsResult
      : [];

    if (Array.isArray(transactions) && transactions.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with existing transactions. Please delete or reassign transactions first.",
      });
    }

    const result = await query(
      "DELETE FROM categories WHERE id = ? AND user_id = ?",
      [categoryId, user_id]
    );

    if ((result as any)?.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category" });
  }
});

export { router };
