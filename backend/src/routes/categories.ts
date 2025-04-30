import { Router } from 'express';
import { query } from '../config/database';

const router = Router();

// Get all categories for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { type } = req.query;

        let sql = 'SELECT * FROM categories WHERE user_id = ?';
        const params: any[] = [userId];

        if (type) {
            sql += ' AND type = ?';
            params.push(type);
        }

        sql += ' ORDER BY name ASC';

        const categories = await query(sql, params);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

// Create a new category
router.post('/', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { name, type } = req.body;

        // Check if category with same name and type already exists
        const [existingCategories] = await query(
            'SELECT id FROM categories WHERE user_id = ? AND name = ? AND type = ?',
            [userId, name, type]
        );

        if (Array.isArray(existingCategories) && existingCategories.length > 0) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const [result] = await query(
            'INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)',
            [userId, name, type]
        );

        const categoryId = (result as any).insertId;

        // Fetch the created category
        const [categories] = await query(
            'SELECT * FROM categories WHERE id = ?',
            [categoryId]
        );

        res.status(201).json(categories[0]);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Error creating category' });
    }
});

// Update a category
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const categoryId = req.params.id;
        const { name, type } = req.body;

        // Check if category exists and belongs to user
        const [categories] = await query(
            'SELECT id FROM categories WHERE id = ? AND user_id = ?',
            [categoryId, userId]
        );

        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if new name conflicts with existing category
        const [existingCategories] = await query(
            'SELECT id FROM categories WHERE user_id = ? AND name = ? AND type = ? AND id != ?',
            [userId, name, type, categoryId]
        );

        if (Array.isArray(existingCategories) && existingCategories.length > 0) {
            return res.status(400).json({ message: 'Category name already exists for this type' });
        }

        await query(
            'UPDATE categories SET name = ?, type = ? WHERE id = ? AND user_id = ?',
            [name, type, categoryId, userId]
        );

        // Fetch the updated category
        const [updatedCategories] = await query(
            'SELECT * FROM categories WHERE id = ?',
            [categoryId]
        );

        res.json(updatedCategories[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Error updating category' });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const categoryId = req.params.id;

        // Check if category has any transactions
        const [transactions] = await query(
            'SELECT id FROM transactions WHERE category_id = ?',
            [categoryId]
        );

        if (Array.isArray(transactions) && transactions.length > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete category with existing transactions. Please delete or reassign transactions first.' 
            });
        }

        const [result] = await query(
            'DELETE FROM categories WHERE id = ? AND user_id = ?',
            [categoryId, userId]
        );

        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deleting category' });
    }
});

export { router as categoryRoutes }; 