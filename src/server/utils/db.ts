import mysql from "mysql2/promise";

// Enable detailed logging for database operations
const DEBUG_MODE = process.env.DB_DEBUG === "true" || false;

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "pocketwise",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  debug: DEBUG_MODE,
});

db.getConnection()
  .then((connection) => {
    console.log("Connected to MySQL database at host:", process.env.DB_HOST || "localhost");
    connection.release();
  })
  .catch((error) => {
    console.error("Error connecting to MySQL database:", error.message || error);
    console.error("Ensure the database is running and credentials are correct.");
    process.exit(1); // Exit the process if the database connection fails
  });

// Helper function to execute queries with better error handling and logging
export async function executeQuery(sql: string, params: any[] = []) {
  try {
    if (DEBUG_MODE) {
      console.log("Executing query:", sql, "with params:", params);
    }
    
    const [results] = await db.execute(sql, params); // Extract the first element (result object)
    
    if (DEBUG_MODE) {
      console.log("Query results:", results);
    }
    
    return results; // Return only the result object
  } catch (error: any) {
    console.error("Database query error:", error.message);
    console.error("Failed query:", sql);
    console.error("Query parameters:", params);
    console.error("Stack trace:", error.stack);
    throw error;
  }
}

// Helper function for transactions
export async function withTransaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
