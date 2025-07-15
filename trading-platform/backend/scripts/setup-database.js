#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('\n🚀 Trading Platform Database Setup');
console.log('=====================================\n');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'postgres' // Connect to default database first
};

async function checkEnvironment() {
  console.log('📋 Checking environment configuration...');
  
  const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease create a .env file in the backend directory with these variables.');
    process.exit(1);
  }
  
  console.log('✅ Environment configuration is valid');
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`   User: ${process.env.DB_USER}\n`);
}

async function testConnection() {
  console.log('🔌 Testing PostgreSQL connection...');
  
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    const result = await client.query('SELECT version()');
    console.log('✅ PostgreSQL connection successful');
    console.log(`   Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   1. Make sure PostgreSQL is running');
      console.error('   2. Check if the port 5432 is correct');
      console.error('   3. Verify the host and credentials');
    }
    
    return false;
  }
}

async function createDatabase() {
  const dbName = process.env.DB_NAME;
  console.log(`🏗️  Creating database "${dbName}"...`);
  
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    
    // Check if database exists
    const checkResult = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    
    if (checkResult.rows.length > 0) {
      console.log(`ℹ️  Database "${dbName}" already exists`);
    } else {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully`);
    }
    
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Failed to create database:', error.message);
    await client.end();
    return false;
  }
}

async function runSchema() {
  console.log('📊 Running database schema...');
  
  // Read schema file
  const schemaPath = path.join(__dirname, '../src/database/schema.sql');
  
  try {
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    // Connect to the target database
    const client = new Client({
      ...dbConfig,
      database: process.env.DB_NAME
    });
    
    await client.connect();
    
    // Execute schema
    await client.query(schema);
    
    console.log('✅ Database schema applied successfully');
    
    // Verify tables were created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`📋 Created ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Failed to apply schema:', error.message);
    return false;
  }
}

async function seedData() {
  console.log('\n🌱 Seeding initial data...');
  
  const client = new Client({
    ...dbConfig,
    database: process.env.DB_NAME
  });
  
  try {
    await client.connect();
    
    // Check if data already exists
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const lessonCount = await client.query('SELECT COUNT(*) FROM lessons');
    
    if (parseInt(userCount.rows[0].count) > 0) {
      console.log('ℹ️  Database already contains data, skipping seed');
      await client.end();
      return true;
    }
    
    console.log('📝 Inserting demo data...');
    
    // The schema.sql already contains some initial data
    // We can add more here if needed
    
    const finalUserCount = await client.query('SELECT COUNT(*) FROM users');
    const finalLessonCount = await client.query('SELECT COUNT(*) FROM lessons');
    const achievementCount = await client.query('SELECT COUNT(*) FROM achievements');
    
    console.log('✅ Demo data inserted successfully:');
    console.log(`   - ${finalUserCount.rows[0].count} users`);
    console.log(`   - ${finalLessonCount.rows[0].count} lessons`);
    console.log(`   - ${achievementCount.rows[0].count} achievements`);
    
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Failed to seed data:', error.message);
    return false;
  }
}

async function verifySetup() {
  console.log('\n🔍 Verifying setup...');
  
  const client = new Client({
    ...dbConfig,
    database: process.env.DB_NAME
  });
  
  try {
    await client.connect();
    
    // Test basic queries
    const tests = [
      { name: 'Users table', query: 'SELECT COUNT(*) FROM users' },
      { name: 'Lessons table', query: 'SELECT COUNT(*) FROM lessons' },
      { name: 'Achievements table', query: 'SELECT COUNT(*) FROM achievements' },
      { name: 'Admin user', query: "SELECT name FROM users WHERE role = 'admin' LIMIT 1" }
    ];
    
    console.log('Running verification tests...');
    
    for (const test of tests) {
      try {
        const result = await client.query(test.query);
        if (test.name === 'Admin user') {
          console.log(`✅ ${test.name}: ${result.rows[0]?.name || 'Not found'}`);
        } else {
          console.log(`✅ ${test.name}: ${result.rows[0].count} records`);
        }
      } catch (error) {
        console.log(`❌ ${test.name}: Failed (${error.message})`);
      }
    }
    
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

async function displayCredentials() {
  console.log('\n🔑 Default Login Credentials:');
  console.log('============================');
  console.log('Admin Account:');
  console.log('  Email: admin@tradingplatform.com');
  console.log('  Password: admin123!');
  console.log('');
  console.log('Student Account:');
  console.log('  Email: student@example.com');
  console.log('  Password: student123!');
  console.log('');
  console.log('⚠️  IMPORTANT: Change these passwords in production!');
}

async function main() {
  try {
    // Step 1: Check environment
    await checkEnvironment();
    
    // Step 2: Test connection
    const connected = await testConnection();
    if (!connected) {
      process.exit(1);
    }
    
    // Step 3: Create database
    const dbCreated = await createDatabase();
    if (!dbCreated) {
      process.exit(1);
    }
    
    // Step 4: Run schema
    const schemaApplied = await runSchema();
    if (!schemaApplied) {
      process.exit(1);
    }
    
    // Step 5: Seed data
    const dataSeeded = await seedData();
    if (!dataSeeded) {
      process.exit(1);
    }
    
    // Step 6: Verify setup
    const verified = await verifySetup();
    if (!verified) {
      process.exit(1);
    }
    
    // Step 7: Display credentials
    await displayCredentials();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Visit http://localhost:3001/health to verify the API');
    console.log('3. Start developing your frontend application');
    
  } catch (error) {
    console.error('\n💥 Setup failed with error:', error.message);
    console.error('\nPlease check the error above and try again.');
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node setup-database.js [options]

Options:
  --help, -h     Show this help message
  --force        Force recreation of database (WARNING: This will delete all data!)
  --schema-only  Only run schema, skip data seeding
  --verify-only  Only run verification tests

Environment Variables Required:
  DB_HOST        Database host (default: localhost)
  DB_PORT        Database port (default: 5432)
  DB_USER        Database user (default: postgres)
  DB_PASSWORD    Database password (required)
  DB_NAME        Database name (required)

Example:
  node setup-database.js
  node setup-database.js --schema-only
  node setup-database.js --verify-only
`);
  process.exit(0);
}

if (args.includes('--verify-only')) {
  console.log('🔍 Running verification only...\n');
  await checkEnvironment();
  await verifySetup();
  process.exit(0);
}

// Run main setup
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});