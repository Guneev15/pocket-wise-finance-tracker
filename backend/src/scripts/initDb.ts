import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

const initializeDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database. Starting initialization...');

        try {
            // Read SQL setup file
            const sqlPath = path.join(__dirname, '..', 'sql', 'setup.sql');
            const sqlContent = fs.readFileSync(sqlPath, 'utf8');

            // Split SQL content into individual statements
            const statements = sqlContent
                .split(';')
                .map(statement => statement.trim())
                .filter(statement => statement.length > 0);

            // Execute each statement
            for (const statement of statements) {
                await connection.execute(statement);
                console.log('Executed SQL statement successfully');
            }

            console.log('Database initialization completed successfully');
        } catch (error) {
            console.error('Error executing SQL statements:', error);
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

// Run initialization
initializeDatabase().then(() => {
    console.log('Database setup complete');
    process.exit(0);
}).catch((error) => {
    console.error('Failed to setup database:', error);
    process.exit(1);
}); 