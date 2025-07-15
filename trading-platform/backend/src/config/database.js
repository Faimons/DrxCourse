// src/config/database.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'trading_mastery',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

export async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

export { pool };
export default pool;
