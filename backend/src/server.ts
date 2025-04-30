import express from 'express';
import cors from 'cors';
import { testConnection } from './config/database';
import { router as authRoutes } from './routes/auth';
import { router as transactionRoutes } from './routes/transactions';
import { router as budgetRoutes } from './routes/budgets';
import { router as categoryRoutes } from './routes/categories';
import { authenticateToken } from './middleware/auth';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/transactions', authenticateToken, transactionRoutes);
app.use('/api/budgets', authenticateToken, budgetRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
    try {
        await testConnection();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 