import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pocketwise',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection established');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

export const query = async (sql: string, params: any[] = []) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Query failed:', error);
        throw error;
    }
};

export default pool; 