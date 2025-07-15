// src/utils/createDemoUser.js
import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';

export async function initializeDemoData() {
  try {
    console.log('👤 Checking for demo user...');
    
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@tradingplatform.com']
    );

    if (userCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123!', 10);
      
      await pool.query(`
        INSERT INTO users (name, email, password_hash, subscription_status, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `, ['Admin User', 'admin@tradingplatform.com', hashedPassword, 'premium']);

      console.log('✅ Demo user created: admin@tradingplatform.com / admin123!');
    } else {
      console.log('ℹ️ Demo user already exists');
    }
  } catch (error) {
    console.error('❌ Failed to create demo user:', error.message);
  }
}
