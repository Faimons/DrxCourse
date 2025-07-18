const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

async function createUsers() {
  const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'trading_platform',
    password: 'postgres',
    port: 5432,
  });

  try {
    await pool.query(\
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        status VARCHAR(50) DEFAULT 'active',
        email_verified BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \);

    const adminHash = await bcrypt.hash('admin123!', 12);
    await pool.query(\
      INSERT INTO users (name, email, password, role, status, email_verified) 
      VALUES (\, \, \, \, \, \) 
      ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password
    \, ['Admin User', 'admin@tradingplatform.com', adminHash, 'admin', 'active', true]);

    const studentHash = await bcrypt.hash('student123!', 12);
    await pool.query(\
      INSERT INTO users (name, email, password, role, status, email_verified) 
      VALUES (\, \, \, \, \, \) 
      ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password
    \, ['Student User', 'student@example.com', studentHash, 'student', 'active', true]);

    console.log('✅ Users created successfully!');
    
    const users = await pool.query('SELECT email, role FROM users ORDER BY role');
    console.log('Users in database:');
    users.rows.forEach(user => console.log(\- \ (\)\));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createUsers();
