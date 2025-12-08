import {neon} from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// crete a SQL connection using our neon DB url  
export const sql = neon(process.env.DATABASE_URL);
export async function initDB(){
    try {
        await sql `CREATE TABLE IF NOT EXISTS tractions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

// DECIMAL(10, 2) is used to store numbers with up to 10 digits,
// including 2 digits after the decimal point.
// so:the max value is can be 99999999.99.

        console.log("Database initialized successfully");
    } catch (error) {
        console.log("Error initializing database:", error);
        process.exit(1);  // status code 1 means failure and 0 mean success
    }
};