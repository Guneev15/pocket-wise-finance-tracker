import { Router } from 'express';
import { query } from '../config/database';

const router = Router();

// Get all transactions for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { startDate, endDate, type } = req.query;

        let sql = `
            SELECT t.*, c.name as category_name 
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ?
        `;
        const params: any[] = [userId];

        if (startDate) {
            sql += ' AND t.date >= ?';
            params.push(startDate);
        }
        if (endDate) {
            sql += ' AND t.date <= ?';
            params.push(endDate);
        }
        if (type) {
            sql += ' AND t.type = ?';
            params.push(type);
        }

        sql += ' ORDER BY t.date DESC';

        const transactions = await query(sql, params);
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

// Create a new transaction
router.post('/', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { category_id, amount, description, date, type } = req.body;

        // Validate category belongs to user
        const [categories] = await query(
            'SELECT id FROM categories WHERE id = ? AND user_id = ?',
            [category_id, userId]
        );

        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const [result] = await query(
            'INSERT INTO transactions (user_id, category_id, amount, description, date, type) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, category_id, amount, description, date, type]
        );

        const transactionId = (result as any).insertId;

        // Fetch the created transaction with category name
        const [transactions] = await query(
            `SELECT t.*, c.name as category_name 
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE t.id = ?`,
            [transactionId]
        );

        res.status(201).json(transactions[0]);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Error creating transaction' });
    }
});

// Update a transaction
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const transactionId = req.params.id;
        const { category_id, amount, description, date, type } = req.body;

        // Check if transaction exists and belongs to user
        const [transactions] = await query(
            'SELECT id FROM transactions WHERE id = ? AND user_id = ?',
            [transactionId, userId]
        );

        if (!Array.isArray(transactions) || transactions.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Validate category belongs to user
        const [categories] = await query(
            'SELECT id FROM categories WHERE id = ? AND user_id = ?',
            [category_id, userId]
        );

        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await query(
            'UPDATE transactions SET category_id = ?, amount = ?, description = ?, date = ?, type = ? WHERE id = ? AND user_id = ?',
            [category_id, amount, description, date, type, transactionId, userId]
        );

        // Fetch the updated transaction with category name
        const [updatedTransactions] = await query(
            `SELECT t.*, c.name as category_name 
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             WHERE t.id = ?`,
            [transactionId]
        );

        res.json(updatedTransactions[0]);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Error updating transaction' });
    }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user?.userId;
        const transactionId = req.params.id;

        const [result] = await query(
            'DELETE FROM transactions WHERE id = ? AND user_id = ?',
            [transactionId, userId]
        );

        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Error deleting transaction' });
    }
});

export { router as transactionRoutes }; 